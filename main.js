const Discord = require("discord.js");
const bot = new Discord.Client();

// check if the config file exists, write it if it doesn't?
const conf = require('./config');
console.log(conf);

// Load the commands
const commands = require('./commands');

bot.on('ready', () => {
  console.log('I am ready!');
});

bot.on("message", msg => {
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

bot.on("guildMemberAdd", (guild, member) => {
    console.log(`New User "${member.user.username}" has joined "${guild.name}"` );
    guild.defaultChannel.sendMessage(`"${member.user.username}" has joined this server`);
});

console.log("Logging In");
var access = bot.login(conf.secret_key);
