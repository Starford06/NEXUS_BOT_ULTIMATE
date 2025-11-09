export const command = {
    name: 'rps',
    description: 'Play Rock Paper Scissors: .rps rock',
    execute: async (sock, msg, args) => {
        if (args.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Usage: .rps <rock|paper|scissors>' });

        const userChoice = args[0].toLowerCase();
        const validChoices = ['rock', 'paper', 'scissors'];
        if (!validChoices.includes(userChoice)) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Invalid choice. Choose rock, paper, or scissors.' });

        const botChoice = validChoices[Math.floor(Math.random() * validChoices.length)];
        let result = '';

        if (userChoice === botChoice) result = 'It\'s a tie! 🤝';
        else if (
            (userChoice === 'rock' && botChoice === 'scissors') ||
            (userChoice === 'paper' && botChoice === 'rock') ||
            (userChoice === 'scissors' && botChoice === 'paper')
        ) {
            result = 'You win! 🎉';
        } else {
            result = 'I win! 🤖';
        }

        const emojiMap = { rock: '🪨', paper: '📄', scissors: '✂️' };
        const text = `🎮 *Rock Paper Scissors* 🎮\n\n` +
                     `You chose: ${emojiMap[userChoice]} (${userChoice})\n` +
                     `I chose: ${emojiMap[botChoice]} (${botChoice})\n\n` +
                     `*Result:* ${result}`;

        await sock.sendMessage(msg.key.remoteJid, { text: text });
    }
};