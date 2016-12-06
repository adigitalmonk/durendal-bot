const join = require('path').join;
const Command = require(join('..','command.js'));
const permissions = require(join('..','permissions.js'));
const bootstrap = require(join('..','bootstrap.js'));
const Logger = require(join('..','logger.js'));

// Looks up the roles that can run the given command

class showPermissions extends Command {
    constructor(msg) {
        super(msg);
    }
    // Helper method to create the message string given the guildId,
    // commandName, and guildName.
    generateMessage(guildId, commandName, guildName){
        let roles = permissions.getAllowedRoles(guildId,commandName);
        let roleNames = roles.map(r => permissions.roleIdToName(guildId,r));
        if(roles.length>0){
            return commandName+' is allowed for roles '+roleNames.join();
        } else {
            return commandName+' is not allowed for any roles in guild '+guildName;
        }
    }
    logic() {
        let message = "";
        // We don't know the Guild Id, is there a chance they'll give us the
        // name of the guild?
        if (!this.guildUsedIn && this.args.length!==3){
            // No Guild Id and no chance of a guild name
            this.author.sendMessage("Sorry, you need to be more explicit. Try `"+this.commandName+" <command you want to look up> in <guild you want to look it up in>` or just issue the command in a channel I have access to for that guild.");
            return;
        }
        if(this.args.length===1){
            // Get all the roles that can run this command if any
            message = this.generateMessage(this.guildUsedIn.id,this.args[0],this.guildUsedIn.name);
        } else if (this.args.length===3){
            // looking for ['command name','in','guild name']
            if (this.args[1]==='in'){
                let guildName = this.args[2];
                // Convert guild name to id
                let guildId = permissions.guildNameToId(guildName);
                if(guildId){
                    // Exactly one matching guild
                    message=this.generateMessage(guildId,this.args[0],guildName);
                } else {
                    // Either no guilds matched or more than one did
                    message = 'Sorry, I\'m not sure which guild you ment. I know about the following guild(s): '+bootstrap.durendal.bot.guilds.map(g => g.name).join();
                }
            } else {
                // Didn't get what we expected, show usage
                message = this.usage();
            }
        }else {
            // Wrong number of args
            message=this.usage();
        }
        // Send them a DM with the results
        Logger.message(this.author, message);
    }
    usage(){
        return 'Sorry, I expected one of\n'+this.commandName+' <command name to check>\n'+this.commandName+' <command name to check> in <Guild name>';
    }
}

module.exports = showPermissions;
