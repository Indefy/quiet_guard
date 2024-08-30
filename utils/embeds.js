const { EmbedBuilder } = require('discord.js');

function createTimeoutWarning(user, strikes) {
    return new EmbedBuilder()
        .setColor('#ffcc00')
        .setTitle('Warning')
        .setDescription(`You have received ${strikes} strikes for leaving and rejoining the voice channel. You will be timed out on the next strike.`)
        .setFooter({ text: 'QuietGuard Bot' });
}

function createTimeoutNotification(user, duration) {
    return new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('Timeout Issued')
        .setDescription(`${user.tag} has been timed out for ${duration / 60000} minutes due to repeatedly joining and leaving voice channels.`)
        .setFooter({ text: 'QuietGuard Bot' });
}

function createTimeoutFailure(user, reason) {
    return new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('Timeout Failed')
        .setDescription(`Failed to timeout ${user.tag} due to ${reason}.`)
        .setFooter({ text: 'QuietGuard Bot' });
}

module.exports = {
    createTimeoutWarning,
    createTimeoutNotification,
    createTimeoutFailure
};

// const { MessageEmbed } = require('discord.js');

// module.exports = {
//     welcomeEmbed: (member) => {
//         return new MessageEmbed()
//             .setColor('#00FF00')
//             .setTitle(`Welcome ${member.user.username}!`)
//             .setDescription('We are happy to have you here!')
//             .setThumbnail(member.user.displayAvatarURL())
//             .setTimestamp();
//     },

//     timeoutWarningEmbed: (user) => {
//         return new MessageEmbed()
//             .setColor('#FF0000')
//             .setTitle('Warning')
//             .setDescription(`${user.username}, you are being annoying by repeatedly joining and leaving the voice channel.`)
//             .addField('Final Warning', 'If you continue, you will be timed out.')
//             .setTimestamp();
//     },

//     timeoutEmbed: (user, duration) => {
//         return new MessageEmbed()
//             .setColor('#FF0000')
//             .setTitle('Timeout Issued')
//             .setDescription(`${user.username} has been timed out for ${duration / 1000} seconds.`)
//             .setTimestamp();
//     }
// };
