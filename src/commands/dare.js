const dares = [
    "Send a voice note singing your favorite song.", "Post an embarrassing photo on your status.", 
    "Text your crush and tell them you love them.", "Do 20 pushups right now and send video proof."
];
export const command = {
    name: 'dare', description: 'Get a Dare challenge',
    execute: async (sock, msg, args) => {
        const d = dares[Math.floor(Math.random() * dares.length)];
        await sock.sendMessage(msg.key.remoteJid, { text: `😈 *DARE:* ${d}` });
    }
};