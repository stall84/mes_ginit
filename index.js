#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const files = require('./lib/files');
const repo = require('./lib/repo');
const github = require('./lib/github');



/********  STARTUP ********/

clear();

/* Here we're making use of chalk and figlet packages to display our module's name at startup*/
console.log(
  chalk.yellow(figlet.textSync('mes_ginit', { horizontalLayout: 'full' }))
);

/* Run initial check of current directory (using our files.js helper function) to see if Git repo already exists*/
if (files.directoryExists('.git')) {
  console.log(chalk.red('A Git repository already exists!'));
  process.exit();
}

/* Propmpt user for Github credentials (muahahahaah!!) */
/* Check for already-existing OAuth token, if one not present. Call Github for new token with users supplied credentials*/

const getGithubToken = async () => {
  // Fetch the token created in github module from the config store
  let token = github.getStoredGithubToken();
  if(token) {
    return token;
  }

  // When no token is found, use credentials to access GitHub account
  token = await github.getPersonalAccessToken();

  return token;
}

const run = async () => {                                           // async function with our module functions run sequentially inside
  try {                                                             // try block
    const token = await getGithubToken();                           // Retrieve and Set OAuth token
    github.githubAuth(token);                                       // Ensure user is authenticated before proceeding 

    const url = await repo.createRemoteRepo();                      // Await the created remote repo's url 

    await repo.createGitignore();                                   // Await the .gitignore input from the client 'wizard'

    await repo.setupRepo(url)                                       // Await then complete local repo setup and push to remote repo

    console.log(chalk.green('WOOT! WE DONE!'));

  } catch(err) {                                                    // Start catching all the errors you created
    if (err) {
      switch (err.status) {
        case 401:
          console.log(chalk.red('Couldn\t log you in. Please provide correct credentials and/or token.'));
          break;
        case 422:
          console.log(chalk.red('There is already a remote repository or token with the same name.'));
          break;
        default:
          console.log(chalk.red('The following error has occurred: ', err));
      }
    }
  }
};



run();