export const command = {
    name: 'id',
    description: 'Gets the current chat ID',
    execute: async (sock, msg, args) => {
        const chat = msg.key.remoteJid;
        await sock.sendMessage(chat, { text: `Current Chat ID:\n\`${chat}\`` });
    }
};