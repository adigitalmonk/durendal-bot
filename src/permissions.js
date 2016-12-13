const config = require('./configuration.js');
const fs = require('fs');
const EventEmitter = require('events').EventEmitter;
const path = require('path');
const bootstrap = require('./bootstrap.js');
const permissions_file = path.join(__dirname,'..','conf', config.getSetting('permissions_file'));
const Logger = require('./logger.js');
// We could probably do this without
// using the EventEmitter parent
// but it lets us do the events
class Permissions extends EventEmitter {
    // FRONT END
    addCommandToRole(guildId, commandName, roleId, userId){
        // If the issuing user has the server permission "Administrator", they
        // can add any command to any role. Otherwise the issuing user must
        // have the server permission to manage roles/permissions. The role they
        // wish to alter must be lower than their highest role and they must
        // already have the permission to run the command.
        let changed = false; // Tracks if we made any changes
        let guild = this.getGuildById(guildId); // Get the guild obj
        let member = this.getMember(guild,userId); // Get the issuer member obj

        if(!member.hasPermission('ADMINISTRATOR')){
            if(!member.hasPermission('MANAGE_ROLES_OR_PERMISSIONS')){
                return 'Unable to grant "'+commandName+'". You must have the server permission "Administrator" or "Manage Permissions"';
            }
            if(member.highestRole.comparePositionTo(guild.roles.get(roleId))<=0){
                return 'Unable to grant "'+commandName+'". You can only alter roles lower than your highest role or have the server permission "Administrator" to grant';
            }
            if(!this.isAllowedToRun(commandName, member.roles, guild)){
                return 'Unable to grant "'+commandName+'". You must already be allowed to run this command or have the server permission "Administrator" to grant';
            }
        }

        // Use what we have or initialize it
        this.permissions[guildId]=this.permissions[guildId] || {};
        if(!this.permissions[guildId][commandName]){
            // We haven't seen this command name yet, make a new array
            this.permissions[guildId][commandName] = new Array(roleId);
            changed = true;
        } else {
            // Check if this command already has this role
            if(this.permissions[guildId][commandName].indexOf(roleId)===-1){
                // Didn't have the role yet, add it to the array
                this.permissions[guildId][commandName].push(roleId);
                changed = true;
            }
        }
        if(changed){
            this.save();
            return 'Granted "'+commandName+'"';
        } else {
            return '"'+commandName+'" already granted';
        }
    }
    getGuildById(guildId){
        return bootstrap.durendal.bot.guilds.get(guildId);
    }
    getMember(guild, userId){
        if(guild){
            return guild.members.get(userId);
        }
        return '';
    }
    // Returns the role Ids that can run the command name in the given guild
    getAllowedRoles(guildId, commandName){
        // Make sure the permissions object, guildId, and commandName are defined before doing a look up
        return this.permissions && this.permissions[guildId] && this.permissions[guildId][commandName] ? this.permissions[guildId][commandName] : [];
    }
    // Determines if the provided roles in the provided guild have permission
    // to run the provided command name. True if yes, false otherwise
    isAllowedToRun(commandName, runnersRoles, runnersGuild){
        // Decide if we need to check permissions or not based on config
        if(config.getSetting('restrict_commands')===false){
            return true;
        }
        if(runnersGuild && runnersRoles){
            // Find at least one role we have that is allowed to run
            let permissiveRole = this.getAllowedRoles(runnersGuild.id, commandName).some((role) => {
                return runnersRoles.has(role);
            });
            // If we found a role return true, false otherwise
            return permissiveRole ? true:false;
        }
        return false;
    }

    isAllowedToRunSomewhere(authorId, commandName){
        // Look in all of the bots guilds for the Author Id so we can obtain their GuildMember
        // object which allows us to get their roles. With their roles in each guild, determine
        // if any of them allow them to issue this command
        return bootstrap.durendal.bot.guilds.filter(g=>g.members.find('id',authorId))
        .reduce((members,guild)=> {
            members.push(guild.members.find('id',authorId));
            return members;
            }, [])
            .find(m=>this.isAllowedToRun(commandName, m.roles,m.guild))
        ? true:false;
    }

