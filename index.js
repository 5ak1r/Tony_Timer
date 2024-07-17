const { Client, IntentsBitField } = require("discord.js");
require("dotenv").config();
const keepAlive = require("./server");

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    start = false;
});

client.on("messageCreate", (msg) => {
    if (msg.content === "!hoppingon" && !start) {
        msg.channel.send("Let's see how long it takes Tony this time...");
        startTime = new Date();
        start = true;
    }

    if (msg.content === "!on" && start) {
        endTime = new Date();
        start = false;

        const elapsedTime = (endTime.getTime() - startTime.getTime()) / 1000;
        msg.channel.send(
            `This time it took Tony ${elapsedTime} seconds to get the flip on.`,
        );
    }

    if (msg.content === "!busy") {
        start = false;
        msg.channel.send(`Tony is not getting on today :(`);
    }
});

client.on("error", console.error);
keepAlive()
client.login(process.env.TOKEN);
