module.exports = [
    {
        event: 'ready',
        response: () => Logger.log('I am ready!')
    },
    {
        event: 'guildMemberAdd',
        response: (guild, member) => {
            Logger.log(`New User "${member.user.username}" has joined "${guild.name}"` );
            guild.defaultChannel.sendMessage(`"${member.user.username}" has joined this server`);
        }
    }
];
