import crypto from 'crypto';

export const command = {
    name: 'hash',
    description: 'Generate hash: .hash <md5|sha256|sha512> <text>',
    execute: async (sock, msg, args, cmd, plug, react) => {
        if (args.length < 2) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Usage: .hash <algorithm> <text>\nExample: .hash sha256 hello' });

        const algo = args[0].toLowerCase();
        const text = args.slice(1).join(' ');
        const validAlgos = ['md5', 'sha1', 'sha256', 'sha512'];

        if (!validAlgos.includes(algo)) {
            return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Supported algorithms: md5, sha1, sha256, sha512' });
        }

        try {
            const hash = crypto.createHash(algo).update(text).digest('hex');
            await sock.sendMessage(msg.key.remoteJid, { 
                text: `🔒 *${algo.toUpperCase()} Hash*\n\n\`\`\`${hash}\`\`\`` 
            });
        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Hashing failed.' });
        }
    }
};