var defer = require('node-promise').defer,
    phantom = require('phantom'),
    userAgents = require('../config/user-agent.json');

var ScreenObserver = function() {
    this.init();
};

Object.defineProperties(ScreenObserver.prototype, {
    init: {
        writable: false,
        enumerable: false,
        configurable: false,
        value: function() {
        }
    },
    createPhantom: {
        writable: false,
        enumerable: false,
        configurable: false,
        value: function(flags) {
            var that = this,
                args = flags || [],
                dfd = defer();

            args.push(function(webpage) {
                that._setPhantom(webpage);
                dfd.resolve();
            });
            phantom.create.apply(phantom, args);

            return dfd.promise;
        }
    },
    _setPhantom: {
        writable: false,
        enumerable: false,
        configurable: false,
        value: function(webpage) {
            this.webpage = webpage;
        }
    },
    setViewports: {
        writable: false,
        enumerable: false,
        configurable: false,
        value: function(viewports) {
            this.viewports = viewports;
        }
    },
    screenCapture: {
        writable: false,
        enumerable: false,
        configurable: false,
        value: function(url, captureType) {
            var that = this,
                deferred = defer(),
                viewports = this.viewports,
                captures = [],
                order;

            this.viewports.forEach(function(viewport) {
                var options = {
                        width: viewport.width,
                        height: viewport.height,
                        url: url,
                        captureType: captureType,
                        userAgent: viewport.userAgent
                    };
                captures.push(that._screenCapture.bind(that, options));
            });

            captures.push(function() {
                var dfd = defer();
                deferred.resolve();
                return dfd.promise;
            });

            order = function() {
                captures.shift()().then(order);
            };

            order();
            return deferred.promise;
        }
    },
    _screenCapture: {
        writable: false,
        enumerable: false,
        configurable: false,
        value: function(options) {
            var deferred = defer();

            this.webpage.createPage(function(page) {
                page.set('viewportSize', {
                    width: options.width,
                    height: options.height
                });

                if(options.userAgent) {
                    page.set('settings.userAgent', userAgents[options.userAgent]);
                } else {
                    options.userAgent = 'pc';
                }

                page.set('onCallback', function() {
                    if(options.width === 100) {
                        deferred.resolve();
                        return;
                    }
                    setTimeout(function() {
                        page.render('./index/captures/'+ options.userAgent + '_' + options.width +'x'+ options.height + '/' + options.captureType +'.png');
                        deferred.resolve();
                    }, 3000);
                });

                page.set('onInitialized', function() {
                    page.evaluate(function() {
                        document.querySelector('html').style.backgroundColor = '#ffffff';
                        window.callPhantom('top');
                    });
                });

                page.open(options.url);
            });

            return deferred.promise;
        }
    },
    screenCaptures: {
        writable: false,
        enumerable: false,
        configurable: false,
        value: function(pages) {
            var that = this,
                deferred = defer(),
                funcs = [],
                order;

            pages.forEach(function(page) {
                funcs.push(that.screenCapture.bind(that, page.url, page.title));
            });

            order = function() {
                funcs.shift()().then(order);
            };

            funcs.push(function() {
                var dfd = defer();
                deferred.resolve();
                return dfd.promise;
            });

            order();

            return deferred.promise;
        }
    },
});

module.exports = ScreenObserver;