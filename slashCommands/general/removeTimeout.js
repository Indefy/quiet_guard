const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removetimeout')
        .setDescription('Removes a timeout from a user.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to remove the timeout from')
                .setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('target');

        try {
            const member = await interaction.guild.members.fetch(target.id);
            await member.timeout(null); // Remove the timeout
            await interaction.reply(`${target.username} has had their timeout removed.`);
        } catch (error) {
            console.error(error);
            await interaction.reply('Failed to remove timeout. Please make sure the bot has the necessary permissions.');
        }
    },
};
