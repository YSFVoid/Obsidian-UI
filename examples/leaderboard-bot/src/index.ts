import 'dotenv/config';
import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js';
import { createObsidianApp } from '@obsidian-ui/core';
import { createDiscordAdapter } from '@obsidian-ui/discord-adapter';
import { LegacyRenderer } from '@obsidian-ui/renderer-legacy';
import { obsidianTheme } from '@obsidian-ui/themes';
import { leaderboardScreen } from './screens/leaderboard.js';

const token = process.env.DISCORD_TOKEN!;
const clientId = process.env.DISCORD_CLIENT_ID!;
const guildId = process.env.DISCORD_GUILD_ID!;

const app = createObsidianApp({
  theme: obsidianTheme,
  renderer: new LegacyRenderer(),
  screens: [leaderboardScreen],
});

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const adapter = createDiscordAdapter({ client, app });

async function registerCommands() {
  const rest = new REST().setToken(token);
  const commands = [
    new SlashCommandBuilder()
      .setName('leaderboard')
      .setDescription('View the server leaderboard'),
  ];

  await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
    body: commands.map(c => c.toJSON()),
  });
}

client.once('ready', () => {
  console.log(`[leaderboard-bot] Online as ${client.user?.tag}`);
});

async function main() {
  await registerCommands();
  await adapter.start(token);
}

main().catch(console.error);
