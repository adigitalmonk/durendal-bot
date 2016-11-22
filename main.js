// check if the config file exists, write it if it doesn't?
try {
    var conf = require('./conf/config.json');
} catch (e) {
    console.log("Error loading config [ conf/config.json ], make sure it exists!");
    console.log("> You can use `node setup` to generate one.");
    console.log("Exiting...");
    process.exit();
}

const bootstrap = require('./src/bootstrap');
bootstrap.emit('start');
