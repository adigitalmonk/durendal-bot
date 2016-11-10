const Command = require('../command');

class Shutdown extends Command {
    constructor(msg) {
        super(msg);
        this.restricted = true;
    }

    logic() {
        require('../bootstrap').emit('stop');
    }
}

module.exports = Shutdown;
