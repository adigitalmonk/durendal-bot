const auditor = grab('src/auditor.js');

module.exports = [
    {
        event: 'message',
        response: msg => {
            let allowed_channels = Settings.getSetting('allowed_channels');
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

            let prefix = Settings.getSetting('command_prefix');
            if (
                prefix // The command prefix is set
                && msg.content.startsWith(prefix) // The msg starts with the commands prefix
            ) {
                let args = msg.content.split(" ");
                let cmd_name = args.shift().replace(prefix, "").toLowerCase();

                let cmd_obj = getCommand(cmd_name);
                if (!cmd_obj) {
                    return;
                }

                let cmd = grab(cmd_obj['src']);
                let instance = new cmd(msg);

                // This returns a boolean
                // But we don't do anything with it yet
                instance.execute();
            }
        }
    }
];
