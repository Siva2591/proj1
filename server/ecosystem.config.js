module.exports = {
    apps: [
      {
        name: 'TouchlessAP',
        script: 'index.js', 
        env: {
          NODE_ENV: 'production',
          MONGODB_URI: 'mongodb://localhost:27017/', 
        },
      },
    ],
  };
  