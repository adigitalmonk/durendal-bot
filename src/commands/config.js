const join = require('path').join;
const Command = require(join('..','command.js'));
const configuration = require(join('..','configuration.js'));
const Logger = require(join('..','logger.js'));
const permissions = require(join('..','permissions.js'));
const protectedValues = ['secret_key'];

class config extends Command {
    constructor(msg) {
        super(msg);
        this.restricted = true;
    }

    logic() {
        // Confirm we are recciving this in a DM
        if(this.channel.type!='dm'){
            Logger.message(this.author, "You can only use this command by messaging me directly!");
            return;
        }

        let optionName = '';
        let optionValue = undefined;

        // We always expect an option name as the first arg
        if(this.args.length>0){
            optionName = this.args[0];
        } else {
            Logger.message(this.author, this.usage());
            return;
        }

        // Confirm the option isn't protected from being modified by this command
        if(protectedValues.includes(optionName)){
            Logger.message(this.author, "I'm afraid I can't let you do that Dave. "+optionName+" cannot be modified here.");
            return;
        }

        // Confirm that we were given a valid option
        if(!configuration.isValidOptionName(optionName)){
            Logger.message(this.author, '"'+optionName+'" was not a valid option name. Try one of '+configuration.getConfigurableOptionNames(protectedValues));
            return;
        }

        // Only given the option name, show its info
        if(this.args.length===1){
            Logger.message(this.author, configuration.getOptionInfoString(optionName));
            return;
        }

        // Determine the expected type for this option
        let optionType = configuration.getOptionType(optionName);
        if(optionType===undefined){
            // We must know what type we are expecting or we cannot validate
            Logger.message(this.author, 'Error, type information missing for '+optionName+' in the schema. I cannot determine if your new value is valid for this option.');
            return;
        }

        // We must have a valid option name, at least one argument, and know the type of input to expect at this point
        // We want to look at the remaining args, protect the original args and get rid of the first which is the option name
        let values = this.args;
        values.shift();
        let valueToSet = undefined; // Will hold what we eventually try setting

        if(optionType!=='array'){
            if(values.length>1){
                // We were given multiple values for a non array option, invalid
                Logger.message(this.author, 'Error, I was not expecting more than one value. This option is expecting "'+optionType+'" not an array');
                return;
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
            Logger.message(this.author,message);
        } else {
            // Value must not have passed validation, don't set
            Logger.message(this.author, 'Error, I was not able to validate your setting. This option is expecting "'+optionType+'"');
        }
    }

    usage () {
        return this.commandName+' can only be used by direct messaging me. You can use it to look up a config setting or set a new value.\n'+
        'To look up option `foo`: '+this.commandName+' foo\n'+
        '*To change the value of foo to bar'+this.commandName+' foo bar\n'+
        '*Note: it depends on what the option is expecting. strings, integers, booleans should appear as the second argument. Arrays should have each element as its own argument.\n'+
        '\n Here is a list of config options you can use: '+configuration.getConfigurableOptionNames(protectedValues);
    }

}

module.exports = config;
