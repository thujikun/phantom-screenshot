var ScreenObserver = require('./modules/screen-observer'),
    generateHtml = require('./modules/generate-html'),
    browser = require('./modules/browser'),
    config = require('./config/config'),
    rmRecursive = require('./modules/rm-recursive'),
    so = new ScreenObserver;

rmRecursive('./index');

console.log('\033[36m' + 'It tooks some time. I recommends you a coffee break:)' + '\033[39m');
so.createPhantom(config.flags).then(function() {
    so.setViewports(config.viewports);
    so.screenCaptures(config.pages)
        .then(generateHtml)
        .then(browser)
        .then(function() {
            //process.exit();
        });
});
