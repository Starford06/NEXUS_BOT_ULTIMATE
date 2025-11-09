export const command = {
    name: 'epoch',
    description: 'Convert Unix timestamp: .epoch (current) OR .epoch 1678886400',
    execute: async (sock, msg, args, cmd, plug, react) => {
        let timestamp, date;

        // If no args, give current time
        if (args.length === 0) {
            timestamp = Math.floor(Date.now() / 1000);
            date = new Date();
        } else {
            timestamp = parseInt(args[0]);
            // Check if it's likely milliseconds (13 digits) instead of seconds (10 digits) and adjust
            if (args[0].length > 11) timestamp = Math.floor(timestamp / 1000); 
            date = new Date(timestamp * 1000);
        }

        if (isNaN(date.getTime())) {
             return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Invalid timestamp.' });
        }

        const text = `🕒 *Unix Epoch Time*\n\n` +
                     `📥 *Timestamp:* \`${timestamp}\`\n` +
                     `📅 *GMT:* ${date.toUTCString()}\n` +
                     `🌏 *Local:* ${date.toLocaleString()}`;

        await sock.sendMessage(msg.key.remoteJid, { text });
    }
};