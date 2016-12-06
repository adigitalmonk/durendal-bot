const auditor = require('./auditor.js');
const permissions = require('./permissions.js');

class Command {
    constructor(msg) {
        // ES6 doesn't support abstract
        // classes directly, so we
        // cheese it like this
        if (this.constructor === Command) {
            throw new TypeError('Abstract Class Construction Disallowed');
        }

        if (!msg) {
            throw new Error('msg object empty');
        }

        // create data members
        this.author = msg.author;
        this.channel = msg.channel;
        this.commandName = this.constructor.name;
        // Depending on the message you might not get a GuildMember object
        this.authorRoles =  msg.member ? msg.member.roles : undefined;
        this.args = this.prepareArgs(msg);
        // Depending on the message you might not get a Guild object
        this.guildUsedIn = msg.guild;

        // By default we will assume that commands are not restricted.
        // Implementers of this class can override this to flag the command
        // as restricted which will require permissions to run it. Implementors
        // may also wish to override checkPermissions() to restirct their usage
        // as required
        this.restricted = false;
    }

    // Build the necessary information
    // for this object from the message
    prepareArgs(msg) {
        let args = msg.content.split(" ");
        if (args.length > 0) {
            args.shift();
        }
        return args;
    }

    audit() {

        // Check permissions?
        let allowed = this.checkPermissions();

        // Check audit?
        let audit = auditor.observe(this.author, this.commandName);

        return audit && allowed;
    }

    // Override this in child class?
    checkPermissions() {
        if (!this.restricted){
            // If we aren't restricted it is allowed
            return true;
        }
        // Since we are restricted, we need to check if the issuer has permission to run the command
        return permissions.isAllowedToRun(this.commandName, this.authorRoles, this.guildUsedIn);
    }

    report() {
        return auditor;
    }

    execute() {
        if (!this.audit()) {
            return false;
        }

        this.logic();

        return true;
    }

    logic() {
        throw new Error('Functionality not implemented');
    }

    // Children should override this to provide a string of proper command usage
    usage() {
        return this.commandName + ' does not have a usage message. Best of luck guessing the proper usage!';
    }

}

module.exports = Command;
