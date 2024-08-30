const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a user from the server')
        .addUserOption(option => 
            option.setName('target')
                  .setDescription('The member to kick')
                  .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                  .setDescription('Reason for kicking the member')),
    async execute(interaction) {
        const member = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!interaction.member.permissions.has('KICK_MEMBERS')) {
            return interaction.reply('You do not have permission to kick members.');
        }

        const guildMember = interaction.guild.members.cache.get(member.id);
        if (guildMember) {
            await guildMember.kick(reason);
            await interaction.reply(`${member.tag} was kicked. Reason: ${reason}`);
        } else {
            await interaction.reply('That user is not in this server.');
        }
    },
};
