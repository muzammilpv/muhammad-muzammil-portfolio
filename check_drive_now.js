const fs = require('fs');

const content = fs.readFileSync('C:\\Users\\ASUS\\.gemini\\antigravity\\brain\\8cb72519-2f09-4198-8960-27d7d47cc4de\\.system_generated\\steps\\621\\content.md', 'utf8');

const regex = /aria-label="([^"]+)"[\s\S]*?data-id="([^"]+)"/g;

let m;
const items = [];
while ((m = regex.exec(content)) !== null) {
  if (m[1].includes('Video') || m[1].includes('Shared')) {
    items.push({ label: m[1], id: m[2] });
  }
}
console.log("Current Drive Items:", items);
