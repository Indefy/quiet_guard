const fs = require('fs');
const path = require('path');

const webhooksFile = path.join(__dirname, '../data/webhooks.json');

function getWebhookForGuild(guildId) {
    const webhooks = JSON.parse(fs.readFileSync(webhooksFile, 'utf-8'));
    return webhooks[guildId] || null;
}

module.exports = { getWebhookForGuild };
