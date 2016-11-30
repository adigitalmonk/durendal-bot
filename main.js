// check if the config file exists, write it if it doesn't?
try {
    // Prepare the config singleton
    const config = require('./src/configuration.js');
    config.load();
} catch (e) {
    console.log("Error loading config [ conf/config.json ], make sure it exists!");
    console.log(e.message);
    console.log("> You can use `node setup` to generate one.");
    console.log("Exiting...");
    process.exit();
}

const bootstrap = require('./src/bootstrap.js');
bootstrap.emit('start');
