const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'removetimeout',
    description: 'Removes a timeout from a user if you have the necessary permissions',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return message.reply('You do not have permission to remove timeouts.');
        }

        const member = message.mentions.members.first();
        if (!member) {
            return message.reply('Please mention a valid member to remove the timeout.');
        }

        try {
            await member.timeout(null); // Removes the timeout
            message.reply(`${member.user.tag}'s timeout has been removed.`);
        } catch (error) {
            console.error(error);
            message.reply('Failed to remove timeout. Please ensure I have the correct permissions.');
        }
    },
};
