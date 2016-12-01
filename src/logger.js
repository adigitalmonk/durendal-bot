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
        this.log(msg);
        channel.sendMessage(msg);
    }
};

module.exports = new Logger();
