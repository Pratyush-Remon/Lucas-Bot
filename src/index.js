// Import necessary modules
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { Client, IntentsBitField, Message, userMention } from 'discord.js';
import { promises as fs } from 'fs'; // Using promises API for modern async handling
import { Console } from 'console';

// Load environment variables from .env file
config({ path: './src/.env' });

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const botToken = process.env.BOT_TOKEN;
const supaClient = createClient(supabaseUrl, supabaseKey);

// Create a new client instance with necessary intents
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildMembers,
    ]
});

// Function to test Supabase connection
async function testSupabaseConnection() {
    try {
        const { data, error } = await supaClient
            .from('loonies') // Replace 'loonies' with your actual table name
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

// Event handler for when the bot is ready
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    testSupabaseConnection();
});

// Event handler for message creation
client.on('messageCreate', async msg => {
    if (msg.channel.id === '1254223958702690375' && msg.content === 'lregister') {
        const userID = msg.author.id;
        createUser(userID,msg);
      }

    if (msg.channel.id === '1254223958702690375' && msg.content === 'lhelp') {
        try {
            const commandList = await fs.readFile('src/Commands.txt', 'utf8');
            msg.reply(commandList);
        } catch (err) {
            console.error('Error reading the command list:', err);
        }
    }
});

//Function to create user

async function createUser(uid,msg){
  var ID = uid.toString();
  const { data, error } = await supaClient
    .from('Users')
    .insert([{ userID: ID }]);
    if(error && error.code==='23505'){
      msg.reply("User already registered");
    }
    else {
    msg.reply('User registered successfully'+userMention(uid));
  }
}

// Login to Discord
client.login(botToken).catch(console.error);
