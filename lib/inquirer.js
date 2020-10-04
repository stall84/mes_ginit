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
};