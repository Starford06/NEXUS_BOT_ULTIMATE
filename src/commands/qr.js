export const command = {
    name: 'qr',
    description: 'Generate a QR code: .qr Hello World',
    execute: async (sock, msg, args) => {
        if (args.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Usage: .qr <text or url>' });

        const data = args.join(' ');
        // We use a public API that returns an image directly
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&margin=10&data=${encodeURIComponent(data)}`;

        try {
            await sock.sendMessage(msg.key.remoteJid, { 
                image: { url: qrUrl }, 
                caption: `📱 *QR Code for:* "${data}"`
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Failed to generate QR code.' });
        }
    }
};