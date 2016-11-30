module.exports = [
    {
        event: 'ready', 
        response: () => console.log('I am ready!')
    },
    {
        event: 'guildMemberAdd', 
        response: (guild, member) => {
            console.log(`New User "${member.user.username}" has joined "${guild.name}"` );
            guild.defaultChannel.sendMessage(`"${member.user.username}" has joined this server`);
        }
    }
];
