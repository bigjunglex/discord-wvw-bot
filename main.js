const Discord = require("discord.js")
const fetch = require("node-fetch")
const token = require("./config.json")["token"]
const client = new Discord.Client(intents = Discord.Intents.default)
const apiMatch = "https://api.guildwars2.com/v2/wvw/matches/2-";

function formatServer(server) {
    return `${server.id} ${server.name} /// ${server.population}`
}

function getServersString() {
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
function getServers() {
  return fetch("https://api.guildwars2.com/v2/worlds?ids=all")
  .then(result => {
    return result.json()
  })
  .then(result =>{
    return result.filter((server) => server.id > 2000)
  })
}


// todo: fix the double function problem, move it to other file, reorginize code

async function getMatches(api){
  let matches = [];
  for (i = 1; i < 6; i++){
      const url = `${api}${i}`;
      const res = await fetch(url);
      const data = await res.json();
      matches.push(data.all_worlds);
  }
  // console.log(matches)
  const res = await Promise.all(matches.map(replaceIdsWithNames))
  // console.log(res) #chitabel'nie format
  return res.map(formatMatches).join('\n\n')
}

async function replaceIdsWithNames(match) {
  const serversInfo = await getServers()
  const updatedMatch = {};
  for (const teamColor in match) {
      if (match.hasOwnProperty(teamColor)) {
          const team = match[teamColor];
          updatedMatch[teamColor] = team.map(async serverId => {
              const serverInfo = serversInfo.find(server => server.id === serverId);
              return serverInfo ? serverInfo.name : serverId;
          });
          updatedMatch[teamColor] = await Promise.all(updatedMatch[teamColor]);
      }
  }

 return updatedMatch;
}

function formatMatches(match){
  return `\n${match.red.join('+')}\n${match.blue.join('+')}\n${match.green.join('+')}`
}



client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on("message", msg => {
    if (msg.content == "!servers"){
        getServersString().then(servers => msg.channel.send(`\`\`\` \n${servers}\n\`\`\``))
    }
})

client.on("message", msg => {
    if (msg.content == "!matches"){
      getMatches(apiMatch).then(matches => msg.channel.send(`\`\`\` \n${matches}\n\`\`\``))
    }
})

client.login(token)