import axios from 'axios';
import * as cheerio from 'cheerio'; // Re-using cheerio from the Google command

export const command = {
    name: 'excuse',
    description: 'Generate a developer excuse',
    execute: async (sock, msg, args, cmd, plug, react) => {
        await react("🤷");
        try {
            // Scrape a random excuse from developerexcuses.com
            const { data } = await axios.get('http://developerexcuses.com/');
            const $ = cheerio.load(data);
            const excuse = $('center a').text().trim();

            await sock.sendMessage(msg.key.remoteJid, { text: `🤷 *Developer Excuse:*\n\n"${excuse}"` });
            await react("✅");

        } catch (e) {
            // Fallback list if the site is down
            const backups = [
                "It works on my machine.",
                "That's not a bug, it's a feature.",
                "I didn't write that part of the code.",
                "It must be a caching issue."
            ];
            const randomBackup = backups[Math.floor(Math.random() * backups.length)];
            await sock.sendMessage(msg.key.remoteJid, { text: `🤷 *Developer Excuse:*\n\n"${randomBackup}"` });
        }
    }
};