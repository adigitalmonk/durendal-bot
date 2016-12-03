const Durendal = require('./durendal');
const EventEmitter = require('events').EventEmitter;
const Interface = require('./interface.js');
const Logger = require('./logger');

class Bootstrap extends EventEmitter {

    constructor() {
        super();
        this.bot = new Durendal();
        this.startListeners();
    }

    startListeners() {
        this.on('restart', () => {
            Logger.log("Restarting");
            this.bot.shutDown();
            this.bot.reloadConfig();
            this.bot.boot();
        });

        this.on('start', () => {
            Logger.log("Booting up!");
            this.bot.boot();
        });

        this.on('interface', () => {
            Interface.start();
        });

        this.on('stop', () => {
            Logger.log("Disconnecting from Discord...");
            Interface.stop();
            this.bot.shutDown();
        });
    }
}


module.exports = new Bootstrap();
