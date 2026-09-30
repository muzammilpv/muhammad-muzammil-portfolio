const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const files = [
  { id: '1uLNMNiizMPwrvwZtEhOj-r6WrXtUOlQr', filename: 'sup-video.mp4', title: 'SILVER UNITED PROJECT' },
  { id: '12kPMs60JE1GwTs3iUyh1kH9mR0hrMO_G', filename: 'abba-perfume.mp4', title: 'ABBA PERFUME — ZANOTTI' },
  { id: '1cQOQYutGhG0e6ZaESAzDv92dScxZ4jax', filename: 'abba-fuego.mov', title: 'ABBA FUEGO' },
  { id: '1AhDarzIipIUyvldLDZxMGa4TlfBBpLri', filename: 'mimio-sushi.mp4', title: 'MIMIO SUSHI' },
  { id: '1p0rGtw4Y_LdF4GY_MN5NOL3j4kCl9lCi', filename: 'aiora-media.mp4', title: 'AIORA MEDIA' }
];

const destDir = path.join(__dirname, 'assets', 'videos');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

function downloadFile(fileId, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(destDir, filename);
    console.log(`Starting download for ${filename} (ID: ${fileId})...`);

    const initialUrl = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`;

    function get(url) {
      const client = url.startsWith('https') ? https : http;
      client.get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          console.log(`Redirecting for ${filename} -> ${res.headers.location.substring(0, 80)}...`);
          return get(res.headers.location);
        }

        if (res.statusCode !== 200) {
          console.error(`Failed ${filename} with status code: ${res.statusCode}`);
          return resolve(false);
        }

        const fileStream = fs.createWriteStream(filePath);
        res.pipe(fileStream);

        fileStream.on('finish', () => {
          fileStream.close();
          const stats = fs.statSync(filePath);
          console.log(`Finished ${filename}: ${stats.size} bytes`);
          resolve(true);
        });

        fileStream.on('error', (err) => {
          fs.unlink(filePath, () => {});
          console.error(`File stream error for ${filename}:`, err.message);
          resolve(false);
        });
      }).on('error', (err) => {
        console.error(`Request error for ${filename}:`, err.message);
        resolve(false);
      });
    }

    get(initialUrl);
  });
}

async function main() {
  for (const f of files) {
    await downloadFile(f.id, f.filename);
  }
  console.log("All downloads finished!");
}

main();
