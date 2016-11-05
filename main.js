const Discord = require("discord.js");
const bot = new Discord.Client();

const permissionsFile = './permissions.json'

// check if the config file exists, write it if it doesn't?
const conf = require('./config');
console.log(conf);

// Load the commands
const commands = require('./commands');

// Load the permissions
var permissions = {};
try{
    permissions = require(permissionsFile);
    console.log('permissions:');
    console.log(permissions);
} catch(error){
    // Unable to load permissions, default to none. Should we quit instead?
    permissions.global = {};
    permissions.users = {};
}

/*
    Given a user ID, is the user allowed to run the given command.
    True if allowed globally
    True if allowed explicitly for user ID but not globally
    True if not defined globally or per user
*/
permissions.isAllowed = function (userId,command){
    var allowed = null;
    // Check global permissions
    if(permissions.global.hasOwnProperty(command)){
        allowed = permissions.global[command] === true;
    }
    if(!allowed){
        // Check explicit user permissions
        if(permissions.users[userId]){
            if(permissions.users[userId].hasOwnProperty(command)){
                allowed = permissions.users[userId][command] === true;
            }
        }
    }
    if (allowed===null){
        allowed = true;
    }
    return allowed;
}

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
            // Check if the user is allowed to issue the command
            if (permissions.isAllowed(msg.author.id,cmd)){
                commands[cmd](args, msg.channel, msg.author);
            } else {
                msg.channel.sendMessage(msg.author.username+' is not allowed to use `'+cmd+'`');
            }
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
