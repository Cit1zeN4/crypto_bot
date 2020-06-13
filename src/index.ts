import Telegraf from "telegraf";
import { getConfig } from "./config";
import { TelegrafAdapter, TelegrafCommand } from "./script";

const config = getConfig("config");
const telegraf = new Telegraf(config.bot.botToken);

const bot = new TelegrafAdapter(telegraf);
bot.addCommand(
  new TelegrafCommand("hi", (ctx) => {
    ctx.reply("oh man");
  })
);

bot.addCommand(
  new TelegrafCommand("start", (ctx) => {
    ctx.reply("oh man hi");
  })
);
bot.launch().then(() => console.log("Bot started"));
