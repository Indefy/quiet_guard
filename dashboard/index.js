require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Client, GatewayIntentBits } = require('discord.js');
const CommandBuilder = require('./builders/CommandBuilder');
const Logger = require('./utils/logger');
const app = express();
const port = 3001;

const commandLogs = [];
const userActivityLogs = [];

// Create a new Discord client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
    ]
});

// Log in to Discord with your app's token
client.login(process.env.DISCORD_TOKEN);

app.use(cors());
app.use(express.json());

// Error Handling and Logging Middleware
app.use((req, res, next) => {
    Logger.logRequest('Request received', req);
    next();
});

// Bot status
app.get('/api/bot-status', (req, res) => {
    try {
        res.json({ status: 'Bot is running' });
    } catch (error) {
        Logger.logError('Failed to fetch bot status', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Command log endpoint
app.post('/api/command', (req, res) => {
    try {
        const { command, user } = req.body;
        const logEntry = new CommandBuilder(command, user).build();
        commandLogs.push(logEntry);
        Logger.logInfo(`Command received: ${command} from ${user || 'Unknown User'}`);
        res.json({ success: true });
    } catch (error) {
        Logger.logError('Failed to log command', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/command-logs', (req, res) => {
    try {
        res.json(commandLogs);
    } catch (error) {
        Logger.logError('Failed to fetch command logs', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// User activity log endpoint
app.post('/api/user-activity', (req, res) => {
    try {
        const { activity, user } = req.body;
        const activityEntry = { activity, user: user || 'Unknown user', timestamp: new Date() };
        userActivityLogs.push(activityEntry);
        Logger.logInfo(`User activity logged: ${activity} by ${user || 'Unknown User'}`);
        res.json({ success: true });
    } catch (error) {
        Logger.logError('Failed to log user activity', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/user-activity-logs', (req, res) => {
    try {
        res.json(userActivityLogs);
    } catch (error) {
        Logger.logError('Failed to fetch user activity logs', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Bot information endpoint
app.get('/api/bot-info', (req, res) => {
    try {
        const uptime = process.uptime();
        const serverCount = client.guilds.cache.size;
        const channelCount = client.channels.cache.size;
        Logger.logInfo('Bot info requested');
        res.json({ uptime, serverCount, channelCount });
    } catch (error) {
        Logger.logError('Failed to fetch bot info', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Servers endpoint
app.get('/api/servers', (req, res) => {
    try {
        const servers = client.guilds.cache.map(guild => ({
            id: guild.id,
            name: guild.name,
            memberCount: guild.memberCount,
        }));
        Logger.logInfo('Server list requested');
        res.json(servers);
    } catch (error) {
        Logger.logError('Failed to fetch server list', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    Logger.logInfo(`Server running on http://localhost:${port}`);
});

client.once('ready', () => {
    Logger.logInfo(`Logged in as ${client.user.tag}`);
});
