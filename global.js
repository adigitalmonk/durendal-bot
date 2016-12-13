'use strict';

const join = require('path').join;

// Load a module from the perspective of the root of the project
global.grab = function(module) {
    let p = join(__dirname, module);
    return require(p);
}

// Global Logger object
let Logger = grab('src/logger.js');
global.Logger = new Logger();

// Command registrar
const Registrar = grab('src/registrar.js');
let r = new Registrar();

// Bind the registrar to the global commands
global.registerCommand = r.registerCommand.bind(r);
global.registerCommands = r.registerCommands.bind(r);
global.getCommand = r.getCommand.bind(r);

// Create the settings location
global.Settings = undefined;

// Create the permissions location
global.Permissions = undefined;

// Export nothing since we are just
// setting/creating global things heres
module.exports = true;
