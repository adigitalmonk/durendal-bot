const join = require('path').join;
const config = require(join('..','configuration.js'));
const auditor = require(join('..','auditor.js'));
const Logger = require(join('..','logger.js'));

module.exports = [
    {
        event: 'message',
        response: msg => {
            let allowed_channels = config.getSetting('allowed_channels');
            if (
                allowed_channels
                && allowed_channels.indexOf(msg.channel.name) < 0
                && (msg.channel.type != 'dm' && msg.channel.type != 'group')
            ) {
                // Only allow messages from the allowed channels
                return;
            }

            // Don't act on messages from bots
            if(msg.author.bot) {
                return;
            }

            let prefix = config.getSetting('command_prefix');
            if (
                prefix // The command prefix is set
                && msg.content.startsWith(prefix) // The msg starts with the commands prefix
            ) {
                let args = msg.content.split(" ");
                let cmd_name = args.shift().replace(prefix, "").toLowerCase();

                try {
                    // TODO: Check if 'cmd_name' file exists before

                    // TODO: Make this safer
                    let cmd = require(join(__dirname, '..', 'commands', cmd_name));
                    let instance = new cmd(msg);

                    // This returns a boolean
                    // But we don't do anything with it yet
                    instance.execute();

                } catch (e) {
                    Logger.error(e);

                    // Audit that they tried a bad command?
                    auditor.observe(msg.author, cmd_name);

                }
            }
        }
    }
];
