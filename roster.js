const Discord = require("discord.js");
const oldStateMap = new Map();
const prefix = "!";
module.exports = client => {

    client.on("message", message => {
        if (!message.guild || message.author.bot) return;
        let args = message.content.slice(prefix.length).split(" ");
        let cmd = args.shift();
        if (cmd === "roster") {
            if (!args[0]) return message.reply("Please add argument like, `channel`, `addrole`, `removerole`")
            //COMMAND FOR CREATE A ROSTER SETUP
            if (args[0].toLowerCase() === "channel") {
                let channel = message.mentions.channels.first();
                if (!channel) return message.reply(`Please add a Channel! Usage: \`${prefix}roster channel #Channel\``)
                client.roster.set(message.guild.id, channel.id, "rosterchannel")
                message.reply("SUCCESS!")
                send_roster(message.guild)
                return;
            //COMMAND FOR ADDROLE
            } else if (args[0].toLowerCase() === "addrole") {
                let role = message.mentions.roles.first();
                if (!role) return message.reply(`Please add a Role! Usage: \`${prefix}roster addrole @ROLE\``)
                if (client.roster.get(message.guild.id, "rosterroles").includes(role.id)) return message.reply(`Your Role is already setupped! Remove it with: \`${prefix}roster removerole @ROLE\``)
                client.roster.push(message.guild.id, role.id, "rosterroles")
                message.reply("SUCCESS!")
                edit_msg(message.guild)
                return;
            //COMMAND FOR REMOVEROLE
            } else if (args[0].toLowerCase() === "removerole") {
                let role = message.mentions.roles.first();
                if (!role) return message.reply(`Please add a Role! Usage: \`${prefix}roster removerole @ROLE\``)
                if (!client.roster.get(message.guild.id, "rosterroles").includes(role.id)) return message.reply(`Your Role is not setupped yet! Add it with: \`${prefix}roster addrole @ROLE\``)
                client.roster.remove(message.guild.id, role.id, "rosterroles")
                message.reply("SUCCESS!")
                edit_msg(message.guild)
                return;
            } else return message.reply("Please add a valid arguments like, `channel`, `addrole`, `removerole`")
        }
    })

    setInterval(async () => {
        //
        console.log(new Date().getHours() + ":" + new Date().getMinutes() + " | EDIT")
        client.guilds.cache.map(guild => edit_msg(guild));
        /*
        for(const guild of client.guilds.cache.array()){
            await new Promise((res)=>{
                setTimeout(()=>{
                    res(0);
                }, 5000)
            })
            edit_msg(guilds.id)
        }*/
        //
    }, 60 * 1000)

    async function edit_msg(guild) {
        client.roster.ensure(guild.id, {
            rosterchannel: "notvalid",
            rostermessage: "",
            rosterroles: [],
        })
        if (client.roster.get(guild.id, "rosterchannel") == "notvalid") return;
        let channel = await client.channels.fetch(client.roster.get(guild.id, "rosterchannel"));
        let message = await channel.messages.fetch(client.roster.get(guild.id, "rostermessage"));
        //define the embed
        let rosterembed = new Discord.MessageEmbed()
            .setColor("BLUE")
            .setFooter("Roster | powered by milrato.eu", guild.iconURL({
                dynamic: true
            }) ? guild.iconURL({
                dynamic: true
            }) : "https://en.wikipedia.org/wiki/File:1x1.png#/media/File:1x1.png")
            .setAuthor(guild.name, guild.iconURL({
                dynamic: true
            }) ? guild.iconURL({
                dynamic: true
            }) : "https://en.wikipedia.org/wiki/File:1x1.png#/media/File:1x1.png")
        //get rosterole and loop through every single role
        let rosterroles = client.roster.get(guild.id, "rosterroles");
        if (rosterroles.length === 0) rosterembed.addField("NO ROLES ADDED", `Add them with: \`${prefix}roster addrole @ROLE\``)
        for (let i = 0; i < rosterroles.length; i++) {
            let role = guild.roles.cache.get(rosterroles[i])
            //if the embed is too big break
            if (rosterembed.length > 5900) break;
            //get the maximum field value length on an variabel
            let leftnum = 1024;
            //if the length is bigger then the maximum length - the leftnumber
            if (rosterembed.length > 6000 - leftnum) {
                //set the left number to the maximumlength - the leftnumber
                leftnum = rosterembed.length - leftnum;
            }
            rosterembed.addField("**" + role.name.toUpperCase() + "**", role.members.length === 0 ? "> No one has this Role" : ">>> " + role.members.map(member => `<@${member.user.id}> | \`${member.user.tag}\``).join("\n").substr(0, leftnum))
        }
        message.edit(rosterembed);
    }
    async function send_roster(guild) {
        client.roster.ensure(guild.id, {
            rosterchannel: "notvalid",
            rostermessage: "",
            rosterroles: [],
        })
        if (client.roster.get(guild.id, "rosterchannel") == "notvalid") return;
        let channel = await client.channels.fetch(client.roster.get(guild.id, "rosterchannel"));
        //define the embed
        let rosterembed = new Discord.MessageEmbed()
            .setColor("BLUE")
            .setFooter("Roster | powered by milrato.eu", guild.iconURL({
                dynamic: true
            }) ? guild.iconURL({
                dynamic: true
            }) : "https://en.wikipedia.org/wiki/File:1x1.png#/media/File:1x1.png")
            .setAuthor(guild.name, guild.iconURL({
                dynamic: true
            }) ? guild.iconURL({
                dynamic: true
            }) : "https://en.wikipedia.org/wiki/File:1x1.png#/media/File:1x1.png")
        //get rosterole and loop through every single role
        let rosterroles = client.roster.get(guild.id, "rosterroles");
        if (rosterroles.length === 0) rosterembed.addField("NO ROLES ADDED", `Add them with: \`${prefix}roster addrole @ROLE\``)
        for (let i = 0; i < rosterroles.length; i++) {
            let role = guild.roles.cache.get(rosterroles[i])
            //if the embed is too big break
            if (rosterembed.length > 5900) break;
            //get the maximum field value length on an variabel
            let leftnum = 1024;
            //if the length is bigger then the maximum length - the leftnumber
            if (rosterembed.length > 6000 - leftnum) {
                //set the left number to the maximumlength - the leftnumber
                leftnum = rosterembed.length - leftnum;
            }
            rosterembed.addField("**" + role.name.toUpperCase() + "**", role.members.length === 0 ? "> No one has this Role" : ">>> " + role.members.map(member => `<@${member.user.id}> | \`${member.user.tag}\``).join("\n").substr(0, leftnum))
        }
        channel.send(rosterembed).then(msg => {
            client.roster.set(guild.id, msg.id, "rostermessage");
        }).catch(e => console.log("Couldn't send a message, give the Bot permissions or smt!"))
    }

    client.on("guildMemberUpdate", function (oldMember, newMember) {
        try {
            const oldRoles = oldMember.roles.cache.keyArray().filter(x => !options.excludedroles.includes(x)).filter(x => !newMember.roles.cache.keyArray().includes(x))
            const newRoles = newMember.roles.cache.keyArray().filter(x => !options.excludedroles.includes(x)).filter(x => !oldMember.roles.cache.keyArray().includes(x))
            const rolechanged = (newRoles.length || oldRoles.length)

            if (rolechanged) {
                //array for added roles
                let roleadded = [];
                if (newRoles.length > 0)
                    for (let i = 0; i < newRoles.length; i++) roleadded.push(newRoles[i])
                //array for removed roles
                let roleremoved = [];
                if (oldRoles.length > 0)
                    for (let i = 0; i < oldRoles.length; i++) roleremoved.push(oldRoles[i])
                //if role got ADDED and its one role of the db then update the embed with antispam
                if (roleadded.length > 0) {
                    let rosterroles = client.roster.get(newMember.guild.id, "rosterroles");
                    if (rosterroles.length === 0) return;
                    for (let i = 0; i < rosterroles.length; i++) {
                        let role = newMember.guild.roles.cache.get(rosterroles[i])
                        if (roleadded.includes(role.id)) {
                            if (oldStateMap.get("SOMETHING")) console.log("DONT EDIT THE EMBED, DUE TO ANTI SAPM!");
                            else {
                                oldStateMap.set("SOMETHING", true);
                                edit_msg(newMember.guild);
                                setTimeout(() => {
                                    oldStateMap.set("SOMETHING", false);
                                }, 5000)
                            }
                        }
                    }
                }
                //if role got removed and its one role of the db then update the embed with antispam
                else if (roleremoved.length > 0) {
                    let rosterroles = client.roster.get(newMember.guild.id, "rosterroles");
                    if (rosterroles.length === 0) return;
                    for (let i = 0; i < rosterroles.length; i++) {
                        let role = newMember.guild.roles.cache.get(rosterroles[i])
                        if (roleremoved.includes(role.id)) {
                            if (oldStateMap.get("SOMETHING2")) console.log("DONT EDIT THE EMBED, DUE TO ANTI SAPM!");
                            else {
                                oldStateMap.set("SOMETHING2", true);
                                edit_msg(newMember.guild);
                                setTimeout(() => {
                                    oldStateMap.set("SOMETHING2", false);
                                }, 5000)
                            }
                        }
                    }
                }
            }
        } catch (e) {
            console.log(e)
        }
    });
}