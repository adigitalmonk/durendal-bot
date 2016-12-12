'use strict';

// We don't have the grab command yet
require('./global.js');

// check if the config file exists, write it if it doesn't?
try {
    // Prepare the config object
    Settings = grab('src/configuration.js');

    // Load the global settings object
    Settings.load();
} catch (e) {
    console.log("Error loading config [ conf/config.json ], make sure it exists!");
    console.log(e.message);
    console.log("> You can use `node setup` to generate one.");
    console.log("Exiting...");
    process.exit();
}

// Set the global permissions object
Permissions = grab('src/permissions.js');


// Register the commands into the command map
grab('register.js');

// Start the bot
const Core = grab('src/bootstrap.js');
Core.emit('start');
