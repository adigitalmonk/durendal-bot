const Command = grab('src/command.js');

class grantPermission extends Command {
    constructor(msg) {
        super(msg);
    }
    logic() {
        let message = '';
        let guildIdToGrant = '';
        let guildNameToGrant = '';
        let commandToGrant = '';
        let roleToGrant = '';
        let roleIdToGrant = '';
        if (!this.guildUsedIn && this.args.length != 4) {
            // Guild is undefined, probably saw this command in a DM
            // We'll need them to specify the guild name
            message = 'Sorry, you need to be more explicit. Try `' + this.commandName + ' <command name to grant> <role name to grant> in <Guild name>` or just issue the command in a channel I have access to for that guild.';
            Logger.message(this.author, message);
            return;
        }

        if (this.args.length === 2) {
            // Guild name not provided, use the guild we saw the command in
            commandToGrant = this.args[0];
            roleToGrant = this.args[1];
            guildIdToGrant = this.guildUsedIn.id;
            guildNameToGrant = this.guildUsedIn.name;
        } else if (this.args.length === 4) {
            // Check that we got the guild specified with the 'in' arg
            if (this.args[2] === 'in') {
                commandToGrant = this.args[0];
                roleToGrant = this.args[1];
                guildNameToGrant = this.args[3];
                guildIdToGrant = Permissions.guildNameToId(guildNameToGrant);
                if (!guildIdToGrant) {
                    message = 'I couldn\'t find guild "' + guildNameToGrant + '"';
                    Logger.message(this.author, message);
                    return;
                }
            } else {
                // Didn't see 'in' as expected
                Logger.message(this.author, this.usage());
                return;
            }
        } else {
            Logger.message(this.author, this.usage());
            return;
        }
        // Attempt to translate the role Name to Id
        roleIdToGrant = Permissions.roleNameToId(guildIdToGrant, roleToGrant);
        if (roleIdToGrant) {
            // We have all the info we need, lets attempt to add it
            message = Permissions.addCommandToRole(guildIdToGrant,commandToGrant,roleIdToGrant,this.author.id);
        } else {
            // Couldn't find the role id
            message = 'I couldn\'t find role "' + roleToGrant + '" in guild ' + guildNameToGrant;
        }
        Logger.message(this.author, message);
    }
    usage () {
        return 'Sorry, I expected one of\n' + this.commandName + '<command name to grant> <role name to grant>\n<command name to grant> <role name to grant> in <Guild name>';
    }
}

module.exports = grantPermission;
