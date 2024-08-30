module.exports = {
    name: 'kick',
    description: 'Kicks a user from the server',
    execute(message, args) {
        if (!message.member.permissions.has('KICK_MEMBERS')) {
            return message.reply('You do not have permission to kick members.');
        }

        const member = message.mentions.members.first();
        if (!member) return message.reply('Please mention a user to kick.');

        const reason = args.slice(1).join(' ') || 'No reason provided';
        member.kick(reason)
            .then(() => message.channel.send(`${member.user.tag} was kicked. Reason: ${reason}`))
            .catch(err => message.reply('Unable to kick member.'));
    },
};
