const Discord = require("discord.js");
const fs = require('fs');
const join = require('path').join;

// We pre-load this in the main function, 
// so we just need to get it here
const config = require("./configuration.js");
const auditor = require('./auditor.js');

class Durendal {
    constructor() {
        this.active = false;
    }

    isActive() {
        return this.active;
    }

    reloadConfig() {
        config.reload();
    }

    // Get all of the listeners we have set up
    // for the bot
    getListeners() {
        // Get all of the files in our listeners directory
        let listenerFiles = fs.readdirSync(join(__dirname, 'listeners'));
        console.log('Found ' + listenerFiles.length + ' listener configs!\nLoading now...\n');

        // Iterate over the list of files
        let listeners = listenerFiles.reduce((events, file) => {

            // For each file, load the file
            let listeners = require(join(__dirname, 'listeners', file));
            
            // Take all of the listeners configured in the file
            listeners.map(listener => {
                // If we haven't created an array for this already
                // Create the array
                events[listener.event] = events[listener.event] || [];
                // Push the function into the array
                events[listener.event].push(listener.response);
            });

            return events;
        }, {});

        return listeners;
    }

    boot() {
        let bot = new Discord.Client();
        let listeners = this.getListeners();
        
        for (let listener in listeners) {
            listeners[listener].map(func => {
                bot.on(listener, func)
            });
        }

        let secret_key = config.getSetting('secret_key');
        try { 
            bot.login(secret_key);
        } catch (e) {
            console.log("Couldn't log in: " + e.message);
            process.exit();
        }

        this.bot = bot;
        return this.active = true;
    }

    shutDown() {
        this.active = false;
        return this.bot.destroy();
    }

}



module.exports = Durendal;
