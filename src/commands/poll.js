export const command = {
    name: 'poll',
    description: 'Create a poll: .poll Question | Opt1 | Opt2 | Opt3',
    execute: async (sock, msg, args) => {
        // Join args and split by '|' to get question and options
        const input = args.join(' ');
        const parts = input.split('|').map(p => p.trim()).filter(p => p.length > 0);

        if (parts.length < 3) {
            return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Usage: .poll Question | Option1 | Option2' });
        }

        const name = parts[0];
        const options = parts.slice(1);

        try {
            await sock.sendMessage(msg.key.remoteJid, {
                poll: {
                    name: name,
                    values: options,
                    selectableCount: 1 // Change to 0 if you want multiple choices allowed
                }
            });
        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Failed to create poll.' });
        }
    }
};