import axios from 'axios';
import { decode } from 'html-entities'; // Helpful for cleaning up API text

export const command = {
    name: 'trivia',
    description: 'Get a random trivia question',
    execute: async (sock, msg, args) => {
        try {
            // Fetch 1 question from OpenTriviaDB
            const { data } = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple');
            const questionData = data.results[0];

            // Combine correct and incorrect answers, then shuffle them
            const allAnswers = [...questionData.incorrect_answers, questionData.correct_answer]
                .sort(() => Math.random() - 0.5);

            // Format the output with readable text (decoding HTML entities like &quot;)
            let responseText = `🧠 *TRIVIA TIME* 🧠\n\n` +
                               `*Category:* ${questionData.category}\n` +
                               `*Difficulty:* ${questionData.difficulty}\n\n` +
                               `❓ *Question:* ${decode(questionData.question)}\n\n`;

            // List options
            allAnswers.forEach((ans, index) => {
                responseText += `${index + 1}. ${decode(ans)}\n`;
            });

            // Add the answer hidden behind a WhatsApp spoiler (requires many spaces to push it down)
            // Note: The 'read more' spoiler trick uses a special unseen character.
            const spoiler = '\u200B'.repeat(4000); 
            responseText += `${spoiler}\n\n🎯 *Correct Answer:* ${decode(questionData.correct_answer)}`;

            await sock.sendMessage(msg.key.remoteJid, { text: responseText });

        } catch (e) {
            console.error(e);
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Failed to fetch a trivia question.' });
        }
    }
};