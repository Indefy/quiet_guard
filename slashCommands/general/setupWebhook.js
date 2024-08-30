const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-webhook')
        .setDescription('Sets up a webhook for notifications.')
        .addChannelOption(option => 
            option.setName('channel')
                  .setDescription('The channel to set up the webhook for')
                  .setRequired(true)),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');

        // Assuming you have a function to set up the webhook
        try {
            // Your logic to create the webhook
            const webhook = await channel.createWebhook({
                name: 'QuietGuard Webhook',
                avatar: interaction.client.user.displayAvatarURL(),
                reason: 'Setting up webhook for notifications',
            });

            await interaction.reply({ content: `Webhook created successfully in ${channel}`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Failed to create webhook. Please try again later.', ephemeral: true });
        }
    },
};
