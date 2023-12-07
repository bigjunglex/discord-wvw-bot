const Discord = require("discord.js")
const fetch = require("node-fetch")
const token = require("./config.json")["token"]
const client = new Discord.Client(intents = Discord.Intents.default)

function formatServer(server) {
    return `${server.id} ${server.name} /// ${server.population}`
}

function getServers() {
    return fetch("https://api.guildwars2.com/v2/worlds?ids=all")
      .then(result => {
        return result.json()
      })
      .then(result =>{
        return result.filter((server) => server.id > 2000)
      })
      .then(server =>{
        return server.map(formatServer).join('\n')
      })
}

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on("message", msg => {
    if (msg.content == "!servers"){
        getServers().then(servers => msg.channel.send(`\`\`\` \n${servers}\n\`\`\``))
    }
})

client.login(token)