const Command = require('../command');

class Syn extends Command {
    constructor(msg) {
        super(msg);
    }

    logic() {
        this.channel.sendMessage("Ack!");
    }
}

module.exports = Syn;
