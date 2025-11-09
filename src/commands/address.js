import { faker, allLocales } from '@faker-js/faker';

export const command = {
    name: 'address',
    description: 'Generate a fake identity/address. Usage: .address [locale_code] (e.g., .address ru, .address de)',
    execute: async (sock, msg, args, cmd, plug, react) => {
        await react("🏗️");

        // Default to English (US) if no locale specified
        let selectedFaker = faker;
        let localeName = "Default (US/EN)";

        // Try to switch locale if user provided one (e.g., 'ru', 'de', 'fr', 'ja')
        if (args.length > 0) {
            const requestedLocale = args[0].toLowerCase();
            // Find a matching locale from the available list
            const match = Object.keys(allLocales).find(key => key.toLowerCase().startsWith(requestedLocale));
            
            if (match && allLocales[match]) {
                // Create a new faker instance with the specific locale
                // We need to import the specific constructor for this to work dynamically with allLocales,
                // but for simplicity in this setup, we might have to stick to base faker or do a slightly complex import.
                // A simpler way for basic bots is just to rely on standard faker or pre-import a few popular ones.
                
                // Actually, modern faker lets you use specific locales easily if you import them:
                // But dynamically is hard. Let's stick to a simpler approach: 
                // We will use the base faker but try to force the country name if possible, 
                // OR just stick to the default which is very robust.
                
                // RETRYING Dynamic Locale Implementation (Advanced):
                 try {
                     const { Faker, [match]: localeData } = await import('@faker-js/faker');
                     selectedFaker = new Faker({ locale: [localeData, allLocales.en] });
                     localeName = match.toUpperCase();
                 } catch (e) {
                     // Fallback to default if dynamic import fails
                     localeName = "Fallback (EN)";
                 }
            }
        }

        try {
            // Generate the data
            const firstName = selectedFaker.person.firstName();
            const lastName = selectedFaker.person.lastName();
            const street = selectedFaker.location.streetAddress(true); // true = full address
            const city = selectedFaker.location.city();
            const zip = selectedFaker.location.zipCode();
            const state = selectedFaker.location.state();
            const country = selectedFaker.location.country();
            const phone = selectedFaker.phone.number();

            const text = `🏠 *FAKE IDENTITY GENERATOR* 🏠\n` +
                         `_Locale: ${localeName}_\n\n` +
                         `👤 *Name:* ${firstName} ${lastName}\n` +
                         `📍 *Street:* ${street}\n` +
                         `🏙️ *City:* ${city}, ${state} ${zip}\n` +
                         `🏳️ *Country:* ${country}\n` +
                         `📞 *Phone:* ${phone}`;

            await sock.sendMessage(msg.key.remoteJid, { text });
            await react("✅");

        } catch (e) {
            console.error("Faker Error:", e);
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Failed to generate address.' });
        }
    }
};