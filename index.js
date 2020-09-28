const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const files = require("./lib/files");

// Startup

clear();

/* Here we're making use of chalk and figlet packages to display our module's name at startup*/
console.log(
  chalk.yellow(figlet.textSync("mes_ginit", { horizontalLayout: "full" }))
);

/* Run initial check of current directory (using our files.js helper function) to see if Git repo already exists*/
if (files.directoryExists(".git")) {
  console.log(chalk.red("A Git repository already exists!"));
  process.exit();
}

/* Propmpt user for Github credentials (muahahahaah!!) */
