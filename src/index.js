const { Client, IntentsBitField } = require('discord.js');
const fs = require('fs');

// Create a new client instance with necessary intents
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildMembers,
    ]
});

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", msg => {
    if (msg.content === "ping") {
        msg.reply("pong");
    }
});

// Read the token from the file and log in the bot
fs.readFile("src/TOKEN.txt", 'utf8', (err, token) => {
    if (err) {
        console.error("Error reading the token file:", err);
        return;
    }
    client.login(token.trim()).catch(console.error);
});