    removeCommandFromRole(guildId, commandName, roleId, userId){
        let changed = false;
        let guild = this.getGuildById(guildId); // Get the guild obj
        let member = this.getMember(guild,userId); // Get the issuer member obj

        // If they aren't an administrator confirm their ability to do this
        if(!member.hasPermission('ADMINISTRATOR')){
            // Confirm they have the ability to manage permissions
            if(!member.hasPermission('MANAGE_ROLES_OR_PERMISSIONS')){
                return 'Unable to revoke "'+commandName+'". You must have the server permission "Administrator" or "Manage Permissions"';
            }
            // Confirm they are modifying a role lower than their highest
            if(member.highestRole.comparePositionTo(guild.roles.get(roleId))<=0) {
                return 'Unable to revoke "'+commandName+'". You can only alter roles lower than your highest role or have the server permission "Administrator"';
            }
        }
        // Check if the command in this guild is defined
        if(this.permissions[guildId] && this.permissions[guildId][commandName]){
            // Find the role index if it exists
            let indexOfRole = this.permissions[guildId][commandName].indexOf(roleId);
            if(indexOfRole>=0){
                // Determine if the role we want to remove is the only one defined or not
                if(this.permissions[guildId][commandName].length>1){
                    // Removing one of the roles
                    this.permissions[guildId][commandName].splice(indexOfRole,1);
                    changed = true;
                } else {
                    // Removing the only role, stop tracking the command name
                    delete this.permissions[guildId][commandName];
                    changed = true;
                }
            }
        }
        if(changed){
            // Save the changes
            this.save();
            return 'Revoked "'+commandName+'"';
        } else {
           return 'No need to revoke "'+commandName+'" from that role';
       }
    }

    // Given a Guild Id and a Role Id, translate the Role Id to its name
    roleIdToName(guildId, roleId){
        // If the role ID is sandwidched between <@& and > extract it
        roleId = roleId.toString(); // Ensure it is a string
        if(roleId.startsWith("<@&")){
            // Remove surroundings
            roleId = roleId.substring(3,roleId.length-1);
        }
        // First we need to get the guild object so we can get the server roles
        // from it
        let guilds = bootstrap.durendal.bot.guilds;
        if(guilds.has(guildId)){
            // Now that we have the guild object, get the roles
            let roles = bootstrap.durendal.getRoles(guildId);
            // See if there is a role match, if so return its name
            if(roles.has(roleId)){
                return roles.get(roleId).name;
            }
        }
        return '';
    }
    // Given a Guild Id and a Role name, translate the Role name to the Id
    roleNameToId(guildId, roleName){
        // First we need to get the guild object so we can get the server roles from it
        let guilds = bootstrap.durendal.bot.guilds;
        if(guilds.has(guildId)){
            let foundRoles = bootstrap.durendal.getRoles(guildId).filter(r => r.name===roleName);
            if(foundRoles.size===1){
                return foundRoles.first().id;
            }
        }
        return '';
    }

    // BACK END
    constructor(options = {}) {
        super(); // Because we're extending

        if (!config.getSetting('permissions_file')) {
            throw new Error('Missing Permissions File setting');
        }

        this.writeLock = false;

        this.permissions = {};

        this.task_queue = [];

        this.prepareListeners();
        this.load();
    }

    prepareListeners() {
        this.on('updated', () => {
            Logger.log("Change to permissions... Saving.");
            this.save();
        });

        this.on('loaded', () => {
            Logger.log("Permissions Loaded");
        });

        this.on('dequeue', () => {
            this.dequeue();
        });
    }
    // Convert a Guild Name to it's ID (if possible), must have exctly one match
    guildNameToId(guildName){
        let guilds = bootstrap.durendal.bot.guilds;
        let matchingGuilds = null;
        if(!guilds){
            return '';
        }
        matchingGuilds = guilds.filterArray(g=> g.name===guildName);
        if(matchingGuilds.length===1){
            return matchingGuilds[0].id;
        }
        return '';
    }

    load() {
        try {
            this.permissions = require(permissions_file);
        } catch(e){
            if(e.code === 'MODULE_NOT_FOUND'){
                // We couldn't find the file, safe to start with a blank one
                this.permissions = {};
                this.save();
            } else {
                // Couldn't load for another reason. We should exit.
                Logger.error('Had problems loading permissions file: '+e.message);
                bootstrap.emit('stop');
            }
        }

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
        fs.writeFile(permissions_file,
            JSON.stringify(this.permissions,null, 3),
            (this.releaseLock).bind(this));
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
