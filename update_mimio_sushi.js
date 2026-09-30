const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { execSync } = require('child_process');

const fileId = '1AhDarzIipIUyvldLDZxMGa4TlfBBpLri';
const filename = 'mimio-sushi.mp4';
const destDir = path.join(__dirname, 'assets', 'videos');
const filePath = path.join(destDir, filename);

console.log(`Force re-downloading ${filename} from Google Drive ID: ${fileId}...`);

const initialUrl = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`;

function get(url) {
  const client = url.startsWith('https') ? https : http;
  client.get(url, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      console.log(`Redirecting...`);
      return get(res.headers.location);
    }

    if (res.statusCode !== 200) {
      console.error(`Failed with status code: ${res.statusCode}`);
      return;
    }

    const fileStream = fs.createWriteStream(filePath);
    res.pipe(fileStream);

    fileStream.on('finish', () => {
      fileStream.close();
      const stats = fs.statSync(filePath);
      console.log(`Finished downloading ${filename}: ${stats.size} bytes`);
      
      // Extract thumbnail
      extractThumb();
    });
  });
}

function extractThumb() {
  const ffmpegPath = `"C:\\Program Files\\KMPlayer 64X\\LAVFilters64\\ffmpeg.exe"`;
  const thumbPath = path.join(__dirname, 'assets', 'images', 'mimio-sushi-thumb.jpg');
  
  // Try extracting at 5 seconds for a great food shot
  try {
    const cmd = `${ffmpegPath} -y -ss 00:00:05 -i "${filePath}" -vframes 1 -q:v 2 "${thumbPath}"`;
    console.log(`Extracting food thumbnail at 00:00:05...`);
    execSync(cmd);
    console.log(`Extracted thumbnail: ${thumbPath} (${fs.statSync(thumbPath).size} bytes)`);
  } catch(e) {
    console.error("FFmpeg error:", e.message);
  }
}

get(initialUrl);
