const Discord = require("discord.js");

// We check if this exists in the main function,
// so I won't bother to check here
var conf = require('../conf/config.json');

console.log(conf);
// Load the commands
const commands = require('../src/commands');

class Durendal {
    constructor() {
        this.active = false;
    }

    isActive() {
        return this.active;
    }

    reloadConfig() {
        if (require.cache[require.resolve('../conf/config.json')]) {
            delete require.cache[require.resolve('../conf/config.json')]
            console.log("Invalidating config cache");
        } else {
            console.log("Config not loaded");
        }
        conf = require('../conf/config.json');
    }

    boot() {
        this.reloadConfig();
        this.bot = new Discord.Client();
        this.startListeners();
        this.bot.login(conf.secret_key);
        return this.active = true;
    }

    shutDown() {
        this.active = false;
        return this.bot.destroy();
    }

    startListeners() {
        this.bot.on('ready', () => {
            console.log('I am ready!');
        });

        this.bot.on("message", msg => {
            if (
                conf.allowed_channels 
                && conf.allowed_channels.indexOf(msg.channel.name) < 0 
            ) {
                // Only allow messages from the allowed channels
                return;
            }

            // Don't response to bot messages
            if(msg.author.bot) return;

            if (
                conf.command_prefix // The command prefix is set
                && msg.content.startsWith(conf.command_prefix) // The msg starts with the commands prefix
            ) {
                let args = msg.content.split(" ");
                let cmd = args.shift().replace(conf.command_prefix, "");

                if (commands[cmd]) {
                    commands[cmd](args, msg.channel, msg.author);
                } else {
                    msg.channel.sendMessage("That command isn't yet implemented :(");
                }
            }
        });

        this.bot.on("guildMemberAdd", (guild, member) => {
            console.log(`New User "${member.user.username}" has joined "${guild.name}"` );
            guild.defaultChannel.sendMessage(`"${member.user.username}" has joined this server`);
        });
    }
}



module.exports = Durendal;