const { sendWebhookNotification } = require('../utils/webhookManager');

module.exports = {
    name: 'someEvent',
    async execute(someArgs) {
        // Example usage
        const message = `An event occurred!`;
        await sendWebhookNotification(someArgs.guild.id, message);
    },
};
