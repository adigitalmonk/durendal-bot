// Events releated to the auditing process
const Audit = grab('src/auditor.js');

module.exports = [
    {
        event: 'message', 
        response: (msg) => {
            let allowed_channels = Settings.getSetting('allowed_channels');
            if (
                allowed_channels
                && allowed_channels.indexOf(msg.channel.name) < 0
                && (msg.channel.type != 'dm' && msg.channel.type != 'group')
            ) {
                // Only allow messages from the allowed channels
                // We don't audit bot commands
                return;
            }

            let prefix = Settings.getSetting('command_prefix');
            if (
                prefix // The command prefix is set
                && msg.content.startsWith(prefix) // The msg starts with the commands prefix
            ) {
                let args = msg.content.split(" ");
                let cmd_name = args.shift().replace(prefix, "").toLowerCase();
                Audit.track(msg.author.id, cmd_name);
            }
        }
    }
];
