export const command = {
    name: 'slots',
    description: 'Play the slot machine',
    execute: async (sock, msg, args, cmd, plug, react) => {
        const fruits = ['🍎', '🍐', '🍊', '🍋', '🍉', '🍇', '🍓', '🍒', '💎'];
        const r1 = fruits[Math.floor(Math.random() * fruits.length)];
        const r2 = fruits[Math.floor(Math.random() * fruits.length)];
        const r3 = fruits[Math.floor(Math.random() * fruits.length)];

        const isWin = (r1 === r2 && r2 === r3);
        const isJackpot = isWin && r1 === '💎';

        let resultText = `🎰 *SLOTS* 🎰\n\n` +
                         `[ ${r1} | ${r2} | ${r3} ]\n\n`;

        if (isJackpot) {
            resultText += `💰💰 *JACKPOT!!* 💰💰`;
            await react("🤑");
        } else if (isWin) {
            resultText += `🎉 *WINNER!* 🎉`;
            await react("🎉");
        } else {
            resultText += `❌ *Better luck next time*`;
            await react("🎰");
        }

        await sock.sendMessage(msg.key.remoteJid, { text: resultText }, { quoted: msg });
    }
};