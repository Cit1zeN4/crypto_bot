import Telegraf from "telegraf";
import { getConfig } from "./config";
import { TelegrafAdapter, setCommands } from "./script";
import telegrafCommands from "./config/telegrafCommands";

const config = getConfig("config");
const telegraf = new Telegraf(config.bot.botToken);
const bot = new TelegrafAdapter(telegraf);
setCommands(telegrafCommands, (ctx) => {
  bot.command(ctx);
});
bot.launch().then(() => console.log("Bot started"));
