module.exports = {
    name: 'help',
    description: 'Shows a list of available commands',
    execute(message, args) {
        message.channel.send('Available commands: !help, !ping, !kick');
    },
};
