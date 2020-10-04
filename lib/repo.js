const CLI = require('clui');
const fs = require('fs');
const git = require('simple-git/promise');
const Spinner = CLI.Spinner;
const touch = require('touch');
const _ = require('lodash');

const inquirer = require('./inquirer');
const gh = require('./github');

/* Module to support all functions required in creating the git repo, remotely, locally, and with an 'interactive */
/* .gitignore . Receives input mainly from Inquirer module */

module.exports = {
    createRemoteRepo: async () => {
        const github = gh.getInstance();
        const answers = await inquirer.askRepoDetails();

        const data = {
            name: answers.name,
            description: answers.description,
            private: (answers.visibility === 'private')
        };
        
        const status = new Spinner('Creating your remote repo...');
        status.start();

        try {
            const response = await github.repos.createForAuthenticatedUser(data);
            return response.data.ssh_url;
        } finally {
            status.stop();
        }
    },
    createGitignore: async () => {
        const filelist = _.without(fs.readdirSync('.'), '.git', '.gitignore');              // utilizing lodash without. scan current directory to ignore any .git or .gitignore files existing already

        if (filelist.length) {
            const answers = await inquirer.askIgnoreFiles(filelist);                        // If there are files in the directory other than those ignored above..
                                                                                            // store them as 'answers'
            if (answers.ignore.length) {
                fs.writeFileSync( '.gitignore', answers.ignore.join( '\n' ) );              // write the existing file/directories in answers to .gitignore file seperated by newline
            } else {
                touch( '.gitignore' );                                                      // even if no files, make sure to write a .gitignore file
            }
        } else {
            touch( '.gitignore' );
        }
    },
    setupRepo: async (url) => {
        const status = new Spinner('Setting up your local repo, then pushing it to remote branch: just a sec... ');
        status.start();                                                 // start spinner with wait msg

        try {
            git.init()                                                  // Utilizing simple-git's awesome package
                .then(git.add('.gitignore'))                            // First add the .gitignore file just created by user
                .then(git.add('./*'))                                   // Then add everything else in the working directory
                .then(git.commit('Initial Commit'))                     // Good ol' 'Initial Commit'
                .then(git.addRemote('origin', url))                     // Add the remote branch on github passing in url param
                .then(git.push('origin', 'master'));                    // Push the commit up to the master branch on remote
        } finally {
            status.stop()                                               // stop spinner
        }
    },
};