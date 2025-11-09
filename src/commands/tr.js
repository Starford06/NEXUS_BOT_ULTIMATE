import { translate } from 'google-translate-api-x';

export const command = {
    name: 'tr',
    description: 'Translate replied text: .tr es (to Spanish) or just .tr (to English)',
    execute: async (sock, msg, args) => {
        const remoteJid = msg.key.remoteJid;
        // Get the text from the quoted message OR the current message args
        const quotedText = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation || 
                           msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.extendedTextMessage?.text;
        
        const textToTranslate = quotedText || args.join(' ');
        // Default to 'en' (English) if no language code provided
        const targetLang = args[0]?.length === 2 ? args[0] : 'en'; 

        if (!textToTranslate) return await sock.sendMessage(remoteJid, { text: '❌ Reply to a message or provide text to translate.' });

        try {
            const res = await translate(textToTranslate, { to: targetLang });
            const responseText = `🌍 *Translation* (${targetLang}):\n\n${res.text}`;
            await sock.sendMessage(remoteJid, { text: responseText }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(remoteJid, { text: '❌ Translation failed. Check language code.' });
        }
    }
};