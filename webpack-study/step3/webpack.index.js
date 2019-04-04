const path = require('path');

module.exports = {
    // webpack entrys
    mulitpleEntry: {
        login: path.resolve(__dirname, './src/js/login.js'),
        user: path.resolve(__dirname, './src/js/user.js'),
    }
}