const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
require('dotenv').config();
const { deployCommands } = require('./deploy-commands');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.commands = new Collection();
client.slashCommands = new Collection();

// Load commands
const commandFiles = fs.readdirSync('./command/general').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./command/general/${file}`);
    client.commands.set(command.name, command);
}

// Load slash commands
const slashCommandFiles = fs.readdirSync('./slashCommands/general').filter(file => file.endsWith('.js'));
for (const file of slashCommandFiles) {
    const command = require(`./slashCommands/general/${file}`);
    if (command.data && command.data.name) {
        client.slashCommands.set(command.data.name, command);
    } else {
        console.error(`Error loading slash command at ${file}: Missing 'data.name'`);
    }
}

// Load events
const eventFiles = fs.readdirSync('./event').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./event/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// Handle interactions
client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) {
        const command = client.slashCommands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
        }
    }
});

    // Deploy slash commands when the bot joins a new guild
    client.on('guildCreate', async guild => {
        await deployCommands(guild.id);
});

client.login(process.env.DISCORD_TOKEN);

// const { Client, GatewayIntentBits, Collection } = require('discord.js');
// const fs = require('fs');
// require('dotenv').config();

// const client = new Client({
//     intents: [
//         GatewayIntentBits.Guilds,
//         GatewayIntentBits.GuildVoiceStates,
//         GatewayIntentBits.GuildMessages,
//         GatewayIntentBits.GuildMessageReactions,
//         GatewayIntentBits.MessageContent,
//         GatewayIntentBits.GuildMembers
//     ]
// });

// client.commands = new Collection();
// client.slashCommands = new Collection();

// // Load commands
// const commandFiles = fs.readdirSync('./command/general').filter(file => file.endsWith('.js'));
// for (const file of commandFiles) {
//     const command = require(`./command/general/${file}`);
//     client.commands.set(command.name, command);
// }

// // Load slash commands
// const slashCommandFiles = fs.readdirSync('./slashCommands/general').filter(file => file.endsWith('.js'));
// for (const file of slashCommandFiles) {
//     const command = require(`./slashCommands/general/${file}`);
//     if (command.data && command.data.name) {
//         client.slashCommands.set(command.data.name, command);
//     } else {
//         console.error(`Error loading slash command at ${file}: Missing 'data.name'`);
//     }
// }

// // Load events
// const eventFiles = fs.readdirSync('./event').filter(file => file.endsWith('.js'));
// for (const file of eventFiles) {
//     const event = require(`./event/${file}`);
//     if (event.once) {
//         client.once(event.name, (...args) => event.execute(...args, client));
//     } else {
//         client.on(event.name, (...args) => event.execute(...args, client));
//     }
// }

// client.login(process.env.DISCORD_TOKEN);