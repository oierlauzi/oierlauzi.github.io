// Based on:
// https://blog.logrocket.com/build-deploy-vue-js-app-github-pages/

/* eslint-disable no-console */
const execa = require("execa");
const fs = require("fs");
(async () => {
  try {
    await execa("git", ["checkout", "--orphan", "gh-pages"]);

    //Build the project
    console.log("Building started...");
    await execa("npm", ["run", "build"]);
    const buildFolder = "dist/";
    fs.copyFileSync(buildFolder + "index.html", buildFolder + "404.html"); // Copy index to 404

    //Deploy on GH pages    
    await execa("git", ["--work-tree", buildFolder, "add", "--all"]);
    await execa("git", ["--work-tree", buildFolder, "commit", "-m", "gh-pages"]);
    console.log("Pushing to gh-pages...");
    await execa("git", ["push", "origin", "HEAD:gh-pages", "--force"]);
    await execa("rm", ["-r", buildFolder]);
    await execa("git", ["checkout", "-f", "main"]);
    await execa("git", ["branch", "-D", "gh-pages"]);
    console.log("Successfully deployed, check your settings");

  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
})();