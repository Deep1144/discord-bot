/* eslint-disable @typescript-eslint/no-explicit-any */
require('dotenv').config();
import axios from 'axios';
import Discord from 'discord.js';
const client: any = new Discord.Client();

const randomAPIURL = 'https://random-data-api.com/api/cannabis/random_cannabis';
const headers = { Accept: 'application/json' };

async function getRandomDadJoke(): Promise<unknown> {
  const response = await axios.get(randomAPIURL, { headers: headers });
  return response.data;
}

client.on('ready', () => {
  console.log(`logged in as ${client.user?.tag}`);
});

client.on('guildMemberAdd', (member: Discord.GuildMember) => {
  // Choose a channel to send the welcome message
  const channel: any = member.guild.channels.cache.find(
    e => e.name === 'general',
  );

  //If the channel is not in the server, exit
  if (!channel) return;

  channel.send(
    `Welcome, ${member}! I'm at your service if you want to hear dad jokes`,
  );
});

client.on('message', async (message: Discord.Message) => {
  //"Ignore the message if the bot authored it"
  if (message.author.bot) return;

  const text = message.content.toLowerCase();

  //If the doesn't specifically mention, bot return
  if (text.includes('@here') || text.includes('@everyone')) return;

  try {
    //Return if the message doesn't mention the bot
    if (!message.mentions.has(client?.user?.id)) return;

    //Reply with a random joke
    const result = await getRandomDadJoke();
    console.log('result', result);
    message.reply(JSON.stringify(result));
  } catch (error) {
    console.log('error', error);
    message.reply('Sorry, an error occured');
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
