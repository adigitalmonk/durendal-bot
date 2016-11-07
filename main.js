const bootstrap = require('./src/bootstrap');

// check if the config file exists, write it if it doesn't?
try {
    var conf = require('./conf/config.json');
    bootstrap.emit('start');
} catch (e) {
    console.log("Error loading config [ conf/config.json ], make sure it exists!");
    console.log("Exiting...");
}
