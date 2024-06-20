const Snoway = require("../../structures/client");
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'mybot',
    aliases: ["mybots", "bot", "bots"],
    description: {
        fr: 'Affiche vos bots',
        en: "Display your bots"
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {import('discord.js').Message} message 
     * @param {string[]} args 
     * @returns 
     */
    run: async (client, message, args) => {
        try {
            console.log('Fetching bots for user:', message.author.id);
            const response = await client.functions.api.botget(message.author.id);
            console.log('Raw response:', response);

            const bots = response.bots || [];
            console.log('Bots fetched:', bots);

            if (bots.length === 0) {
                console.log('No bots found for user:', message.author.id);
                return message.reply({ content: await client.lang('mybot.aucun') });
            }

            const embed = new EmbedBuilder()
                .setTitle(await client.lang('mybot.embed.title'))
                .setColor(client.color)
                .setFooter({ text: client.footer }); // Adjusted for proper footer usage
            
            let description = "";

            for (let index = 0; index < bots.length; index++) {
                const bot = bots[index];
                console.log(`Fetching user for bot ${bot.bot}`);

                const botUser = await client.users.fetch(bot.bot).catch(err => {
                    console.error(`Error fetching user for bot ${bot.bot}:`, err);
                    return null;
                });

                console.log('Fetched bot user:', botUser);

                description += `**${index + 1})** [\`${botUser ? botUser.tag : `${await client.lang('mybot.nobot')}`}\`](https://discord.com/api/oauth2/authorize?client_id=${bot.bot}&permissions=8&scope=bot%20applications.commands): <t:${Math.floor(bot.temps / 1000)}:R> ${bot.buyer ? "(buyer)" : ""}\n`;
            }

            embed.setDescription(description);
            await message.channel.send({ embeds: [embed] });
            console.log('Embed sent successfully.');
        } catch (error) {
            console.error('Error executing mybot command:', error);
            message.reply({ content: 'An error occurred while executing the command.' });
        }
    },
};

