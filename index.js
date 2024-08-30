const { Client, GatewayIntentBits, PermissionsBitField, EmbedBuilder } = require('discord.js');
require('dotenv').config();

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

const userStrikes = new Map();
 // Number of strikes before timeout
const STRIKE_THRESHOLD = 3;
 // Timeout durations for 1st, 2nd, and 3rd offense in ms
const TIMEOUT_DURATION = [600000, 1200000, 1800000];
 // Final timer before warning message in ms
const WARNING_DURATION = 900000;
 // 5 minutes
const INITIAL_TIMER_DURATION = 300000;

client.once('ready', () => {
    client.user.setPresence({
        activities: [{ name: 'Monitoring Voice Channels', type: 'WATCHING' }],
        status: 'online',
    });
    console.log(`Logged in as ${client.user.tag}`);
});

function startTimerForUser(userId, guild, channel) {
    if (!userStrikes.has(userId)) {
        userStrikes.set(userId, { strikes: 0, timer: null });
    }

    const userInfo = userStrikes.get(userId);

    if (userInfo.strikes === 0) {
        // First join: Start the 5-minute timer without incrementing strikes
        userInfo.timer = setTimeout(() => {
            console.log(`First timer expired for user ${userId}`);
            userStrikes.delete(userId);
        }, INITIAL_TIMER_DURATION);
    }

    console.log(`Timer started for user ${userId} with ${userInfo.strikes} strikes`);
    userStrikes.set(userId, userInfo);
}

function handleUserLeave(userId, guild, channel) {
    const userInfo = userStrikes.get(userId);

    if (!userInfo) {
        return;
    }

    clearTimeout(userInfo.timer);
    userInfo.strikes += 1;

    if (userInfo.strikes === STRIKE_THRESHOLD) {
        timeoutUser(userId, guild, channel);
        resetUserStrikes(userId);
    } else if (userInfo.strikes === STRIKE_THRESHOLD - 1) {
        sendWarningMessage(userId, guild, channel);
        userInfo.timer = setTimeout(() => {
            console.log(`Final warning timer expired for user ${userId}`);
            resetUserStrikes(userId);
        }, WARNING_DURATION);
    } else {
        userInfo.timer = setTimeout(() => {
            console.log(`Timer expired for user ${userId} with ${userInfo.strikes} strikes`);
            resetUserStrikes(userId);
        }, INITIAL_TIMER_DURATION);
    }

    console.log(`User ${userId} left voice channel. Strikes: ${userInfo.strikes}`);
    userStrikes.set(userId, userInfo);
}

function sendWarningMessage(userId, guild, channel) {
    const member = guild.members.cache.get(userId);
    if (member) {
        const embed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('Final Warning')
            .setDescription(`**${member.displayName}**, please stop rapidly joining and leaving voice channels. If you do this again, you will be timed out.`)
            .setFooter({ text: 'QuietGuard Bot', iconURL: client.user.displayAvatarURL() })
            .setTimestamp();

        channel.send({ embeds: [embed] });
        console.log(`Warning message sent to ${member.displayName}`);
    } else {
        console.log(`Warning message could not be sent to user ID: ${userId} (Member not found)`);
    }
}

function timeoutUser(userId, guild, channel) {
    const member = guild.members.cache.get(userId);

    if (member) {
        const strikeCount = userStrikes.get(userId).strikes;
        const timeoutDuration = TIMEOUT_DURATION[strikeCount - 1] || TIMEOUT_DURATION[0];

        console.log(`Attempting to timeout ${member.displayName} (ID: ${member.id}) in server ${guild.name} (ID: ${guild.id}) for ${timeoutDuration / 60000} minutes`);

        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('Timeout Issued')
            .setDescription(`**${member.displayName}** has been timed out for **${timeoutDuration / 60000}** minutes due to repeatedly joining and leaving voice channels.`)
            .setFooter({ text: 'QuietGuard Bot', iconURL: client.user.displayAvatarURL() })
            .setTimestamp();

        channel.send({ embeds: [embed] });

        member.timeout(timeoutDuration, 'Repeatedly joining and leaving voice channels')
            .then(() => {
                console.log(`Successfully timed out ${member.displayName} (ID: ${member.id}) for ${timeoutDuration / 60000} minutes`);
            })
            .catch(error => {
                if (error.code === 50013) {
                    console.error(`Failed to timeout ${member.displayName} (ID: ${member.id}) in server ${guild.name} (ID: ${guild.id}): Missing Permissions`);

                    const errorEmbed = new EmbedBuilder()
                        .setColor('#FF0000')
                        .setTitle('Timeout Failed')
                        .setDescription(`Failed to timeout **${member.displayName}** due to missing permissions.`)
                        .addFields({ name: 'Suggestions', value: `
                            1. Ensure the bot's role is higher than the role of ${member.displayName}.
                            2. Confirm that the bot has 'Manage Roles', 'Kick Members', and 'Mute Members' permissions.
                            3. Check if any channel-specific permissions are overriding the bot's permissions.
                            4. If you're using role hierarchies, ensure the bot's role is not lower than the target member's roles.
                        `})
                        .setFooter({ text: 'QuietGuard Bot', iconURL: client.user.displayAvatarURL() })
                        .setTimestamp();

                    channel.send({ embeds: [errorEmbed] });
                } else {
                    console.error(`Failed to timeout ${member.displayName} (ID: ${member.id}) in server ${guild.name} (ID: ${guild.id}): ${error.message}`);
                }
            });
    } else {
        console.error(`Could not find member in server ${guild.name} (ID: ${guild.id})`);
        const errorEmbed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('Member Not Found')
            .setDescription(`Could not find member with ID: **${userId}** in server **${guild.name}** (ID: **${guild.id}**).`)
            .setFooter({ text: 'QuietGuard Bot', iconURL: client.user.displayAvatarURL() })
            .setTimestamp();

        channel.send({ embeds: [errorEmbed] });
    }
}

function resetUserStrikes(userId) {
    if (userStrikes.has(userId)) {
        clearTimeout(userStrikes.get(userId).timer);
        userStrikes.delete(userId);
        console.log(`User strikes reset for user ID: ${userId}`);
    }
}

client.on('voiceStateUpdate', (oldState, newState) => {
    const userId = newState.id;
    const guild = oldState.guild;
    const channel = guild.systemChannel || guild.channels.cache.find(ch => ch.type === 0);

    if (!channel) {
        console.error('No valid channel found to send messages');
        return;
    }

    if (!oldState.channelId && newState.channelId) {
        // User joined a voice channel
        startTimerForUser(userId, guild, channel);
    } else if (oldState.channelId && !newState.channelId) {
        // User left a voice channel
        handleUserLeave(userId, guild, channel);
    }
});

client.login(process.env.DISCORD_TOKEN);