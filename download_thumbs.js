const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const files = [
  { id: '1uLNMNiizMPwrvwZtEhOj-r6WrXtUOlQr', filename: 'sup-thumb.jpg' },
  { id: '12kPMs60JE1GwTs3iUyh1kH9mR0hrMO_G', filename: 'abba-perfume-thumb.jpg' },
  { id: '1cQOQYutGhG0e6ZaESAzDv92dScxZ4jax', filename: 'abba-fuego-thumb.jpg' },
  { id: '1AhDarzIipIUyvldLDZxMGa4TlfBBpLri', filename: 'mimio-sushi-thumb.jpg' },
  { id: '1p0rGtw4Y_LdF4GY_MN5NOL3j4kCl9lCi', filename: 'aiora-media-thumb.jpg' }
];

const destDir = path.join(__dirname, 'assets', 'images');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

function downloadThumb(fileId, filename) {
  return new Promise((resolve) => {
    const filePath = path.join(destDir, filename);
    const url = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`;

    function get(u) {
      const client = u.startsWith('https') ? https : http;
      client.get(u, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return get(res.headers.location);
        }
        if (res.statusCode !== 200) {
          console.log(`Failed thumb for ${filename}: status ${res.statusCode}`);
          return resolve(false);
        }
        const fileStream = fs.createWriteStream(filePath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          const stats = fs.statSync(filePath);
          console.log(`Thumb ${filename}: ${stats.size} bytes`);
          resolve(true);
        });
      }).on('error', (err) => {
        console.log(`Error ${filename}:`, err.message);
        resolve(false);
      });
    }

    get(url);
  });
}

async function main() {
  for (const f of files) {
    await downloadThumb(f.id, f.filename);
  }
}

main();
