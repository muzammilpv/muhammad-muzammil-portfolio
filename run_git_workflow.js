const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const gitBin = `"C:\\Users\\ASUS\\git-portable\\cmd\\git.exe"`;
const cwd = __dirname;

function runGit(cmd) {
  const fullCmd = `${gitBin} ${cmd}`;
  console.log(`\n> git ${cmd}`);
  try {
    const output = execSync(fullCmd, { cwd, encoding: 'utf8', stdio: 'pipe' });
    console.log(output);
    return output;
  } catch (err) {
    console.log(err.stdout || '');
    console.error(err.stderr || err.message);
    return null;
  }
}

console.log("Starting Git Repository Workflow...");

// 1. git init
runGit("init");

// 2. git config
runGit('config user.name "Muhammad Muzammil"');
runGit('config user.email "muzammilmuthu546@gmail.com"');

// 3. git add .
runGit("add .");

// 4. git commit -m "first commit"
runGit('commit -m "first commit"');

// 5. git branch -M main
runGit("branch -M main");

// 6. git remote add origin
runGit("remote remove origin");
runGit("remote add origin https://github.com/muzammilpv/muhammad-muzammil-portfolio.git");

// 7. git push -u origin main
console.log("\nPushing repository to GitHub...");
runGit("push -u origin main");
