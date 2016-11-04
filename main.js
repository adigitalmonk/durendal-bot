const Discord = require("discord.js");
const bot = new Discord.Client();

// check if the config file exists, write it if it doesn't?
const conf = require('./config');
console.log(conf);

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

    if (msg.content.startsWith("Syn!")) {
        msg.channel.sendMessage("Syn-Ack!");
    }
});

bot.on("guildMemberAdd", (guild, member) => {
    console.log(`New User "${member.user.username}" has joined "${guild.name}"` );
    guild.defaultChannel.sendMessage(`"${member.user.username}" has joined this server`);
});



console.log("Logging In");
var access = bot.login(conf.secret_key);
