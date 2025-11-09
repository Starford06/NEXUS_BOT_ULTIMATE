import axios from 'axios';

export const command = {
    name: 'run',
    description: 'Execute code: .run <language> <code>',
    execute: async (sock, msg, args, cmd, plug, react) => {
        if (args.length < 2) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Usage: .run <language> <code>\nExample: .run python print("hello")' });

        const lang = args[0].toLowerCase();
        const code = args.slice(1).join(' ');

        await react("⚙️");

        try {
            // Using Piston API (Free, safe remote code execution)
            const { data } = await axios.post('https://emkc.org/api/v2/piston/execute', {
                language: lang,
                version: "*", // Use latest available version
                files: [{ content: code }]
            });

            if (data.run && (data.run.stdout || data.run.stderr)) {
                const output = data.run.stdout || data.run.stderr;
                await sock.sendMessage(msg.key.remoteJid, { 
                    text: `💻 *${lang.toUpperCase()} Output:*\n\n\`\`\`${output}\`\`\`` 
                }, { quoted: msg });
                await react("✅");
            } else {
                await sock.sendMessage(msg.key.remoteJid, { text: '❌ No output returned (or language unsupported).' });
                await react("⚠️");
            }

        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Execution failed. Language might be invalid.' });
        }
    }
};