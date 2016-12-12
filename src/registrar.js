// TODO: Expand this for listener mapping?

class Registrar {
    constructor() {
        this.cmd_map = {};
    }

    registerCommand(cmd, cmd_params) {
        this.cmd_map[cmd] = cmd_params;
    }

    registerCommands(cmds) {
        for (let cmd_data in cmds) {
            this.registerCommand(cmd_data, cmds[cmd_data]);
        }
    }

    getCommand(cmd) {
        return this.cmd_map[cmd];
    }
}

module.exports = Registrar;
