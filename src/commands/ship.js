export const command = {
    name: 'ship',
    description: 'Calculate compatibility between two people',
    execute: async (sock, msg, args) => {
        // Get mentioned people
        const mentions = msg.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
        
        if (mentions.length < 2) {
             return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Please Mention 2 people: .ship @user1 @user2' });
        }

        const person1 = mentions[0];
        const person2 = mentions[1];
        
        // Generate a fixed percentage based on their IDs so it doesn't change every time they try
        const combined = person1 + person2;
        let sum = 0;
        for (let i = 0; i < combined.length; i++) {
            sum += combined.charCodeAt(i);
        }
        const percentage = sum % 101; // 0 to 100

        let emoji = '😐';
        if (percentage > 90) emoji = '💖';
        else if (percentage > 75) emoji = '😘';
        else if (percentage > 50) emoji = '🙂';
        else if (percentage < 25) emoji = '💀';

        const text = `💘 *MATCH MAKING* 💘\n\n` +
                     `🔻 @${person1.split('@')[0]}\n` +
                     `🔺 @${person2.split('@')[0]}\n\n` +
                     `Result: *${percentage}%* ${emoji}`;

        await sock.sendMessage(msg.key.remoteJid, { text: text, mentions: [person1, person2] });
    }
};