const Durendal = require('./durendal');
const EventEmitter = require('events').EventEmitter;

class Bootstrap extends EventEmitter {

    constructor() {
        super();
        this.bot = new Durendal();
        this.startListeners();
    }

    startListeners() {
        this.on('restart', () => {
            console.log("Restarting");
            this.bot.shutDown();
            this.bot.reloadConfig();
            this.bot.boot();
        });

        this.on('start', () => {
            console.log("Booting up!");
            this.bot.boot();
        });

        this.on('stop', () => {
            console.log("Shutting down!");
            this.bot.shutDown();
        });
    }
}


module.exports = new Bootstrap();
