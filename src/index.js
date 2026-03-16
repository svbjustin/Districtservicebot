import "dotenv/config";
import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import config from "./config/config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));

for (const file of commandFiles) {
  const cmd = await import(path.join(commandsPath, file));
  client.commands.set(cmd.default.data.name, cmd.default);
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith(".js"));

for (const file of eventFiles) {
  const evt = await import(path.join(eventsPath, file));
  if (evt.default.once) {
    client.once(evt.default.name, (...args) => evt.default.execute(...args, client, config));
  } else {
    client.on(evt.default.name, (...args) => evt.default.execute(...args, client, config));
  }
}

client.login(process.env.DISCORD_TOKEN);