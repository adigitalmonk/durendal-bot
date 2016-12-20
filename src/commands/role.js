const Command = grab('src/command.js');

class Role extends Command {
    constructor(msg) {
        super(msg);
        const roles = ['Tank', 'Damage', 'Healer'];
        this.coreRoles = this.guildUsedIn.roles.filter( role => roles.includes(role.name) );

        this.roleMatching = {
            'Tank'      : 
                'tank|drk|dark knight|darkknight|pld|paladin|war|warrior|baddps',
            'Damage'    : 
                'damage|dps|nin|ninja|mnk|monk|drg|dragoon|floortank|mch|machinist|brd|bard|blm|blackmage|black mage|smn|summoner',
            'Healer'    : 
                'heals|heal|healer|healing|whm|white mage|whitemage|sch|scholar|ast|astrologian|followmode'
        };
    }


    resolveRole(roleName) {
        for (let roleIdx in this.roleMatching) {
            if (this.roleMatching[roleIdx].split('|').includes(roleName.toLowerCase())) {
                return this.guildUsedIn.roles.find(role => role.name === roleIdx);
            }
        }

        return;
    }

    logic() {
        const roleArg = this.args.join(" ");
        const roleRequest = this.resolveRole(roleArg);

        if (!roleRequest) {
            // TODO: Usage?
            return;
        }

        const guildMember = this.getAuthorGuildMember();

        guildMember.removeRoles(this.coreRoles)
            .then(
                updatedMember => {
                    setTimeout(function() {
                        updatedMember.addRole(roleRequest)
                            .then(
                                finalMember => {
                                    const nickname = finalMember.nickname || finalMember.user.username;
                                    Logger.send(this.channel, `${nickname} is now a ${roleRequest.name}!`);
                                }
                            );
                        }.bind(this), 500); // We wait .5 seconds here to avoid race condition with the Discord API 
                },
                e => {
                    const nickname = guildMember.nickname || guildMember.user.username;
                    Logger.error(`${nickname} tried to change to become a ${roleRequest.name} but something went very wrong!`);
                }
            )

        return;
    }
}

module.exports = Role;
