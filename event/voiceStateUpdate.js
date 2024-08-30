const { createTimeoutWarning, createTimeoutNotification, createTimeoutFailure } = require('../utils/embeds');

const userTimers = new Map(); // To keep track of users and their strikes

function trackUser(userId, guild) {
    const member = guild.members.cache.get(userId);
    if (!member) return;

    let userInfo = userTimers.get(userId);

    if (!userInfo) {
        // If the user isn't being tracked yet, initialize their strike count
        userInfo = { strikes: 0 };
        userTimers.set(userId, userInfo);
        console.log(`Timer started for user ${userId} with ${userInfo.strikes} strikes`);
    } else {
        // Increment the strike count
        userInfo.strikes += 1;
        console.log(`Strike incremented for user ${userId}, now at ${userInfo.strikes} strikes`);
    }

    if (userInfo.strikes >= 3) {
        // Timeout the user on the 3rd strike
        timeoutUser(member, guild);
    } else {
        // Send a warning message and reset the timer
        const embed = createTimeoutWarning(member.user, userInfo.strikes);
        guild.systemChannel.send({ embeds: [embed] });

        // Reset the timer for the next potential strike
        const timeoutDuration = userInfo.strikes < 2 ? 300000 : 900000; // 5 minutes for first 2 strikes, 15 minutes for the 3rd
        setTimeout(() => {
            userTimers.delete(userId);
            console.log(`Timer reset for user ${userId}, strikes reset to 0`);
        }, timeoutDuration);
    }
}

function timeoutUser(member, guild) {
    const userId = member.id;
    const userInfo = userTimers.get(userId) || { strikes: 0 };

    // Determine timeout duration based on strikes
    const duration = 60000 * (userInfo.strikes + 1) * 10; // 10 minutes per strike

    member.timeout(duration, 'Repeatedly joining and leaving voice channels')
        .then(() => {
            const embed = createTimeoutNotification(member.user, duration);
            guild.systemChannel.send({ embeds: [embed] });
            userTimers.delete(userId); // Reset strikes after timeout
        })
        .catch(error => {
            const embed = createTimeoutFailure(member.user, error.message);
            guild.systemChannel.send({ embeds: [embed] });
        });
}

module.exports = { trackUser };

// const { timeoutUser } = require('../utils/helpers');

// module.exports = {
//     name: 'voiceStateUpdate',
//     execute(oldState, newState) {
//         const userId = newState.id;

//         if (!oldState.channelId && newState.channelId) {
//             // User joined a voice channel
//             timeoutUser(newState.member, oldState.guild);
//         } else if (oldState.channelId && !newState.channelId) {
//             // User left a voice channel
//             console.log(`${newState.member.user.tag} left voice channel: ${oldState.channel.name}`);
//         }
//     },
// };
