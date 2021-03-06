// TODO: Expand this for listener mapping?

// Define parameter options for when registering commands
// If the value is undefined, there is no default and it is
//      required to be configured when registering (e.g., src)
const param_options = {
    'src' : undefined,  // The js src file to pull the command from
    'rate_limit' : 3    // Number of times before we rate limit a user
};

class Registrar {

    /**
     * constructor - Initializes the cmd_map for this object 
     */
    constructor() {
        this.cmd_map = {};
    }

    /**
     * Verify the command parameters used for registering a command
     * 
     * @param in_params object  Key/value pairs intended for use as settings
     * @returns object approved settings for the command
     */
    verifyParams(in_params = {}) {
        let out_params = {};
        for (let opt in param_options) {
            let setting = in_params[opt] || param_options[opt];
            if (setting === undefined) {
                throw new Error('missing-param-key-' + opt);
            }
            out_params[opt] = setting;
        }
        return out_params;
    }

    /**
     * Register a command
     * 
     * @param cmd string        Key for the command to be registered as / triggered as
     * @param cmd_params object Key/value pairs to use as settings for registering the command
     */
    registerCommand(cmd, cmd_params) {
        let params = this.verifyParams(cmd_params);
        this.cmd_map[cmd] = params;
    }

    /**
     * Register commands in bulk
     * 
     * @param cmds object   A key value pair in the following structure: {'command_name' : { 'param1' : 'value1'}, 'command_2' : {'src' : 'value'}}, etc
     */
    registerCommands(cmds) {
        for (let cmd_data in cmds) {
            this.registerCommand(cmd_data, cmds[cmd_data]);
        }
    }

    /**
     * Gets the settings for a given command
     * 
     * @param cmd string The name of the command to look up
     * @returns object The stored parameters (or undefined if the command doesn't exist)
     */
    getCommand(cmd) {
        return this.cmd_map[cmd];
    }
}

module.exports = Registrar;
