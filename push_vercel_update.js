const { execSync } = require('child_process');

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

console.log("Pushing clean Vercel static configuration fix...");

runGit("add -A");
runGit('commit -m "Fix vercel.json and package.json for clean Vercel static build"');
runGit("push origin main");
