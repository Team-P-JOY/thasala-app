const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

console.log(`${colors.cyan}Starting cleanup process...${colors.reset}`);

// Directories to delete
const dirsToDelete = [".expo", "node_modules", ".expo-shared"];

// Delete directories
dirsToDelete.forEach((dir) => {
  const dirPath = path.join(__dirname, dir);
  if (fs.existsSync(dirPath)) {
    console.log(`${colors.yellow}Removing ${dir}...${colors.reset}`);
    try {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`${colors.green}Successfully removed ${dir}${colors.reset}`);
    } catch (err) {
      console.error(
        `${colors.red}Error removing ${dir}: ${err.message}${colors.reset}`
      );
    }
  } else {
    console.log(
      `${colors.blue}${dir} does not exist, skipping...${colors.reset}`
    );
  }
});

// Clear metro bundler cache
console.log(`${colors.yellow}Clearing Metro bundler cache...${colors.reset}`);
try {
  execSync("npx expo start --clear", { stdio: "inherit" });
  console.log(`${colors.green}Metro bundler cache cleared.${colors.reset}`);
} catch (err) {
  console.error(
    `${colors.red}Error clearing Metro cache: ${err.message}${colors.reset}`
  );
}

// Reinstall dependencies
console.log(`${colors.yellow}Reinstalling dependencies...${colors.reset}`);
try {
  execSync("npm install", { stdio: "inherit" });
  console.log(
    `${colors.green}Dependencies reinstalled successfully.${colors.reset}`
  );
} catch (err) {
  console.error(
    `${colors.red}Error reinstalling dependencies: ${err.message}${colors.reset}`
  );
}

console.log(`${colors.cyan}Cleanup complete!${colors.reset}`);
