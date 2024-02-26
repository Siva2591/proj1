require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { simpleParser } = require("mailparser");
const pdf = require("pdf-parse");
const Imap = require("imap");
const { connect, close } = require("./dbConnection");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const fs = require("fs");
const { ObjectId } = require("mongodb");
const path = require('path');

const app = express();
app.use(cors({}));
const PORT = process.env.PORT || 3000;

const buildpath = path.join(__dirname, '../client/build');
app.use(express.static(buildpath));

app.use(bodyParser.json());

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const parseTextToJSON = (pdfText) => {
  const lines = pdfText.split("\n");
  const jsonResult = {
    CompanyName: lines[2].replace("PURCHASE", "").trim(),
    PO_Number: lines[5].split(" ")[1].substring(1),
    Quantity: lines[9].split(" ")[2].replace("10.00", "").trim(),
    Amount: lines[10].split(" ")[1],
  };
  return jsonResult;
};

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: "Internal Server Error" });
});

app.post("/api/parse-emails", async (req, res) => {
  const imapConfig = {
    user: req.body.user,
    password: req.body.password,
    host: req.body.host,
    port: req.body.port,
    tls: req.body.tls,
  };

  try {
    const imap = new Imap(imapConfig);
    imap.once("ready", () => {
      imap.openBox("INBOX", false, () => {
        imap.search(["UNSEEN", ["SINCE", new Date()]], (err, results) => {
          if (err) {
            return next(err);
          }

          if (results.length === 0) {
            res.json({ success: true, message: "No new messages to fetch" });
            imap.end();
            return;
          }

          const f = imap.fetch(results, { bodies: "" });
          let attachmentsCount = 0;
          let attachmentsData = [];

          f.on("message", (msg) => {
            let senderEmail;
            msg.on("body", (stream) => {
              simpleParser(stream, async (err, parsed) => {
                const { attachments, from } = parsed;

                senderEmail = from.value[0].address;

                if (Array.isArray(attachments) && attachments.length > 0) {
                  console.log(`Number of attachments: ${attachments.length}`);
                  attachmentsCount += attachments.length;

                  for (let i = 0; i < attachments.length; i++) {
                    const currentAttachment = attachments[i];

                    if (currentAttachment.contentType === "application/pdf") {
                      const pdfBuffer = currentAttachment.content;
                      try {
                        const data = await pdf(pdfBuffer);
                        const pdfText = data.text;

                        const jsonFromText = parseTextToJSON(pdfText);

                        content = fs.writeFile(
                          "attachment.pdf",
                          pdfBuffer,
                          (err) => {
                            if (err) {
                              console.error("Error writing PDF file:", err);
                              res.status(500).json({
                                success: false,
                                error: "Error writing PDF file",
                              });
                              return;
                            } else {
                              console.log(
                                "PDF file has been successfully created."
                              );
                            }
                          }
                        );

                        const json = pdfBuffer.toJSON();
                        attachmentsData.push({
                          ...jsonFromText,
                          pdfBuffer: pdfBuffer.toString("base64"),
                          senderEmail,
                          attachmentsCount,
                        });

                        if (i === attachments.length - 1) {
                          const dbo = await connect();
                          await dbo
                            .collection("orderdetails")
                            .insertMany(attachmentsData);
                          close();
                        }
                      } catch (jsonError) {
                        res.status(500).json({
                          success: false,
                          error: jsonError.message,
                        });
                      }
                    } else {
                      res.status(400).json({
                        success: false,
                        error: "Attachment is not a PDF",
                      });
                    }
                  }
                } else {
                  attachmentsCount = 0;
                  console.log(senderEmail);
                  const dbo = await connect();
                  await dbo.collection("orderdetails").insertOne({
                    companyName: "",
                    po_number: "",
                    quantity: "",
                    Amount: "",
                    pdfBuffer: "",
                    senderEmail,
                    attachmentsCount,
                  });
                  close();
                }
              });
            });

            msg.once("attributes", (attrs) => {
              const { uid } = attrs;
              imap.addFlags(uid, ["\\Seen"], () => {
                console.log("Marked as read!");
              });
            });
          });

          f.once("error", (ex) => {
            console.log(ex.message);
            res.status(500).json({ success: false, error: ex.message });
          });

          f.once("end", () => {
            console.log("Done fetching all messages!");
            imap.end();
          });
        });
      });
    });

    imap.once("error", (err) => {
      console.log(err);
      res.status(500).json({ success: false, error: err.message });
    });

    imap.once("end", () => {
      console.log("Connection ended");
    });

    imap.connect();
  } catch (ex) {
    res.status(500).json({ success: false, error: ex.message });
  }
});

app.get("/api/get-data", async (req, res) => {
  try {
    const dbo = await connect();
    const orders = await dbo.collection("orderdetails").find({}).toArray();
    close();

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.delete("/api/delete-data/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;
    console.log("Deleting order with ID:", orderId);
    if (!ObjectId.isValid(orderId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid Order Id" });
    }
    const dbo = await connect();
    const query = { _id: new ObjectId(orderId) };
    const result = await dbo.collection("orderdetails").deleteOne(query);
    if (result.deletedCount === 1) {
      console.log("Order deleted successfully");
      res
        .status(200)
        .json({ success: true, message: "Order deleted successfully" });
    } else {
      res.status(400).json({ success: false, error: "Order not found" });
    }
    close();
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
