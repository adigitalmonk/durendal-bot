const path = require('path');
const config_root = path.join(__dirname,'..','conf');
const config_file = path.join(config_root, 'config.json');
const fs = require('fs');

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

    setSetting(option, value) {
        this.data.set(option, value);
        return true;
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
}


module.exports = new Configuration();
