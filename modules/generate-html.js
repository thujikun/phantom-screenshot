function generateHtml() {

    var defer = require('node-promise').defer,
        fs = require("fs"),
        path = require("path"),
        ncp = require("ncp").ncp,
        jade = require("jade"),
        dfd = defer(),
        config = {
            path: {
                captures:   './index/captures',
                distfile:   './index/index.html',
                distassets: './index/assets',
                template:   './views/index.jade',
                tempassets: './views/assets'
            }
        };

    var walk = function(p, callback){
        var results = [];
            
        fs.readdir(p, function(err, files) {
            if(err) {
                throw err;
            }

            var pending = files.length;
            if(!pending){
                // call the callback when all of file acquisition done.
                return callback(null, results);
            }
            
            files.map(function (file) {
                return path.join(p, file);
            }).filter(function (file) {
                if(fs.statSync(file).isDirectory()){
                    // recursion if directory.
                    walk(file, function(err, res) {
                        //Save child directory to children index.
                        results.push({dir:path.basename(file), children:res});
                        if(!--pending) {
                            callback(null, results);
                        }
                    });
                }
                return fs.statSync(file).isFile();
            }).forEach(function (file) {
                // Save file name.
                results.push({file:path.basename(file)});
                if(!--pending) {
                    callback(null, results);
                }
            });
            
        });
    }

    walk(config.path.captures, function(err, results) {
        if(err) {
            throw err;
        }

        var json = {dir:'root', children:results};
        // jade compile 
        jade.renderFile(config.path.template, {'data': json}, function(err, html) {
            if(err) {
                throw err;
            }

            var write_stream,
                read_stream;
            // html output
            write_stream = fs.createWriteStream(config.path.distfile);
            write_stream.on('error', function(exeption) { console.log('write: error'); });
            write_stream.write(html);
            // assets copy
            ncp(config.path.tempassets  , config.path.distassets, function(err) {
             if(err) {
               return console.error(err);
             }
                dfd.resolve();
            });
        });
    });

    return dfd.promise;
}

module.exports = generateHtml;