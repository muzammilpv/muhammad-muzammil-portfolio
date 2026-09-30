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

function get(u) {
  https.get(u, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      console.log("Redirecting to download...");
      return get(res.headers.location);
    }

    if (res.statusCode !== 200) {
      console.error(`Download failed with status: ${res.statusCode}`);
      return;
    }

    const fileStream = fs.createWriteStream(zipPath);
    res.pipe(fileStream);

    fileStream.on('finish', () => {
      fileStream.close();
      console.log(`MinGit zip downloaded: ${fs.statSync(zipPath).size} bytes. Extracting...`);

      try {
        const cmd = `powershell -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${targetDir}' -Force"`;
        execSync(cmd);
        console.log(`Successfully extracted MinGit to ${targetDir}!`);
        
        const gitExe = path.join(targetDir, 'cmd', 'git.exe');
        console.log(`Git executable ready at: ${gitExe}`);
        
        // Remove zip
        fs.unlinkSync(zipPath);
      } catch (e) {
        console.error("Extraction failed:", e.message);
      }
    });
  });
}

get(url);
