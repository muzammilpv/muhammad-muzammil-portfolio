const fs = require('fs');
const path = require('path');

const srcImage = `C:\\Users\\ASUS\\.gemini\\antigravity\\brain\\8cb72519-2f09-4198-8960-27d7d47cc4de\\mimio_sushi_food_thumb_1790677804049.jpg`;
const destImage = path.join(__dirname, 'assets', 'images', 'mimio-sushi-thumb.jpg');

fs.copyFileSync(srcImage, destImage);
console.log(`Copied new luxury food thumbnail to ${destImage} (${fs.statSync(destImage).size} bytes)`);
