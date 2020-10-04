const CLI = require("clui");
/* Config-Store setup to store OAuth token on users machine to avoid entering credentials every time */
/* Configstore will place OAuth token in location it determines appropriate abstracting away the file-saving-location work */
const Configstore = require("configstore");
const Octokit = require("@octokit/rest");
const Spinner = CLI.Spinner;
const { createBasicAuth } = require("@octokit/auth-basic");

const inquirer = require("./inquirer");
const pkg = require("../package.json");                         // Locates root package.json

const conf = new Configstore(pkg.name);                         // Appends name of app


/* Check for previously created valid access token before creating new */

let octokit; 

module.exports = {
    getInstance: () => {
        return octokit;
    },
    getStoredGithubToken: () => {
        return conf.get("github.token");
    },
    getPersonalAccessToken: async () => {
        const credentials = await inquirer.askGithubCredentials();                       // If OAuth token has to be created, await the user's input fields, 
        const status = new Spinner('Authenticating you, hang on a sec...');              // and it will take some time for the associated network request.
                                                                                         // So.. SPINNER!
        status.start();

        const auth = createBasicAuth({
            username: credentials.username,
            password: credentials.password,
            async on2Fa() {
                status.stop();
                const res = await inquirer.getTwoFactorAuthenticationCode();            // If Github account requires 2-factor auth. Stop spinner, call getauth method from inquirer.js
                status.start();
                return res.twoFactorAuthenticationCode;                                 // return the input from user, continue.
            },
            token: {
                scopes: [ "user", "public_repo", "repo", "repo:status" ],
                note: "mes_ginit, a command-line tool for initializing Git repos"
            }
        });

        try {
            const res = await auth();

            if (res.token) {
                conf.set("github.token", res.token);
                return res.token;
            } else {
                throw new Error("Github token was not found in the response object", Error);
            }
        } finally {
            status.stop();
        }
    
    },
    githubAuth: (token) => {
        octokit = new Octokit({
            auth: token
        });
    },
};



