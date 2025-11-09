import axios from 'axios';

export const command = {
    name: 'github',
    description: 'Lookup GitHub user: .github torvalds',
    execute: async (sock, msg, args) => {
        if (args.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Usage: .github <username>' });
        try {
            const { data } = await axios.get(`https://api.github.com/users/${args[0]}`);
            const caption = `🐙 *GitHub Profile* 🐙\n\n` +
                            `*Name:* ${data.name || data.login}\n` +
                            `*Bio:* ${data.bio || 'None'}\n` +
                            `*Repos:* ${data.public_repos}\n` +
                            `*Followers:* ${data.followers}\n` +
                            `*Link:* ${data.html_url}`;
            await sock.sendMessage(msg.key.remoteJid, { image: { url: data.avatar_url }, caption: caption }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ User not found.' });
        }
    }
};