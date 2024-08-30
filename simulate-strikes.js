const { Client, GatewayIntentBits } = require('discord.js');
const { trackUser } = require('./utils/helpers');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);

    const guild = client.guilds.cache.get('773206231480664075'); // Replace with your Guild ID
    if (!guild) {
        console.error('Guild not found');
        return;
    }

    const userId = '427239938728132609'; // Replace with the ID of the user you're simulating

    console.log('Simulating user action 1');
    trackUser(userId, guild);  // Simulate first action

    setTimeout(() => {
        console.log('Simulating user action 2');
        trackUser(userId, guild);  // Simulate second action
    }, 3000);

    setTimeout(() => {
        console.log('Simulating user action 3');
        trackUser(userId, guild);  // Simulate third action
    }, 6000);
});

client.login(process.env.DISCORD_TOKEN);
