import 'dotenv/config';
import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js';
import { createObsidianApp } from '@obsidian-ui/core';
import { createDiscordAdapter } from '@obsidian-ui/discord-adapter';
import { obsidianTheme } from '@obsidian-ui/themes';
import { setupScreen } from './screens/setup.js';

const token = process.env.DISCORD_TOKEN!;
const clientId = process.env.DISCORD_CLIENT_ID!;
const guildId = process.env.DISCORD_GUILD_ID!;

const app = createObsidianApp({
  theme: obsidianTheme,
  screens: [setupScreen],
});

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const adapter = createDiscordAdapter({ client, app });

async function registerCommands() {
  const rest = new REST().setToken(token);
  const commands = [
    new SlashCommandBuilder()
      .setName('setup')
      .setDescription('Run the server setup wizard'),
  ];

  await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
    body: commands.map(c => c.toJSON()),
  });
}

client.once('ready', () => {
  console.log(`[setup-wizard-bot] Online as ${client.user?.tag}`);
});

async function main() {
  await registerCommands();
  await adapter.start(token);
}

main().catch(console.error);
