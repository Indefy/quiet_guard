const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('List all available commands and their descriptions.'),
    async execute(interaction) {
        // Dynamically list all commands
        const commands = interaction.client.slashCommands.map(command => {
            return { name: `/${command.data.name}`, value: command.data.description || 'No description available.' };
        });

        // Create the embed message
        const helpEmbed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('Available Commands')
            .setDescription('Here are the commands you can use:')
            .addFields(commands)
            .addFields(
                { name: '\u200B', value: '\u200B' },  // Blank field for spacing
                { name: 'Tips for usage', value: 'Here are some tips for using the bot effectively:' },
                { name: 'Tip 1', value: 'Use `/ping` to check if the bot is online and responsive.' },
                { name: 'Tip 2', value: 'Use `/kick @username` to kick a user from the server.' },
                { name: 'Tip 3', value: 'Use `/help` to get a list of all available commands at any time.' }
            )
            .setFooter({ text: 'QuietGuard Bot', iconURL: interaction.client.user.displayAvatarURL() });

        // Send the embed as a reply
        await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
    },
};
