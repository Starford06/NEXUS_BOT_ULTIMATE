import { evaluate } from 'mathjs';

export const command = {
    name: 'math',
    description: 'Solve math: .math 25 * 45 / sqrt(16)',
    execute: async (sock, msg, args) => {
        if (args.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Usage: .math <expression>' });
        try {
            const expression = args.join(' ');
            const result = evaluate(expression);
            await sock.sendMessage(msg.key.remoteJid, { text: `🧮 *Result:* ${result}` });
        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Invalid math expression.' });
        }
    }
};