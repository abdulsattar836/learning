const getExtensionOfFile = (fileName) => {
  let lastDotIndex = fileName.lastIndexOf(".");

  // Split the string into two parts based on the last dot
  let firstPart = fileName.substring(0, lastDotIndex);
  let secondPart = fileName.substring(lastDotIndex + 1);

  // Create an array with the two parts
  return secondPart;
};

const deleteFile = async (path) => {
  const fs = require("fs");
  return new Promise((resolve) => {
    fs.unlink("./" + path, (err) => {
      if (err) {
        console.log(`no file exist with ${path} location`);
      } else {
        console.log(`${path} file delete successfully`);
      }
      resolve(); // Resolve the promise after unlink completes
    });
  });
};

function fileExistsSync(fileName) {
  const fs = require("fs");
  const path = require("path");
  // Example usage
  const folderPath = path.join(__dirname, "../../");
  const filePath = path.join(folderPath, fileName);
  return fs.existsSync(filePath);
}

module.exports = {
  getExtensionOfFile,
  deleteFile,
  fileExistsSync,
};
