const inquirer = require('inquirer');
const files = require('./files');
/* Github is deprecating username/password logins on 11-13-2020. The code will be refactored shortly to */
/* Utilize their web-application-flow authorization (pop-up-window) instead */
/* Inquirer module allows us to easily create user-input object after prompting them to input specified data/fields*/
module.exports = {
    askGithubCredentials: () => {
        
                const questions = [
                    {
                        name: 'username',
                        type: 'input',
                        message: 'Enter your Github username or associated e-mail address: ',
                        validate: function( value ) {
                            if (value.length) {                                                     // Dummy-Check validation
                                return true;
                            } else {
                                return 'Please enter your Github username or associated e-mail address to continue.. ';
                            }
                        }
                    },
                    {
                        name: 'password',
                        type: 'password',
                        message: 'Please Enter your Github password: ',
                        validate: function( value ) {
                            if (value.length) {
                                return true;
                            } else {
                                return 'Please enter your Github password to continue.. ';
                            }
                        }
                    }
                ];
           
        
        return inquirer.prompt( questions );
    },
    getTwoFactorAuthenticationCode: () => {
        return inquirer.prompt({
            name: 'twoFactorAuthenticationCode',
            type: 'input',
            message: 'Enter your two-factor authentication code: ',
            validate: function( value ) {
                if (value.length) {
                    return true;
                } else {
                    return 'Please enter your two-factor authentication code to proceed.. ';
                }
            }
        });

    },
    askRepoDetails: () => {
        const argv = require('minimist')(process.argv.slice(2));

        const questions = [
            {
                type: 'input',
                name: 'name',
                message: 'Enter a name for the repository: ',
                default: argv._[0] || files.getCurrentDirectoryBase(),
                validate: function( value ) {
                    if ( value.length ) {
                        return true;
                    } else {
                        return 'Please enter a name for the repository to continue.. ';
                    }
                }
            },
            {
                type: 'input',
                name: 'description',
                default: argv._[1] || null,
                message: '(Optional) Enter a description of the repository: '
            },
            {
                type: 'list',
                name: 'visibility',
                message: 'Public or Private',
                choices: [ 'public', 'private' ],
                default: 'public'
            }
        ];
        return inquirer.prompt( questions )
    },
    askIgnoreFiles: (filelist) => {
        const questions = [
            {
                type: 'checkbox',
                name: 'ignore',
                message: 'Select the files and/or folders you wish to ignore: ',
                choices: filelist,                                                              // Store user-selected files/directories in 'filelist'
                default: [ 'node_modules', 'bower_components' ]                                 // If nothing selected, defaults for .gitignore
            }
        ];
        return inquirer.prompt(questions);                                                      // Return user selections
    },
};