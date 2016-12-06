const join = require('path').join;
const Command = require(join('..','command.js'));

class Shutdown extends Command {
    constructor(msg) {
        super(msg);
        this.restricted = true;
    }

    logic() {
        require(join('..','bootstrap.js')).emit('stop');
    }
}

module.exports = Shutdown;
