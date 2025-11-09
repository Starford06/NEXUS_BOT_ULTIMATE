import { jidNormalizedUser } from '@whiskeysockets/baileys';

export const command = {
    name: 'stalk',
    description: 'Get profile info of replied user or phone number',
    execute: async (sock, msg, args) => {
        let targetJid;

        // 1. Check if it's a reply
        if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
            targetJid = msg.message.extendedTextMessage.contextInfo.participant;
        } 
        // 2. Check if a number was provided as an argument
        else if (args.length > 0) {
            targetJid = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        } 
        else {
            return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Reply to someone or provide a number: .stalk 2547...' });
        }

        try {
            // Fetch Status (About me)
            const statusData = await sock.fetchStatus(targetJid).catch(() => ({ status: 'Unknown/Private' }));
            
            // Fetch Profile Picture (High Resolution)
            let ppUrl;
            try {
                ppUrl = await sock.profilePictureUrl(targetJid, 'image');
            } catch (e) {
                // Fallback image if they have no profile pic or it's private
                ppUrl = 'https://i.imgur.com/HeIi0wU.png'; 
            }

            const caption = `👤 *Profile Stalk* 👤\n\n` +
                            `*User:* @${targetJid.split('@')[0]}\n` +
                            `*About:* ${statusData.status}\n` +
                            `*Date set:* ${new Date(statusData.setAt).toLocaleDateString()}`;

            // Send image with caption
            await sock.sendMessage(msg.key.remoteJid, { 
                image: { url: ppUrl }, 
                caption: caption,
                mentions: [targetJid]
            }, { quoted: msg });

        } catch (e) {
            // If everything fails (e.g. invalid number)
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Could not fetch profile. The number might be invalid.' });
        }
    }
};