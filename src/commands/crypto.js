import axios from 'axios';

export const command = {
    name: 'crypto',
    description: 'Check crypto price: .crypto bitcoin',
    execute: async (sock, msg, args, cmd, plug, react) => {
        if (args.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Usage: .crypto <coin name> (e.g., bitcoin, ethereum, dogecoin)' });

        const coinId = args[0].toLowerCase();
        await react("📈");

        try {
            // CoinGecko API (Free tier, no key required for basic use)
            const { data } = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`);

            if (!data[coinId]) {
                await sock.sendMessage(msg.key.remoteJid, { text: '❌ Coin not found. Try the full name (e.g., "bitcoin" instead of "btc").' });
                await react("❓");
                return;
            }

            const price = data[coinId].usd;
            const change = data[coinId].usd_24h_change.toFixed(2);
            const emoji = change >= 0 ? '🟢' : '🔴';

            const text = `💰 *${coinId.toUpperCase()} Price*\n\n` +
                         `💵 *USD:* $${price.toLocaleString()}\n` +
                         `${emoji} *24h Change:* ${change}%`;

            await sock.sendMessage(msg.key.remoteJid, { text });
            await react("✅");

        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Failed to fetch price. API might be rate-limited.' });
        }
    }
};