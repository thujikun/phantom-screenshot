function browser() {

    var defer = require('node-promise').defer,
        connect = require('connect'),
        http = require('http'),
        openurl = require("openurl"),
        dfd = defer(),
        config = {
            path: {
                index: './index',
            }
        };

        // open browser
        connect().use(connect.static(global.process.env.PWD +'/'+config.path.index)).listen(3000);
        openurl.open('http://localhost:3000');
        console.log('\033[36m' + 'Server has started at http://localhost:3000' + '\033[39m');
        console.log('\033[33m'+ 'Stop by pressing Ctrl+C.' + '\033[39m');

        dfd.resolve();

    return dfd.promise;
}

module.exports = browser;