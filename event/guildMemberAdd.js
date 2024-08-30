module.exports = {
    name: 'guildMemberAdd',
    execute(member) {
        const channel = member.guild.systemChannel;
        if (channel) {
            channel.send(`Welcome to the server, ${member.user.tag}!`);
        }
    },
};
