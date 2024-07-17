const Discord = require("discord.js")
const client = new Discord.Client()


client.on("message", msg => {
    if(msg.author.bot) return

    if(msg.content === "!brb") {
        msg.channel.send("Let's see how long it takes this time :)")
        done = false
        while(!done) {
            timer += 1
        }
    }
})


client.login(process.env.TOKEN)