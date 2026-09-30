const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const targetDir = `C:\\Users\\ASUS\\git-portable`;
const zipPath = path.join(__dirname, 'mingit.zip');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

console.log("Downloading MinGit portable binary...");
const url = "https://github.com/git-for-windows/git/releases/download/v2.44.0.windows.1/MinGit-2.44.0-64-bit.zip";

function download(u) {
  https.get(u, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      console.log("Redirecting...");
      return download(res.headers.location);
    }

    const fileStream = fs.createWriteStream(zipPath);
    res.pipe(fileStream);

    fileStream.on('finish', () => {
      fileStream.close(() => {
        console.log("Zip downloaded and closed. Extracting now...");
        try {
          const cmd = `powershell -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${targetDir}' -Force"`;
          execSync(cmd);
          console.log("Extracted successfully!");
        } catch (e) {
          console.error("Extraction error:", e.message);
        }
      });
    });
  });
}

download(url);
