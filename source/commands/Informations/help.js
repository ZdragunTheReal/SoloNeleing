const Discord = require('discord.js');
const fs = require('fs');
const Protect = require('../../structures/client/index.js'); // Protect by 1prodige

module.exports = {
    name: "help",
    description: {
        fr: "Affiche les commandes du bot",
        en: "Displays bot commands"
    },
    usage: {
        fr: {
            "help [commande]": "Affiche les commandes ou une commande du bot"
        }, en: {
            "help [command]": "Displays commands or a bot command"
        }
    },
    /**
     * 
     * @param {Protect} client 
     * @param {Discord.Message} message 
     * @param {args[]} args 
     * @returns 
     */
    run: async (client, message, args) => {
        // Add a message to display
        console.log("Protect by 1prodige");

        const lang = await client.db.get(`langue`)
        const aidetext = await client.lang('help.aide')
        const aide = aidetext.replace("{prefix}", `${client.prefix}`)
        if (args.length === 0) {
            const cmddanslefichier = fs.readdirSync('./source/commands').filter(folder => folder !== 'DEV');
            const module = await client.db.get(`module-help`) || 'normal'

            const fileEmojis = {
                Informations: '🔍',
                Buyers: '🔰',
                Modérations: '⚔',
                Contact: "✉",
                Utilitaires: '🛠',
                Permissions: "🎭",
                Musique: '🎶',
                Logs: '📁',
                Antiraid: '🛡',
                Owner: '🔑',
                Misc: '🎗',
            };

            const folderOrder = [
                'Antiraid',
                'Modérations',
                'Informations',
                'Utilitaires',
                'Musique',
                'Misc',
                'Contact',
                'Logs',
                'Permissions',
                'Owner',
                'Buyers'
            ];

            const categoryOrder = {
                'Antiraid': 1,
                'Modérations': 2,
                'Informations': 3,
                'Utilitaires': 4,
                'Musique': 5,
                'Misc': 6,
                'Contact': 7,
                'Logs': 8,
                'Permissions': 9,
                'Owner': 10,
                'Buyers': 11,

            };


            if (module === "hybride") {
                const totalpag = cmddanslefichier.length;
                let page = 0;

                if (args.length > 0 && !isNaN(args[0])) {
                    page = parseInt(args[0]) - 1;
                    if (page < 0) page = 0;
                    if (page >= totalpag) page = totalpag - 1;
                }


                cmddanslefichier.sort((a, b) => folderOrder.indexOf(a) - folderOrder.indexOf(b));

                const generetapage = (pageactuellement) => {
                    const fichiertasoeur = cmddanslefichier[pageactuellement];
                    const cmdFiles = fs.readdirSync(`./source/commands/${fichiertasoeur}`).filter(file => file.endsWith('.js'));
                    const categoryCommands = cmdFiles.map(file => {
                        const command = require(`../${fichiertasoeur}/${file}`);
                        let usages = null;
                        let descriptions = null
                        if (command.usage) {
                            switch (lang) {
                                case "fr":
                                    usages = command.usage.fr;
                                    break;
                                case "en":
                                    usages = command.usage.en;
                                    break;
                                default:
                                    usages = command.usage.fr;
                            }
                        }

                        switch (lang) {
                            case "fr":
                                descriptions = command.description.fr;
                                break;
                            case "en":
                                descriptions = command.description?.en;
                                break;
                            default:
                                descriptions = command.description.fr;
                        }

                        const usage = usages || {
                            [command.name]: descriptions || "Error"
                        };

                        let description = '';
                        for (const [key, value] of Object.entries(usage)) {
                            description += `\n\`${client.prefix}${key}\`\n${value}`;
                        }

                        return description;
                    });

                    const embed = new Discord.EmbedBuilder()
                        .setColor(client.color)
                        .setTitle((fileEmojis[fichiertasoeur] || '❌') + " " + fichiertasoeur)
                        .setFooter(client.footer)
                        .setDescription(`${aide}\n` + categoryCommands.join(''));
                    const row = new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.StringSelectMenuBuilder()
                                .setCustomId('selectMenu')
                                .setPlaceholder('Protect by 1prodige')
                                .addOptions(
                                    folderOrder.map(folder => ({
                                        label: folder,
                                        value: folder,
                                        emoji: fileEmojis[folder] || "❌",
                                    }))
                                ),
                        );

                    const rows = new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.ButtonBuilder()
                                .setCustomId('page')
                                .setDisabled(true)
                                .setStyle(2)
                                .setLabel(`${categoryOrder[fichiertasoeur]}/${Object.keys(categoryOrder).length}`),
                        )

                    return { embeds: [embed], components: [row, rows] };
                };

                const { embeds, components } = generetapage(page);
                const helpMessage = await message.channel.send({ embeds, components });

                const filter = i => i.customId === 'selectMenu';
                const collector = helpMessage.createMessageComponentCollector({ filter });

                collector.on('collect', async i => {
                    if (i.user.id !== message.author.id) {
                        return i.reply({
                            content: await client.lang('interaction'),
                            flags: 64
                        })
                    }
                    const selectedFile = i.values[0];
                    const page = cmddanslefichier.indexOf(selectedFile);
                    const { embeds, components } = generetapage(page);
                    await i.update({ embeds, components });
                });


            }

            if (module === 'normal') {
                const totalpag = cmddanslefichier.length;
                let page = 0;

                if (args.length > 0 && !isNaN(args[0])) {
                    page = parseInt(args[0]) - 1;
                    if (page < 0) page = 0;
                    if (page >= totalpag) page = totalpag - 1;
                }


                cmddanslefichier.sort((a, b) => folderOrder.indexOf(a) - folderOrder.indexOf(b));

                const generetapage = (pageactuellement) => {
                    const fichiertasoeur = cmddanslefichier[pageactuellement];
                    const cmdFiles = fs.readdirSync(`./source/commands/${fichiertasoeur}`).filter(file => file.endsWith('.js'));
                    const categoryCommands = cmdFiles.map(file => {
                        const command = require(`../${fichiertasoeur}/${file}`);
                        let usages = null;
                        let descriptions = null
                        if (command.usage) {
                            switch (lang) {
                                case "fr":
                                    usages = command.usage.fr;
                                    break;
                                case "en":
                                    usages = command.usage.en;
                                    break;
                                default:
                                    usages = command.usage.fr;
                            }
                        }

                        switch (lang) {
                            case "fr":
                                descriptions = command.description.fr;
                                break;
                            case "en":
                                descriptions = command.description?.en;
                                break;
                            default:
                                descriptions = command.description.fr;
                        }

                        const usage = usages || {
                            [command.name]: descriptions || "Error"
                        };

                        let description = '';
                        for (const [key, value] of Object.entries(usage)) {
                            description += `\n\`${client.prefix}${key}\`\n${value}`;
                        }

                        return description;
                    });

                    const embed = new Discord.EmbedBuilder()
                        .setColor(client.color)
                        .setTitle((fileEmojis[fichiertasoeur] || '❌') + " " + fichiertasoeur)
                        .setFooter(client.footer)
                        .setDescription(`${aide}\n` + categoryCommands.join(''));
                    const row = new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.StringSelectMenuBuilder()
                                .setCustomId('selectMenu')
                                .setPlaceholder('Protect by 1prodige')
                                .addOptions(
                                    folderOrder.map(folder => ({
                                        label: folder,
                                        value: folder,
                                        emoji: fileEmojis[folder] || "❌",
                                    }))
                                ),
                        );

                    const rows = new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.ButtonBuilder()
                                .setCustomId('page')
                                .setDisabled(true)
                                .setStyle(2)
                                .setLabel(`${categoryOrder[fichiertasoeur]}/${Object.keys(categoryOrder).length}`),
                        )

                    return { embeds: [embed], components: [row, rows] };
                };

                const { embeds, components } = generetapage(page);
                const helpMessage = await message.channel.send({ embeds, components });

                const filter = i => i.customId === 'selectMenu';
                const collector = helpMessage.createMessageComponentCollector({ filter });

                collector.on('collect', async i => {
                    if (i.user.id !== message.author.id) {
                        return i.reply({
                            content: await client.lang('interaction'),
                            flags: 64
                        })
                    }
                    const selectedFile = i.values[0];
                    const page = cmddanslefichier.indexOf(selectedFile);
                    const { embeds, components } = generetapage(page);
                    await i.update({ embeds, components });
                });


            }
        }
        else {
            const command = client.commands.get(args[0]) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0]));

            if (!command) {
                const embed = new Discord.EmbedBuilder()
                    .setColor(client.color)
                    .setDescription(await client.lang('help.command_not_found'))
                return message.channel.send({ embeds: [embed] });
            }

            const usage = command.usage || {
                [command.name]: command.description || "Error"
            };

            let description = '';
            for (const [key, value] of Object.entries(usage)) {
                description += `\n\`${client.prefix}${key}\`\n${value}`;
            }

            const embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setDescription(description)
                .setFooter(client.footer);

            message.channel.send({ embeds: [embed] });
        }
    }
};
