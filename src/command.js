const auditor = require('./auditor');

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
        this.args = this.prepareArgs(msg);

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
        let permissions = this.checkPermissions();

        // Check audit?
        let audit = auditor.observe(this.author, this.constructor.name);

        return audit && permissions;
    }

    // Override this in child class?
    checkPermissions() {

        if (this.restricted) {

            // ??
            let allowed_users = this.getAllowedRoles();
        }

        // TODO: Make this great again
        return !this.restricted;
    }

    getAllowedRoles() {
        // Load allowed roles based on this.constructor.name ?
        return [];
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
}

module.exports = Command;
