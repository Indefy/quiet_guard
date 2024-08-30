const path = require('path'); // Importing path module
const fs = require('fs');     // Importing fs module

class Logger {
    static logInfo(message) {
        console.log(`[INFO]: ${message}`);
        this.writeToFile(`[INFO]: ${message}`);
    }

    static logError(message, error) {
        console.error(`[ERROR]: ${message} - ${error.message}`);
        this.writeToFile(`[ERROR]: ${message} - ${error.stack}`);
    }

    static logRequest(req) {
        const { method, url, headers, body } = req;
        const logMessage = `[REQUEST]: ${method} ${url} - Headers: ${JSON.stringify(headers)} - Body: ${JSON.stringify(body)}`;
        console.log(logMessage);
        this.writeToFile(logMessage);
    }

    static writeToFile(message) {
        const logFilePath = path.join(__dirname, 'app.log');
        const timestamp = new Date().toISOString();
        fs.appendFileSync(logFilePath, `${timestamp} - ${message}\n`, 'utf8');
    }
}

module.exports = Logger;

// const path = require('path');
// const fs = require('fs'); 
// class Logger {
//   static logInfo(message) {
//       console.log(`[INFO]: ${message}`);
//       this.writeToFile(`[INFO]: ${message}`);
//   }

//   static logError(message, error) {
//       console.error(`[ERROR]: ${message} - ${error.message}`);
//       this.writeToFile(`[ERROR]: ${message} - ${error.stack}`);
//   }

//   static logRequest(req) {
//       const { method, url, headers, body } = req;
//       const logMessage = `[REQUEST]: ${method} ${url} - Headers: ${JSON.stringify(headers)} - Body: ${JSON.stringify(body)}`;
//       console.log(logMessage);
//       this.writeToFile(logMessage);
//   }

//   static writeToFile(message) {
//       const logFilePath = path.join(__dirname, 'app.log');
//       const timestamp = new Date().toISOString();
//       fs.appendFileSync(logFilePath, `${timestamp} - ${message}\n`, 'utf8');
//   }
// }

// module.exports = Logger;