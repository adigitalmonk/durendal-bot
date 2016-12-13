const fs = require('fs');
const path = require('path');

const config_root = path.join(__dirname,'..','conf');
const config_file = path.join(config_root, 'config.json');


class Configuration {

    constructor() {
        this.loaded = false;
        this.data = new Map();

        this.optionSchema = {
            'secret_key' : {
                'description'   : 'The secret key for your bot',
                'type'          : 'string',
                'required'      : true
            },
            'command_prefix' : {
                'description'   : 'The prefix for your bot\'s commands',
                'type'          : 'string',
                'default'       : '!'
            },
            'permissions_file' : {
                'description'   : 'The file name where to store permissions',
                'type'          : 'string',
                'default'       : 'auth.json'
            },
            'restrict_commands' : {
                'description'   : 'Whether restricted commands require permissions before they can be run. Set this to false if you want all commands to be unrestricted',
                'type'          : 'boolean',
                'default'       : 'true'
            },
            'allowed_channels' : {
                'description'   : 'The channels that the bot is allowed to talk in (Ctrl+C to stop)',
                'type'          : 'array'
            }
        }
    }

    // Filters out options we cannot modify with this command and returns a string of possible options
    getConfigurableOptionNames(protectedValues=[]){
        return this.options().filter(o=>!protectedValues.includes(o)).join(", ");
    }

    getSchema(option) {
        return this.optionSchema[option];
    }

    options() {
        return Object.keys(this.optionSchema);
    }

    getSettings() {
        return this.data.keys();
    }

    getSetting(option) {
        return this.data.get(option);
    }

    // Returns a string of what we know about the given option
    getOptionInfoString(optionName){
        if(!this.isValidOptionName(optionName)){
            return '';
        }
        let optionSchema = this.getSchema(optionName);
        let result = optionName + ' = '+this.getSetting(optionName);
        result +='\n\tDescription: ';
        result += optionSchema.description || 'no description';
        result +='\n\tType: ';
        result += optionSchema.type || 'no type';
        result +='\n\tDefault: ';
        result += optionSchema.default || 'no default';
        return result;
    }

    // Looks at the schema to find the expected type for the option
    getOptionType(optionName){
        if(!this.isValidOptionName(optionName)){
            return undefined;
        }
        return this.getSchema(optionName).type || undefined;
    }

    setSetting(option, value) {
        this.data.set(option, value);
        return true;
    }

    // True of the option name given matches one of the known options
    isValidOptionName(optionName){
        return this.options().find(o => { return o===optionName; }) ? true:false;
    }

    load(bypass) {
        if (bypass === undefined) {
            bypass = false;
        }

        // Reset the data object
        this.data.clear();

        let data;
        try {
            data = require(config_file);
        } catch (e) {
            if (e instanceof SyntaxError) {
                throw new SyntaxError('bad-config');
            }
            throw new Error('missing-config');
        }
        for (let i = 0; i < this.options().length; i++) {
            let option = this.options()[i];
            if (data[option] === undefined) {
                if (bypass) {
                    continue;
                } else {
                    throw new Error('missing-option-' + option);
                }
            } else {
                this.data.set(option, data[option]);
            }
        }

        return this.data;
    }

    create() {
        for (let i = 0; i < this.options.length; i++) {
            let option = this.options()[i];
            this.data.set(option, '');
        }

        this.save();
    }

    backup() {
        let date = new Date();
        let timestamp = date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds();
        let backup_file = path.join(config_root, timestamp + '.json');
        this.save(backup_file);
    }

    save(filename) {
        if (filename === undefined) {
            filename = config_file;
        }

        let obj = { };
        for (let [key, val] of this.data) {
            obj[key] = val;
        }
        fs.writeFileSync(
            config_file,
            JSON.stringify(obj)
        );

        this.reload();
    }

    uncache() {
        if (require.cache[require.resolve('../conf/config.json')]) {
            delete require.cache[require.resolve('../conf/config.json')]
        }
    }

    reload() {
        this.uncache();
        return this.load();
    }

    // Attempts to validate the user input by comparing what we were expecting to what we got
    validateOption(expectedType, givenValue){
        switch(expectedType){
            case 'array':
                return givenValue.startsWith('[') && givenValue.endsWith(']') ? givenValue:undefined;
                break; // Yes, I know this is unreachable but it lets me sleep at night. Ok?
            case 'string':
                return givenValue;
                break;
            case 'boolean':
                return givenValue.toLowerCase()==='true' || givenValue.toLowerCase()==='false' ? givenValue:undefined;
                break;
            case 'integer':
                return isNaN(parseInt(givenValue)) ? undefined:givenValue;
                break;
            default:
                return undefined;
        }
    }
}


module.exports = new Configuration();
