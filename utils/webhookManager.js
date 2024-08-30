const { getWebhookForGuild } = require('./webhookHelper');

async function sendWebhookNotification(guildId, message) {
    const webhook = getWebhookForGuild(guildId);

    if (webhook) {
        const webhookClient = new WebhookClient({ id: webhook.id, token: webhook.token });
        try {
            await webhookClient.send(message);
        } catch (error) {
            console.error('Failed to send webhook message:', error);
        }
    } else {
        console.log(`No webhook set up for guild ${guildId}.`);
    }
}

module.exports = { sendWebhookNotification };
