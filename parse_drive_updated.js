const fs = require('fs');

const content = fs.readFileSync('C:\\Users\\ASUS\\.gemini\\antigravity\\brain\\8cb72519-2f09-4198-8960-27d7d47cc4de\\.system_generated\\steps\\320\\content.md', 'utf8');

const regex = /aria-label="([^"]+)"[\s\S]*?data-id="([^"]+)"/g;

let m;
console.log("Found Drive items in updated folder:");
while ((m = regex.exec(content)) !== null) {
  console.log({ label: m[1], id: m[2] });
}
