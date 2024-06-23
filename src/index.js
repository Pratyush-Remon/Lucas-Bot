require('dotenv').config();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const botToken = process.env.BOT_TOKEN;


const { createClient } = require('@supabase/supabase-js');
const supaClient = createClient(supabaseUrl,supabaseKey)
const { Client, IntentsBitField, userMention } = require('discord.js');
const fs = require('fs');
const { register } = require('module');

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
    testSupabaseConnection();
});

client.on("messageCreate", msg => {
  if(msg.channel.id === "1254223958702690375" && msg.content === "lregister"){
    userID=msg.author.id;
    msg.reply(userMention(userID)+"You are registered");
  }
  if(msg.channel.id === "1254223958702690375" && msg.content === "lhelp"){

    fs.readFile("src/Commands.txt","utf8",(err,commadls)=>{

      if (err) {
        console.error("Error reading the command list:", err);
        return;
      }
      msg.reply(commadls);

    });

  }
});

async function testSupabaseConnection() {
  try {
    const { data, error } = await supaClient
      .from('loonies') // Replace 'your_table_name' with your actual table name
      .select('*')
      .limit(1);

    if (error) {
      console.error('Supabase connection error:', error);
    } else {
      console.log('Supabase connection successful. Data:', data);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}


client.login(botToken).catch(console.error);