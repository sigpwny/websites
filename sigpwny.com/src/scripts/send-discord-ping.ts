import { Client, GatewayIntentBits, TextChannel } from 'discord.js';

async function sendDiscordPing() {
  // Retrieve environment variables
  const b64Message = process.env.DISCORD_B64_MESSAGE;
  const channelId = process.env.DISCORD_CONTENT_CHANNEL_ID;
  const serverId = process.env.DISCORD_SERVER_ID;
  const token = process.env.DISCORD_TOKEN;

  // Check if all required environment variables are present
  if (!b64Message || !channelId || !serverId || !token) {
    console.error('Missing required environment variables');
    process.exit(1);
  }

  // Decode the base64 message
  const message = Buffer.from(b64Message, 'base64').toString('utf-8');

  // Create a new Discord client
  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
  });

  try {
    // Log in to Discord
    await client.login(token);

    // Fetch the server and channel
    const server = await client.guilds.fetch(serverId);
    const channel = await server.channels.fetch(channelId) as TextChannel;

    if (!channel || !channel.isTextBased()) {
      throw new Error('Invalid channel');
    }

    // Send the message
    await channel.send(message);
    console.log('Message sent successfully');
  } catch (error) {
    console.error('Error sending message:', error);
  } finally {
    // Destroy the client connection
    client.destroy();
  }
}

sendDiscordPing();