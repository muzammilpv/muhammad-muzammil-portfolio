const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ffmpegPath = `"C:\\Program Files\\KMPlayer 64X\\LAVFilters64\\ffmpeg.exe"`;
const vidPath = path.join(__dirname, 'assets', 'videos', 'mimio-sushi.mp4');
const imagesDir = path.join(__dirname, 'assets', 'images');

const timestamps = ['00:00:10', '00:00:15', '00:00:20', '00:00:25', '00:00:30'];

timestamps.forEach((ts, idx) => {
  const thumbName = `sushi-frame-${idx + 1}.jpg`;
  const thumbPath = path.join(imagesDir, thumbName);
  try {
    const cmd = `${ffmpegPath} -y -ss ${ts} -i "${vidPath}" -vframes 1 -q:v 2 "${thumbPath}"`;
    execSync(cmd);
    console.log(`Frame at ${ts} saved as ${thumbName}`);
  } catch (e) {
    console.error(`Error at ${ts}:`, e.message);
  }
});
