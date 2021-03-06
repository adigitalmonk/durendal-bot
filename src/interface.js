const readline = require('readline');

class Interface {

    constructor() {
        this.in = undefined;
    }

    start() {
        console.log("Bringing up the user interface...");
        this.in = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        let prefix = '> ';
        this.in.setPrompt(prefix, prefix.length);

        this.in.on(
            'line',
            function(cmd) {
                let repeat = true;
                if (cmd !== 'stop' && cmd !== 'start' && this[cmd]) {
                    // TODO: Implement a better way to map this
                    repeat = this[cmd]();
                }
                if (repeat) {
                    this.in.prompt();
                }
            }.bind(this)
        ).on(
            'close',
            () => console.log('Closing user interface')
        );
        this.in.prompt();
    }

    stop() {
        this.in.close();

    }

    help() {
        console.log(`

[Available Commands]
'help'
    description:
        This message.
    params:
        None.
    usage:
        help

'shutdown'
    description:
        Disconnects the bot from Discord (ends the process)
    params:
        None.
    usage:
        shutdown

`);
        return true;
    }

    shutdown() {
        grab('src/bootstrap').emit('stop');
        this.stop();
        return false;
    }
}



module.exports = new Interface();
