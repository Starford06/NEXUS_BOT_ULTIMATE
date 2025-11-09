export const command = {
    name: 'mock',
    description: 'tUrN tExT iNtO tHiS',
    execute: async (sock, msg, args, cmd, plug, react) => {
        // Get text from args OR quoted message
        const text = args.join(' ') || 
                     msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation || 
                     msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.extendedTextMessage?.text;

        if (!text) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Provide text or reply to a message.' });

        let mockedText = '';
        for (let i = 0; i < text.length; i++) {
            // Randomly choose upper or lower case for each letter
            mockedText += Math.random() > 0.5 ? text[i].toUpperCase() : text[i].toLowerCase();
        }

        // Send it and react to the original message for extra flair
        await sock.sendMessage(msg.key.remoteJid, { text: mockedText });
        await react("🤪");
    }
};