import { randomUUID } from 'crypto';

export const command = {
    name: 'uuid',
    description: 'Generate a random UUID v4',
    execute: async (sock, msg, args, cmd, plug, react) => { // Added 'react'
        await react("🆔");
        const uuid = randomUUID();
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `🆔 *New UUID:*\n\n\`\`\`${uuid}\`\`\`` 
        });
        await react("✅");
    }
};