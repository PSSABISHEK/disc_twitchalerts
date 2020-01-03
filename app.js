const Discord = require("discord.js");
const axios = require("axios");
const fs = require("fs");

const client = new Discord.Client();

let API_KEY = "wqme8bd5crqnznn948slnekdh63ke0";
let api = axios.create({
  headers: {
    "Client-ID": API_KEY,
    Accept: "application/vnd.twitchtv.v5+json"
  }
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  /* const list = client.guilds.get("253466422301294593");
  let gameName;
  list.members.forEach(member => {
    if (
      member.presence.status === "online" ||
      member.presence.status === "idle"
    ) {
      gameName = member.presence.game;
      if (gameName != null) {
        if (gameName.name === "Twitch") {
          const channel = client.channels.find("name", "bot-coms");
          channel.send(
            "@everyone " +
              member.user.username +
              " is now live at " +
              gameName.url
          );
        }
      }
    }
  }); */
});

client.on("message", msg => {
  /* if (msg.content.includes("#addMe")) {
    tUserName = msg.content.slice(7);
    let url = "https://api.twitch.tv/kraken/users?login=" + tUserName;
    const fetchData = async () => {
      const result = await api.get(url);
      count = Object.keys(result.data.users).length;
      if (count === 1) {
        userID = result.data.users[0]["_id"];
        const res = await api.get(
          "https://api.twitch.tv/kraken/streams/" + userID
        );
        if (res.data["stream"] != null) {
          const channel = client.channels.find("name", "generaltest");
          channel.send(
            "@everyone " +
              tUserName +
              " is now live at https://twitch.tv/" +
              tUserName
          );
        } else {
          msg.reply("Stream is currently offline");
        }
      } else {
        msg.reply("Twitch username does not exist");
      }
    };
    fetchData();
  }  */
  if (msg.content.includes("#addme")) {
    tUserName = msg.content.slice(7);
    let url = "https://api.twitch.tv/kraken/users?login=" + tUserName;
    if (tUserName) {
      const fetchData = async () => {
        const result = await api.get(url);
        count = Object.keys(result.data.users).length;
        if (count === 1) {
          fs.readFile("data.json", "utf-8", function(err, data) {
            if (err) throw err;
            let json = JSON.parse(data);
            let json2 = json.users.push(tUserName);
            console.log(json2);
            
            
            fs.appendFile("data.json", json.users.push(tUserName), function(err) {
              if (err) throw err;
              msg.reply(
                "Lets go, your channel members will be notified when you go live on twitch"
              );
            });
          });
        } else {
          msg.reply("Twitch username does not exist");
        }
      };
      fetchData();
    } else {
      msg.reply("Please give Twitch Username");
    }
  } else if (msg.content === "#list") {
    fs.readFile("data.txt", "utf-8", function(err, data) {
      msg.reply("\nList of subscribed streamers\n" + data);
    });
  }
});

client.login("NjYyMjkzMDEwNDI3Njc0NjU4.Xg4Log.YbekiaqoE6QhKee-EVvzEDW-Fe4");
