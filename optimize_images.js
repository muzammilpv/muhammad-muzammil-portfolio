const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ffmpegPath = `"C:\\Program Files\\KMPlayer 64X\\LAVFilters64\\ffmpeg.exe"`;
const imgDir = path.join(__dirname, 'assets', 'images');

// 1. Optimize hero portrait
const heroPng = path.join(imgDir, 'muzammil-portrait.png');
const heroOptJpg = path.join(imgDir, 'muzammil-portrait-opt.jpg');

try {
  console.log("Compressing hero portrait png to optimized jpg...");
  execSync(`${ffmpegPath} -y -i "${heroPng}" -q:v 3 "${heroOptJpg}"`);
  console.log(`Original: ${fs.statSync(heroPng).size} bytes -> Optimized: ${fs.statSync(heroOptJpg).size} bytes`);
  // overwrite muzammil-portrait.png with optimized jpg or copy
  fs.copyFileSync(heroOptJpg, heroPng);
  fs.unlinkSync(heroOptJpg);
} catch (e) {
  console.error("Hero png compression error:", e.message);
}

// 2. Optimize mimio sushi thumb
const sushiJpg = path.join(imgDir, 'mimio-sushi-thumb.jpg');
const sushiOptJpg = path.join(imgDir, 'mimio-sushi-thumb-opt.jpg');

try {
  console.log("Compressing mimio sushi thumb...");
  execSync(`${ffmpegPath} -y -i "${sushiJpg}" -q:v 3 "${sushiOptJpg}"`);
  console.log(`Original sushi thumb: ${fs.statSync(sushiJpg).size} bytes -> Optimized: ${fs.statSync(sushiOptJpg).size} bytes`);
  fs.copyFileSync(sushiOptJpg, sushiJpg);
  fs.unlinkSync(sushiOptJpg);
} catch (e) {
  console.error("Sushi thumb compression error:", e.message);
}
