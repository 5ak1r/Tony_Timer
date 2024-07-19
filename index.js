const { Client, IntentsBitField } = require("discord.js");
require("dotenv").config();
const keepAlive = require("./server");

const Database = require("@replit/database");
const db = new Database();

db.empty()

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

function read(key) {
    return db.get(key).then(value => {
        return value.value;
    })
}

async function write(key, value, msg) {
    try {
        const current_value = await db.get(key);

        if (current_value.value === null || current_value.value === undefined) {
            if (key === "busy") {
                await db.set(key, 1);
            } else if (key === msg.channel.id) {
                await db.set(key, [value]);
            }
        } else {
            if (key === "busy") {
                await db.set(key, current_value.value + 1);
            } else if (key === msg.channel.id) {
                current_value.value.push(value);
                await db.set(key, current_value.value);
            }
        }
    } catch (error) {
        console.error(`Error writing to database: ${error}`);
    }
}

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
        write(msg.channel.id, elapsedTime, msg);
    }

    if (msg.content === "!busy") {
        start = false;
        msg.channel.send(`Tony is not getting on today :(`);
        write("busy", 1, msg);
    }

    if (msg.content === "!average") {
        read(msg.channel.id).then(arr => {
            const sum = arr.reduce((x, y) => x + y, 0)
            const average = sum / arr.length

            msg.channel.send(`It has taken Tony an average of ${average} seconds to get the flip on.`)
        })
    }
    
    if (msg.content === "!isitcominghome") {
        msg.channel.send(`¡Para nada!`);
    }
});

client.on("error", console.error);
keepAlive();
client.login(process.env.TOKEN);
