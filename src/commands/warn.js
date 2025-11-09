import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WARNS_PATH = path.resolve(__dirname, '../../data/warns.json');
const MAX_WARNS = 3;

export const command = {
    name: 'warn',
    description: 'Warn a user. Kicks after 3 warns.',
    execute: async (sock, msg, args, cmd, plug, react) => { // Added 'react' here
        const remoteJid = msg.key.remoteJid;
        if (!remoteJid.endsWith('@g.us')) return await sock.sendMessage(remoteJid, { text: '❌ Group command only.' });

        const target = msg.message?.extendedTextMessage?.contextInfo?.participant || 
                       msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

        if (!target) return await sock.sendMessage(remoteJid, { text: '❌ Reply to or mention a user to warn.' });

        await react("⚠️"); // Added reaction

        let warns = {};
        try { warns = JSON.parse(fs.readFileSync(WARNS_PATH, 'utf8')); } catch (e) {}
        if (!warns[remoteJid]) warns[remoteJid] = {};
        
        warns[remoteJid][target] = (warns[remoteJid][target] || 0) + 1;
        fs.writeFileSync(WARNS_PATH, JSON.stringify(warns, null, 2));

        const currentWarns = warns[remoteJid][target];
        await sock.sendMessage(remoteJid, { 
            text: `⚠️ *WARNING* @${target.split('@')[0]} has been warned!\nStatus: [${currentWarns}/${MAX_WARNS}]`,
            mentions: [target]
        });

        if (currentWarns >= MAX_WARNS) {
            await sock.sendMessage(remoteJid, { text: '🚫 *Max warnings reached. Bye!*' });
            try {
                await sock.groupParticipantsUpdate(remoteJid, [target], 'remove');
                delete warns[remoteJid][target];
                fs.writeFileSync(WARNS_PATH, JSON.stringify(warns, null, 2));
                await react("👢"); // Added kick reaction
            } catch (e) {
                await sock.sendMessage(remoteJid, { text: '❌ Failed to kick. Ensure I am admin.' });
            }
        } else {
            await react("✅");
        }
    }
};