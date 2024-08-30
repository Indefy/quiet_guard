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

    const guild = client.guilds.cache.get('773206231480664075');
    if (!guild) {
        console.error('Guild not found');
        return;
    }

    const userId = '427239938728132609'; 

    console.log('Simulating user action 1');
    trackUser(userId, guild);

    setTimeout(() => {
        console.log('Simulating user action 2');
        trackUser(userId, guild);
    }, 3000);

    setTimeout(() => {
        console.log('Simulating user action 3');
        trackUser(userId, guild);
    }, 6000);
});

client.login(process.env.DISCORD_TOKEN);
