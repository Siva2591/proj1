const fs = require("fs");
const pdf = require("pdf-parse");

async function extractDataWithKeywords(pdfPath, jsonPath, keywords) {
    const pdfData = [];

    // Read the PDF file
    const pdfBuffer = await fs.promises.readFile(pdfPath);

    // Parse the PDF
    const data = await pdf(pdfBuffer);
    // console.log(data.numpages);
    // Iterate through all pages
    console.log("start");

    for (let pageNum = 0; pageNum < data.numpages; pageNum++) {
        console.log("FOR loop");

        const pageText = data.text;
        console.log(pageText);

        // Create a dictionary for each keyword on the page
        const extractedData = { page_number: pageNum + 1 };

        for (const keyword of keywords) {
            const keywordPosition = pageText.indexOf(keyword);
            if (keywordPosition !== -1) {
                // Extract data around the keyword (adjust the context as needed)
                const startPosition = Math.max(0, keywordPosition - 50);
                const endPosition = Math.min(pageText.length, keywordPosition + 100);
                extractedData[keyword] = pageText
                    .substring(startPosition, endPosition)
                    .trim();
            } else {
                extractedData[keyword] = null;
            }
        }

        // Append the extracted data to the list
        pdfData.push(extractedData);
    }
    console.log("end");

    // Convert the list of dictionaries to JSON and save to a file
    await fs.promises.writeFile(jsonPath, JSON.stringify(pdfData, null, 2));

    console.log(
        "PDF data containing keywords has been successfully extracted and saved to '" +
        jsonPath +
        "'."
    );
}

// Replace 'input.pdf' with the path to your PDF file
// Replace 'output.json' with the desired output JSON file path
const pdfPath = "C:/Users/ASUS/Desktop/React/sample (2).pdf";
const jsonPath = "output.json";

// Define the keywords you want to search for
const searchKeywords = [
    "Name of the Exhibitor",
    "Address",
    "Website",
    "Contact Person",
    "Designation",
    "Mobile",
    "Email",
    "Profile",
];

extractDataWithKeywords(pdfPath, jsonPath, searchKeywords);








////////////////////////////////////////////////////////////////////

    // Company_Name: getLineValue(lines, 2).trim(),
    // Po_Number: getLineValue(lines, 5,'VendorOrder').trim(),
    // qty: getLineValue(lines, 9,'PLASTIC Qty').trim(),
    // amount:getLineValue(lines, 10,'TOTAL').trim(),

// const getLineValue = (lines, index, key,key2) => {
//   const line = lines[index];
//   if (line) {
//     if (key) {
//       const keyIndex = line.indexOf(key);
//       if (keyIndex !== -1) {
//         console.log(keyIndex);
//         return line.slice(keyIndex + key.length).trim();
//       }
//     } else {
//       return line.trim();
//     }
//     if (key2) {
//       const keyIndex1 = line.indexOf(key2);
//       if (keyIndex1 !== -1) {
//         console.log(keyIndex1);
//         return line.slice(keyIndex1 + key2.length).split();
//       }
//     } else {
//       return line.trim();
//     }
//   }
//   return '';
// };