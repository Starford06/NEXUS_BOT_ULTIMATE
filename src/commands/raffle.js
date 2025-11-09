export const command = {
    name: 'raffle',
    description: 'Pick a random winner from the group',
    execute: async (sock, msg, args, cmd, plug, react) => {
        const remoteJid = msg.key.remoteJid;
        if (!remoteJid.endsWith('@g.us')) return await sock.sendMessage(remoteJid, { text: '❌ Groups only.' });

        await react("🎲");
        
        // Optional: Add a countdown for suspense
        await sock.sendMessage(remoteJid, { text: '🎲 *Raffle started!* Picking a winner in 3 seconds...' });
        await new Promise(r => setTimeout(r, 3000));

        try {
            const metadata = await sock.groupMetadata(remoteJid);
            const participants = metadata.participants;
            // Filter out the bot itself so it doesn't win its own raffle
            const eligible = participants.filter(p => !p.id.includes(sock.user.id.split(':')[0]));
            
            const winner = eligible[Math.floor(Math.random() * eligible.length)];

            await sock.sendMessage(remoteJid, { 
                text: `🎉 *CONGRATULATIONS!* 🎉\n\nThe winner is: @${winner.id.split('@')[0]}! 🎁`, 
                mentions: [winner.id] 
            });
            await react("🥳");

        } catch (e) {
            await sock.sendMessage(remoteJid, { text: '❌ Failed to pick a winner.' });
        }
    }
};