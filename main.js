const Discord = require("discord.js");
const bot = new Discord.Client();

// check if the config file exists, write it if it doesn't?
const conf = require('./config');
console.log(conf);

bot.on('ready', () => {
  console.log('I am ready!');
});

console.log("Starting events");
bot.on("message", msg => {
    if (msg.content.startsWith("Syn!")) {
        msg.channel.sendMessage("Syn-Ack!");
    }
});


console.log("Logging In");

// Why does this fail?

var access = bot.login(conf.secret_key);
