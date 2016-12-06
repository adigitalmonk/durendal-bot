const Durendal = require('./durendal.js');
const EventEmitter = require('events').EventEmitter;
const Logger = require('./logger.js');
const Interface = require('./interface.js');

class Bootstrap extends EventEmitter {

    constructor() {
        super();
        this.durendal = new Durendal();
        this.startListeners();
    }

    startListeners() {
        this.on('restart', () => {
            Logger.log("Restarting");
            this.durendal.shutDown();
            this.durendal.reloadConfig();
            this.durendal.boot();
        });

        this.on('start', () => {
            Logger.log("Booting up!");
            this.durendal.boot();
        });

        this.on('interface', () => {
            Interface.start();
        });

        this.on('stop', () => {
            Logger.log("Disconnecting from Discord...");
            Interface.stop();
            this.durendal.shutDown();
        });
    }
}


module.exports = new Bootstrap();
