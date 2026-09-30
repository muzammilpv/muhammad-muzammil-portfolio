const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const zipPath = path.join(__dirname, 'mingit.zip');
const targetDir = `C:\\Users\\ASUS\\git-portable`;

if (fs.existsSync(zipPath)) {
  console.log("Extracting mingit.zip...");
  try {
    const cmd = `powershell -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${targetDir}' -Force"`;
    execSync(cmd);
    console.log("Extracted mingit successfully!");
  } catch (e) {
    console.error("Extraction error:", e.message);
  }
} else {
  console.log("Zip file not found, checking C:\\Users\\ASUS\\git-portable");
}
