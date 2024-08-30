const { createTimeoutWarning, createTimeoutNotification, createTimeoutFailure } = require('./embeds');

const userTimers = new Map();

function timeoutUser(member, guild) {
    const userId = member.id;
    let userInfo = userTimers.get(userId);

    if (!userInfo) {
        userInfo = { strikes: 0, timer: null };
        userTimers.set(userId, userInfo);
    }

    if (userInfo.strikes >= 2) {
        // Timeout the user on the third strike
         // 10 minutes for the first timeout, 20 for the second, etc.
        const duration = 600000 * (userInfo.strikes + 1);
        member.timeout(duration, 'Repeatedly joining and leaving voice channels')
            .then(() => {
                const embed = createTimeoutNotification(member.user, duration);
                guild.systemChannel.send({ embeds: [embed] });
                // Reset strikes after the timeout
                userTimers.delete(userId);
            })
            .catch(error => {
                const embed = createTimeoutFailure(member.user, error.message);
                guild.systemChannel.send({ embeds: [embed] });
            });
    } else {
        // Increment the strikes and notify the user
        userInfo.strikes += 1;

        const embed = createTimeoutWarning(member.user, userInfo.strikes);
        guild.systemChannel.send({ embeds: [embed] });

        // Clear the previous timer and set a new one
        if (userInfo.timer) clearTimeout(userInfo.timer);
         // 5 minutes for strikes 1 and 2, 15 minutes for strike 3
        const timeoutDuration = userInfo.strikes < 2 ? 300000 : 900000;
         // Reset the strikes if the user behaves for the timeout duration
        userInfo.timer = setTimeout(() => {
            userTimers.delete(userId);
        }, timeoutDuration);
        // Update the map with the new timer
        userTimers.set(userId, userInfo);
    }
}

function trackUser(userId, guild) {
    const member = guild.members.cache.get(userId);
    if (!member) {
        console.error(`Member with ID ${userId} not found in guild ${guild.id}`);
        return;
    }

    // Call the timeout function to simulate behavior
    timeoutUser(member, guild);
}

module.exports = { trackUser, timeoutUser };
