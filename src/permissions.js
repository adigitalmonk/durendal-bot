const conf = require('../conf/config.json');
const fs = require('fs');
const EventEmitter = require('events').EventEmitter;
const path = require('path');

const permissions_file = '../' + path.join('conf/', conf.permissions_file);

// We could probably do this without
// using the EventEmitter parent
// but it lets us do the events
class Permissions extends EventEmitter {
    // FRONT END
    getRoles() {
        return this.roles;
    }
    
    addRole(role) {
        // We only add the role if it was never created before
        if (!this.roles.role) {
            this.roles[role] = [];
        }

        // Why save if we didn't add anyone to the role?
        return true;
    }
    
    addUser(role, user) {
        if (!this.roles.role) {
            // Throw exception instead?
            this.addRole(role);
        }

        this.roles[role].push(user);
        console.log(this.roles[role]);
        delete this.users[user]; // invalidate their roles 'cache'

        // Let the object know that we updated something
        this.emit('updated');
    }

    roleHasUser(role, user) {
        if (!this.roles.role) {
            return false;
        }
        
        // if (!this.roles.)
    }

    getRoles(user) {

        // Is the list cached?
        if (this.users[user]) {
            return this.users[user];
        }
        
        // Build the list of roles for the user
        let roles = [];
        
        Object.keys(this.roles).forEach(function(role) {
            if (this.roles[role].indexOf(user) > -1) {
                roles.push(role);
            }
        }.bind(this));

        // Cache it.
        this.users[user] = roles;

        return roles;
    }

    // BACK END
    constructor(options = {}) {
        super(); // Because we're extending

        if (!conf.permissions_file) {
            throw new Error('Missing Permissions File');
        }

        this.writeLock = false;

        this.roles = {};
        this.commands = {};
        this.users = {};

        this.task_queue = [];

        this.prepareListeners();
        this.load();
    }

    prepareListeners() {
        this.on('updated', () => {
            // TODO: We shouldn't console.log like this
            console.log("Change to permissions... Saving.");
            this.save(); 
        });

        this.on('loaded', () => {
            // TODO: We shouldn't console.log like this
            console.log("Permissions Loaded");
        });

        this.on('dequeue', () => {
            this.dequeue();
        });
    }

    load() {
        // This will fail if there is no permissions file
        // We need at least the file name to be in the config
        // and the file needs to exist and at least contain {}
        // The system will take care of the rest
        // TODO: Improve this fail case
        let data = require(permissions_file);
        this.roles = data.roles || {};
        this.commands = data.commands || {};

        this.emit('loaded');
    }

    save() {
        if (this.writeLock) {
            // If this is locked,
            // queue up a save action for later
            this.enqueue('save');
            return;
        }

        // Set the mutex so we can't try to save multiple times
        this.writeLock = true;
        
        // I won't save 'users' because 
        // I'll treat this.users as a cache
        let data = {
            'roles' : this.roles,
            'commands' : this.commands
        };

        fs.writeFile('./' + conf.permissions_file, JSON.stringify(data), (this.releaseLock).bind(this));
        return true;
    }

    // Unlock the mutex
    // and start to dequeue everything
    releaseLock() {
        this.writeLock = false;
        this.emit('dequeue');
    }

    // Dequeue the queue
    dequeue() {
        let task = this.task_queue.shift();
        if (this[task]) {
            this[task]();
        }

        if (this.task_queue.length > 0) {
            this.dequeue();
        }
    }

    // Add a task to the queue
    enqueue(task) {
        // We don't want to worry about this getting backed up
        // So just toss out any tasks if there are more than 100
        // We really never should have to worry about this
        // but uh... That shouldn't stop a check like this
        if (this.task_queue.length > 100) {
            return;
        }
        this.task_queue.push(task);
    }
}

module.exports = new Permissions;
