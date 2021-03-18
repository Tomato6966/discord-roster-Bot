const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", () => console.log("BOT IS READY"))

client.login("YOUR TOKEN GOES HERE")

require("./roster")(client)

const Enmap = require("enmap");
client.roster = new Enmap({name: "roster"})