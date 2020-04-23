const Discord = require("discord.js");
const axios = require("axios");
const fs = require("fs");
const express = require("express");

const client = new Discord.Client();
const app = express();

let API_KEY = "wqme8bd5crqnznn948slnekdh63ke0";
let api = axios.create({
  headers: {
    "Client-ID": API_KEY,
    Accept: "application/vnd.twitchtv.v5+json",
  },
});
const PORT = process.env.PORT || 101;

client.login("NjYyMjkzMDEwNDI3Njc0NjU4.Xg4Log.YbekiaqoE6QhKee-EVvzEDW-Fe4");

//app.get("/", (req, res) => res.send("Twitch alert bot is now live!"));
app.listen(PORT, () => {
  console.log("Server is ready");
  client.on("ready", () => {
    let notifyStatus = [];
    console.log(`Logged in as ${client.user.tag}!`);
    function twtichApiCall() {
      fs.readFile("userid.txt", "utf-8", function (err, data) {
        let strArr = data.split("\n");
        const checkStreamStatus = async () => {
          console.log("CHECK");
          strArr.forEach(async (id) => {
            const res = await api.get(
              "https://api.twitch.tv/kraken/streams/" + id
            );
            if (res.data["stream"] != null && notifyStatus.indexOf(id) === -1) {
              const channel = client.channels.find("name", "bot-coms-test");
              await channel.send(
                "@everyone " +
                  res.data["stream"]["channel"]["name"] +
                  " is now live at https://twitch.tv/" +
                  res.data["stream"]["channel"]["name"]
              );
              console.log(notifyStatus);
              notifyStatus.push(id);
            } else if (
              res.data["stream"] === null &&
              notifyStatus.indexOf(id) > -1
            ) {
              notifyStatus.splice(notifyStatus.indexOf(id), 1);
              const channel = client.channels.find("name", "generaltest");
              channel.send(
                "@everyone " +
                  res.data["stream"]["channel"]["name"] +
                  " stopped streaming"
              );
            }
          });
          setTimeout(() => {
            checkStreamStatus();
          }, 25000);
        };
        checkStreamStatus();
      });
    }
    twtichApiCall();
  });

  //INTENDEND TO PUSH USERS TO RESPECTIVE GAME=VC
  client.on("message", (msg) => {
    if (msg.content === "#ocd") {
      console.log("OCD");
    }
  });

  //ANNOYS THE MENTIONED NICKNAME WITH MENTION IN THE CHAT
  client.on("message", (msg) => {
    if (msg.content.includes("#annoy")) {
      annoyUserName = msg.content.slice(7);
      client.on("voiceStateUpdate", (oldmember, newmember) => {
        let list, listOld, userID;
        let oldUserChannel = oldmember.voiceChannel;
        let newUserChannel = newmember.voiceChannel;
        console.log(oldUserChannel);
        console.log(newUserChannel);

        if (newUserChannel != null) {
          list = newUserChannel.members.map((c) => c.user["username"]);
          console.log(list);

          userID = newUserChannel.members.map((c) => c.user["id"]);
          userIDInd = list.indexOf(annoyUserName);

          if (list.indexOf(annoyUserName) > -1) {
            //setInterval(() => {
            client.channels
              .get("632266636140871701")
              .send("<@" + userID[userIDInd] + "> GTFO");
            //}, 3000);
            msg.send("<@" + userID[userIDInd] + "> GTFO");
          }
        } else {
          listOld = oldUserChannel.members.map((c) => c.user["username"]);
          if (listOld.indexOf(annoyUserName) < 0) {
            client.channels
              .get("632266636140871701")
              .send("<@" + userID[userIDInd] + "> Bye have a great time");
          }
        }
      });
    }
  });

  client.on("message", (msg) => {
    if (msg.content.includes("#addme")) {
      tUserName = msg.content.slice(7);
      let url = "https://api.twitch.tv/kraken/users?login=" + tUserName;
      if (tUserName) {
        const fetchData = async () => {
          const result = await api.get(url);
          count = Object.keys(result.data.users).length;
          if (count === 1) {
            userID = result.data.users[0]["_id"];
            fs.appendFile("userid.txt", "\n" + userID, function (err) {
              if (err) throw err;
            });
            fs.appendFile("data.txt", "\n" + tUserName, function (err) {
              if (err) throw err;
              msg.reply(
                "Lets go, your channel members will be notified when " +
                  tUserName +
                  " goes live on twitch"
              );
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
      fs.readFile("data.txt", "utf-8", function (err, data) {
        msg.reply("\nList of subscribed streamers:\n" + data);
      });
    } else if (msg.content.includes("#remove")) {
      removetUserName = msg.content.slice(8);
      msg.reply(
        "Admin will soon remove " +
          removetUserName +
          " from the subscription list. GG"
      );
    }
  });
});
