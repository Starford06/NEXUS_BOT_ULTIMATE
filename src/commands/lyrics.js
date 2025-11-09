import lyricsFinder from 'lyrics-finder';

export const command = {
    name: 'lyrics',
    description: 'Get song lyrics: .lyrics Shape of You',
    execute: async (sock, msg, args) => {
        if (args.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Usage: .lyrics <song name>' });
        await sock.sendMessage(msg.key.remoteJid, { react: { text: "🎵", key: msg.key } });
        try {
            const lyrics = await lyricsFinder("", args.join(' ')) || "Not found!";
            if (lyrics === "Not found!") throw new Error();
            await sock.sendMessage(msg.key.remoteJid, { text: `🎤 *Lyrics for ${args.join(' ')}*\n\n${lyrics}` });
        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Lyrics not found.' });
        }
    }
};