const { REST, Routes } = require('discord.js');
require('dotenv').config();

const commands = [
    {
        name: 'help',
        description: 'List all available commands and their descriptions.',
    },
    {
        name: 'ping',
        description: 'Replies with Pong!',
    },
    {
        name: 'kick',
        description: 'Kicks a user from the server.',
    },
    {
        name: 'setup-webhook',
        description: 'Sets up a webhook for the bot to send messages.',
    },
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

async function deployCommands(guildId) {
    try {
        console.log(`Started refreshing application (/) commands for guild ID ${guildId}.`);

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
            { body: commands },
        );

        console.log(`Successfully reloaded application (/) commands for guild ID ${guildId}.`);
    } catch (error) {
        console.error(`Failed to deploy commands for guild ID ${guildId}:`, error);
    }
}

module.exports = { deployCommands };
