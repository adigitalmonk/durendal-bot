const Command = grab('src/command.js');

class revokePermission extends Command {
    constructor(msg) {
        super(msg);
    }
    logic() {
        let message = "";
        let guildIdToRevoke = '';
        let guildNameToRevoke = '';
        let commandToRevoke = '';
        let roleToRevoke = '';
        let roleIdToRevoke = '';
        if(!this.guildUsedIn && this.args.length != 4){
            // Guild is undefined, probably saw this command in a DM
            // We'll need them to specify the guild name
            message = "Sorry, you need to be more explicit. Try `"+this.commandName+" <command name to revoke> <role name to revoke> in <Guild name>` or just issue the command in a channel I have access to for that guild.";
            Logger.message(this.author, message);
            return;
        }

        if(this.args.length === 2){
            // Guild name not provided, use the guild we saw the command in
            commandToRevoke = this.args[0];
            roleToRevoke = this.args[1];
            guildIdToRevoke = this.guildUsedIn.id;
            guildNameToRevoke = this.guildUsedIn.name;
        } else if(this.args.length === 4){
            // Check that we got the guild specified with the 'in' arg
            if(this.args[2]==='in'){
                commandToRevoke = this.args[0];
                roleToRevoke = this.args[1];
                guildNameToRevoke = this.args[3];
                guildIdToRevoke = Permissions.guildNameToId(guildNameToRevoke);
                if(!guildIdToRevoke){
                    message = 'I couldn\'t find guild "'+guildNameToRevoke+'"';
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
        roleIdToRevoke = Permissions.roleNameToId(guildIdToRevoke,roleToRevoke);
        if(roleIdToRevoke){
            message = Permissions.removeCommandFromRole(guildIdToRevoke,commandToRevoke,roleIdToRevoke,this.author.id);
        } else {
            message = 'I couldn\'t find role "'+roleToRevoke+'" in guild '+guildNameToRevoke;
        }
        Logger.message(this.author, message);
    }
    usage(){
        return 'Sorry, I expected one of\n'+this.commandName+
        ' <command name to revoke> <role name to revoke>\n'+
        ' <command name to revoke> <role name to revoke> in <Guild name>';
    }
}

module.exports = revokePermission;
