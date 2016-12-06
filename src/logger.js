const Colors = require('colors');

class Logger  {
    constructor() {
        // Just start with default color choices
        this.setColors();
    }

    setColors(colorChoices) {
        colorChoices = colorChoices || {};

        // Set the colors, with defaults if one wasn't specified
        this.colors = {
            'warn'  : Colors[colorChoices['warn'] || 'yellow'],
            'error' : Colors[colorChoices['error'] || 'red'],
            'debug' : Colors[colorChoices['debug'] || 'cyan'],
            'log'   : Colors[colorChoices['log'] || 'green']
        }
    }

    timestamp() {
        let date = new Date();
        return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    }

    warn(msg) {
        console.log(this.colors['warn']('[WRN ' + this.timestamp() + '] ' + msg));
    }

    error(msg) {
        console.log(this.colors['error']('[ERR ' + this.timestamp() + '] ' + msg));
    }

    debug(msg) {
        console.log(this.colors['debug']('[DBG ' + this.timestamp() + '] ' + msg));
    }

    log(msg) {
        console.log(this.colors['log']('[LOG ' + this.timestamp() + '] ' + msg));
    }

    send(channel, msg) {
        // Give the log a little more context based on the channel type
        channel.sendMessage(msg)
            .then(message => {
                if(channel.type==='text' || channel.type==='voice'){
                    // Guild Channel, we can get a channel and guild name
                    this.log(`Sent message: "${message.content}" in ${channel.guild.name}'s channel ${channel.name}`);
                } else if(channel.type==='dm'){
                    // Direct Message to one person, we can mention the username
                    this.log(`Sent message: "${message.content}" directly to ${channel.recipient.username}`);
                } else if(channel.type==='group'){
                    // Direct Message with multiple people. It may not be possible for a bot to join one
                    // but if we are seeing a GroupDMChannel, mention the recipients of the group DM
                    let recipients = channel.recipients.map(u=>u.username).join();
                    this.log(`Sent message: "${message.content}" directly between ${recipients}`);
                } else {
                    // Currently not possible to get here unless they add a new channel type
                    // we should still log it even if we aren't up to date with the API
                    this.log(`Sent message: "${message.content}" in channel type ${channel.type}`);
                }
            })
            .catch(error => this.error(error));
    }

    // Sends a Direct Message to the given User
    message(user, msg) {
        user.sendMessage(msg)
            .then(message => {
                this.log(`Sent message: "${message.content}" directly to ${user.username}`);
            })
            .catch(error => this.error(error));
    }
};

module.exports = new Logger();
