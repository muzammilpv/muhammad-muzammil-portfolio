const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { execSync } = require('child_process');

const DRIVE_FOLDER_URL = 'https://drive.google.com/drive/folders/1Mn-glzSw2Q8ZXCXg0EXz1g7PN_GhmiUS?usp=sharing';
const ffmpegPath = `"C:\\Program Files\\KMPlayer 64X\\LAVFilters64\\ffmpeg.exe"`;
const gitBin = `"C:\\Users\\ASUS\\git-portable\\cmd\\git.exe"`;

const videosDir = path.join(__dirname, 'assets', 'videos');
const imagesDir = path.join(__dirname, 'assets', 'images');
const projectsDataPath = path.join(__dirname, 'assets', 'js', 'projects-data.js');

if (!fs.existsSync(videosDir)) fs.mkdirSync(videosDir, { recursive: true });
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(body));
    }).on('error', reject);
  });
}

function downloadDriveFile(fileId, destPath) {
  return new Promise((resolve) => {
    const initialUrl = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`;
    function get(u) {
      const client = u.startsWith('https') ? https : http;
      client.get(u, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return get(res.headers.location);
        }
        if (res.statusCode !== 200) {
          console.error(`Failed download (${fileId}): status ${res.statusCode}`);
          return resolve(false);
        }
        const stream = fs.createWriteStream(destPath);
        res.pipe(stream);
        stream.on('finish', () => {
          stream.close();
          console.log(`Downloaded ${path.basename(destPath)}: ${fs.statSync(destPath).size} bytes`);
          resolve(true);
        });
      }).on('error', (err) => {
        console.error(`Download error (${fileId}):`, err.message);
        resolve(false);
      });
    }
    get(initialUrl);
  });
}

function extractThumbnail(videoPath, imagePath) {
  try {
    console.log(`Extracting frame thumbnail for ${path.basename(videoPath)}...`);
    const cmd = `${ffmpegPath} -y -ss 00:00:03 -i "${videoPath}" -vframes 1 -q:v 3 "${imagePath}"`;
    execSync(cmd);
    console.log(`Extracted thumbnail: ${path.basename(imagePath)} (${fs.statSync(imagePath).size} bytes)`);
  } catch (e) {
    console.error(`Thumbnail extraction failed for ${videoPath}:`, e.message);
  }
}

async function main() {
  console.log("Fetching Google Drive folder data...");
  const html = await fetchUrl(DRIVE_FOLDER_URL);

  const regex = /aria-label="([^"]+)"[\s\S]*?data-id="([^"]+)"/g;
  let match;
  const driveItems = new Map();

  while ((match = regex.exec(html)) !== null) {
    const label = match[1];
    const id = match[2];
    if (label.includes('Video Shared') || label.includes('Shared')) {
      const cleanName = label.replace(' Video Shared', '').replace('Shared', '').trim();
      if (cleanName.length > 2 && !driveItems.has(id)) {
        driveItems.set(id, cleanName);
      }
    }
  }

  console.log("\nFound Google Drive Videos:");
  driveItems.forEach((name, id) => console.log(`- ${name} (ID: ${id})`));

  // Catalog of known & new drive items mapped to portfolio entries
  const knownProjects = [
    {
      id: "sup-project",
      number: "01",
      title: "SILVER UNITED PROJECT LLC (SUP)",
      category: "DIGITAL BRANDING & COMMERCIAL",
      filterCategory: "product-ads",
      isFeatured: true,
      gridSize: "large",
      description: "A high-impact brand commercial and digital presentation created for Silver United Project LLC (SUP).",
      tags: ["BRAND COMMERCIAL", "AI VIDEO", "CORPORATE AD"],
      driveId: "1uLNMNiizMPwrvwZtEhOj-r6WrXtUOlQr",
      filename: "sup-video.mp4",
      thumbName: "sup-thumb.jpg",
      year: "2026"
    },
    {
      id: "abba-perfume",
      number: "02",
      title: "ABBA PERFUME — ZANOTTI",
      category: "LUXURY PERFUME COMMERCIAL",
      filterCategory: "product-ads",
      isFeatured: true,
      gridSize: "medium",
      description: "A cinematic luxury fragrance film focused on premium product presentation and visual storytelling.",
      tags: ["AI VIDEO", "PRODUCT COMMERCIAL", "LUXURY VISUALS"],
      driveId: "12kPMs60JE1GwTs3iUyh1kH9mR0hrMO_G",
      filename: "abba-perfume.mp4",
      thumbName: "abba-perfume-thumb.jpg",
      year: "2026"
    },
    {
      id: "abba-fuego",
      number: "03",
      title: "ABBA FUEGO",
      category: "CREATIVE BRAND COMMERCIAL",
      filterCategory: "product-ads",
      isFeatured: true,
      gridSize: "medium",
      description: "An intense, high-energy cinematic commercial crafted for ABBA Fuego featuring bold motion aesthetics.",
      tags: ["AI VIDEO", "BRAND AD", "CINEMATIC VISUALS"],
      driveId: "1cQOQYutGhG0e6ZaESAzDv92dScxZ4jax",
      filename: "abba-fuego.mov",
      thumbName: "abba-fuego-thumb.jpg",
      year: "2026"
    },
    {
      id: "castle-cloud",
      number: "04",
      title: "CASTLE CLOUD BUILDERS",
      category: "BUILDERS & ARCHITECTURAL COMMERCIAL",
      filterCategory: "product-ads",
      isFeatured: true,
      gridSize: "medium",
      description: "A cinematic architectural presentation and brand advertisement created for Castle Cloud Builders.",
      tags: ["BUILDERS AD", "ARCHITECTURE", "REAL ESTATE", "AI VIDEO"],
      driveId: "1AKw_ICKUEBKHGSmuNcIRoioL4ra5ZUMc",
      filename: "castle-cloud-builders.mp4",
      thumbName: "castle-cloud-thumb.jpg",
      year: "2026"
    },
    {
      id: "mimio-sushi",
      number: "05",
      title: "MIMIO SUSHI",
      category: "RESTAURANT & FOOD COMMERCIAL",
      filterCategory: "product-ads",
      isFeatured: true,
      gridSize: "medium",
      description: "A visually rich restaurant and food commercial designed around close-up product presentation and appetizing visuals.",
      tags: ["AI VIDEO", "RESTAURANT AD", "FOOD VISUALS"],
      driveId: "1AhDarzIipIUyvldLDZxMGa4TlfBBpLri",
      filename: "mimio-sushi.mp4",
      thumbName: "mimio-sushi-thumb.jpg",
      year: "2026"
    },
    {
      id: "sup-itmgt",
      number: "06",
      title: "SUP IT MANAGEMENT",
      category: "CORPORATE & TECH COMMERCIAL",
      filterCategory: "product-ads",
      isFeatured: false,
      gridSize: "medium",
      description: "A corporate technology and IT management promotional presentation created for Silver United Project LLC.",
      tags: ["TECH AD", "IT MANAGEMENT", "CORPORATE VIDEO"],
      driveId: "1n96InYLpqlsEcQXyJeQ_pM39WJXZawat",
      filename: "sup-itmgt.mp4",
      thumbName: "sup-itmgt-thumb.jpg",
      year: "2026"
    },
    {
      id: "aiora-media",
      number: "07",
      title: "AIORA MEDIA",
      category: "DIGITAL MEDIA & AGENCY AD",
      filterCategory: "product-ads",
      isFeatured: false,
      gridSize: "medium",
      description: "A sleek digital agency promo video designed for Aiora Media, highlighting modern creative strategy.",
      tags: ["AGENCY PROMO", "AI VIDEO", "DIGITAL MARKETING"],
      driveId: "1p0rGtw4Y_LdF4GY_MN5NOL3j4kCl9lCi",
      filename: "aiora-media.mp4",
      thumbName: "aiora-media-thumb.jpg",
      year: "2026"
    }
  ];

  // Process & download any missing videos
  for (const proj of knownProjects) {
    const vPath = path.join(videosDir, proj.filename);
    const iPath = path.join(imagesDir, proj.thumbName);

    if (!fs.existsSync(vPath)) {
      console.log(`\nNew video detected: ${proj.title} (Drive ID: ${proj.driveId})`);
      const success = await downloadDriveFile(proj.driveId, vPath);
      if (success && !fs.existsSync(iPath)) {
        extractThumbnail(vPath, iPath);
      }
    } else if (!fs.existsSync(iPath)) {
      extractThumbnail(vPath, iPath);
    }
  }

  // Update projectsData JS file
  const fullProjectsRegistry = knownProjects.map(p => ({
    id: p.id,
    number: p.number,
    title: p.title,
    category: p.category,
    filterCategory: p.filterCategory,
    isFeatured: p.isFeatured,
    gridSize: p.gridSize,
    description: p.description,
    tags: p.tags,
    videoUrl: `assets/videos/${p.filename}`,
    posterUrl: `assets/images/${p.thumbName}`,
    year: p.year,
    tools: ["Generative AI Video", "CapCut Pro", "Prompt Engineering"]
  }));

  // Append Web Projects
  fullProjectsRegistry.push(
    {
      id: "inspirego",
      number: "08",
      title: "INSPIREGO",
      category: "TRAVEL DIGITAL EXPERIENCE",
      filterCategory: "web-digital",
      isFeatured: false,
      gridSize: "medium",
      isWebProject: true,
      description: "A modern travel agency website concept designed around immersive destination visuals.",
      tags: ["WEB DESIGN", "UI/UX", "TRAVEL"],
      videoUrl: null,
      posterUrl: "assets/images/inspirego-mockup.svg",
      year: "2026",
      tools: ["Vibe Coding", "Figma", "Web Development"]
    },
    {
      id: "edexora",
      number: "09",
      title: "EDEXORA",
      category: "ONLINE EDUCATION PLATFORM",
      filterCategory: "web-digital",
      isFeatured: false,
      gridSize: "medium",
      isWebProject: true,
      description: "An online education platform concept combining learning management, classes, and administrative tools.",
      tags: ["WEB APP", "EDTECH", "UI/UX"],
      videoUrl: null,
      posterUrl: "assets/images/edexora-mockup.svg",
      year: "2026",
      tools: ["Vibe Coding", "UI/UX", "AI Development"]
    }
  );

  const jsContent = `/**
 * Muhammad Muzammil - Portfolio Project Data Registry
 * Auto-synced with Google Drive Folder: https://drive.google.com/drive/folders/1Mn-glzSw2Q8ZXCXg0EXz1g7PN_GhmiUS
 */

const projectsData = ${JSON.stringify(fullProjectsRegistry, null, 2)};
`;

  fs.writeFileSync(projectsDataPath, jsContent, 'utf8');
  console.log("\nSuccessfully updated projects-data.js registry with all Drive videos!");

  // Push to GitHub
  console.log("\nPushing updates to GitHub...");
  try {
    execSync(`${gitBin} add .`, { cwd: __dirname });
    execSync(`${gitBin} commit -m "Auto-sync new Google Drive videos: CASTLE CLOUD BUILDERS & SUP ITMgt"`, { cwd: __dirname });
    execSync(`${gitBin} push origin main`, { cwd: __dirname });
    console.log("Successfully pushed to GitHub! Vercel auto-deployment triggered.");
  } catch (e) {
    console.log("Git push notice:", e.message);
  }
}

main();
