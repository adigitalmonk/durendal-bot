const Command = grab('src/command.js');

class Syn extends Command {
    constructor(msg) {
        super(msg);
    }

    logic() {
        Logger.send(this.channel, "Ack!");
    }
}

module.exports = Syn;
