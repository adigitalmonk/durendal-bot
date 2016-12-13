const readline = require('readline');
const join = require('path').join;
const Logger = require('./logger.js');
const configuration = require('./configuration.js');

class Interface {

    constructor() {
        this.in = undefined;
    }

    start() {
        Logger.log("Bringing up the user interface...");
        this.in = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        let prefix = '> ';
        this.in.setPrompt(prefix, prefix.length);

        this.in.on(
            'line',
            function(input) {
                let repeat = true;
                input = input.split(" ");
                let cmd = input.shift();
                let args = input;
                if (cmd !== 'stop' && cmd !== 'start' && this[cmd]) {
                    // TODO: Implement a better way to map this
                    repeat = this[cmd](args);
                }
                if (repeat) {
                    this.in.prompt();
                }
            }.bind(this)
        ).on(
            'close',
            () => Logger.log('Closing user interface')
        );
        this.in.prompt();
    }

    stop() {
        this.in.close();

    }

    config(args){
        let optionName = '';
        let optionValue = undefined;
        if (args.length>0){
            optionName = args[0];
        } else {

            Logger.log(`To look up option \`foo\`: config foo
*To change the value of foo to bar: config foo bar
*Note: it depends on what the option is expecting. strings, integers, booleans should appear as the second argument. Arrays should have each element as its own argument.
Here is a list of config options you can use: ${configuration.getConfigurableOptionNames()}`);
            return true;
        }
        // Confirm that we were given a valid option
        if(!configuration.isValidOptionName(optionName)){
            Logger.log('"'+optionName+'" was not a valid option name. Try one of '+configuration.getConfigurableOptionNames());
            return true;
        }
        if(args.length===1){
            Logger.log(configuration.getOptionInfoString(optionName));
            return true;
        }
        let optionType = configuration.getOptionType(optionName);
        if(optionType===undefined){
            // We must know what type we are expecting or we cannot validate
            Logger.log('Error, type information missing for '+optionName+' in the schema. I cannot determine if your new value is valid for this option.');
            return true;
        }

        // We must have a valid option name, at least one argument, and know the type of input to expect at this point
        // We want to look at the remaining args, protect the original args and get rid of the first which is the option name
        let values = args;
        values.shift();
        let valueToSet = undefined; // Will hold what we eventually try setting

        if(optionType!=='array'){
            if(values.length>1){
                // We were given multiple values for a non array option, invalid
                Logger.log('Error, I was not expecting more than one value. This option is expecting "'+optionType+'" not an array');
                return true;
            }
            valueToSet = configuration.validateOption(optionType,values[0]);
        } else {
            // Make an "array" out of the remaining args. JSON style
            valueToSet = configuration.validateOption(optionType,'['+values.join()+']');
        }

        if(valueToSet){
            // The value must have passed validation, lets set it
            let message = optionName+'\nWas: '+configuration.getSetting(optionName);
            configuration.setSetting(optionName, valueToSet);
            configuration.save();
            message += '\nNow: '+configuration.getSetting(optionName);
            Logger.log(message);
        } else {
            // Value must not have passed validation, don't set
            Logger.log('Error, I was not able to validate your setting. This option is expecting "'+optionType+'"');
        }
        return true;
    }

    help() {
        Logger.log(`

[Available Commands]
'config'
    description:
        View and modify the bots configuration options.
    params:
        See usage
    usage:
        call with no params to view usage

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
        require('./bootstrap').emit('stop');
        this.stop();
        return false;
    }
}



module.exports = new Interface();
