const { execSync } = require('child_process');
const path = require('path');

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

console.log("Updating GitHub repository for Vercel deployment...");

runGit("add -A");
runGit('commit -m "Add vercel.json configuration and optimize repository size for Vercel static deployment"');
runGit("push origin main");
