const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ffmpegPath = `"C:\\Program Files\\KMPlayer 64X\\LAVFilters64\\ffmpeg.exe"`;

const vids = [
  { video: 'sup-video.mp4', thumb: 'sup-thumb.jpg', time: '00:00:03' },
  { video: 'abba-perfume.mp4', thumb: 'abba-perfume-thumb.jpg', time: '00:00:02' },
  { video: 'abba-fuego.mov', thumb: 'abba-fuego-thumb.jpg', time: '00:00:02' },
  { video: 'mimio-sushi.mp4', thumb: 'mimio-sushi-thumb.jpg', time: '00:00:03' },
  { video: 'aiora-media.mp4', thumb: 'aiora-media-thumb.jpg', time: '00:00:02' }
];

const videosDir = path.join(__dirname, 'assets', 'videos');
const imagesDir = path.join(__dirname, 'assets', 'images');

vids.forEach(v => {
  const vidPath = path.join(videosDir, v.video);
  const thumbPath = path.join(imagesDir, v.thumb);
  if (fs.existsSync(vidPath)) {
    try {
      const cmd = `${ffmpegPath} -y -ss ${v.time} -i "${vidPath}" -vframes 1 -q:v 2 "${thumbPath}"`;
      console.log(`Extracting thumb for ${v.video}...`);
      execSync(cmd);
      console.log(`Extracted: ${v.thumb} (${fs.statSync(thumbPath).size} bytes)`);
    } catch (e) {
      console.error(`Error for ${v.video}:`, e.message);
    }
  }
});
