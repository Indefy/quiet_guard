module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        client.user.setPresence({
            activities: [{ name: 'Monitoring Voice Channels', type: 'WATCHING' }],
            status: 'online',
        });
        console.log(`Logged in as ${client.user.tag}`);
    },
};
