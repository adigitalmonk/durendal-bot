const Command = grab('src/command.js');

class Shutdown extends Command {
    constructor(msg) {
        super(msg);
        this.restricted = true;
    }

    logic() {
        grab('src/bootstrap.js').emit('stop');
    }
}

module.exports = Shutdown;
