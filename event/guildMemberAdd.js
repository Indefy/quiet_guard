module.exports = {
    name: 'guildMemberAdd',
    execute(member) {
        const channel = member.guild.systemChannel; // Or specify a channel ID
        if (channel) {
            channel.send(`Welcome to the server, ${member.user.tag}!`);
        }
    },
};

// const { welcomeEmbed } = require('../utils/embeds');

// module.exports = {
//     name: 'guildMemberAdd',
//     execute(member) {
//         const channel = member.guild.systemChannel; // Or specify a channel ID
//         if (channel) {
//             channel.send({ embeds: [welcomeEmbed(member)] });
//         }
//     },
// };
