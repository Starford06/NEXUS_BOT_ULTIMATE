import axios from 'axios';

export const command = {
    name: 'bored',
    description: 'Get a random activity suggestion',
    execute: async (sock, msg, args, cmd, plug, react) => {
        await react("🥱");
        try {
            const { data } = await axios.get('https://bored-api.appbrewery.com/random');
            
            const text = `💡 *Activity Suggestion*\n\n` +
                         `🎯 *Do this:* ${data.activity}\n` +
                         `📂 *Type:* ${data.type}\n` +
                         `👥 *Participants needed:* ${data.participants}`;

            await sock.sendMessage(msg.key.remoteJid, { text });
            await react("✅");
        } catch (e) {
            // Fallback if API is down
            const backups = ["Learn a new card trick.", "Organize your music playlists.", "Go for a 10-minute walk without your phone.", "Clean your keyboard."];
            const randomBackup = backups[Math.floor(Math.random() * backups.length)];
            await sock.sendMessage(msg.key.remoteJid, { text: `💡 *Activity Suggestion*\n\n🎯 ${randomBackup}` });
            await react("✅");
        }
    }
};