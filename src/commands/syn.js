const join = require('path').join;
const Command = require(join('..','command.js'));
const Logger = require(join('..','logger.js'));

class Syn extends Command {
    constructor(msg) {
        super(msg);
    }

    logic() {
        Logger.send(this.channel, "Ack!");
    }
}

module.exports = Syn;
