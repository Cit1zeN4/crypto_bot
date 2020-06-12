import Telegraf from "telegraf";
import { getConfig } from "./config";

const config = getConfig("config");
const bot = new Telegraf(config.bot.bot_token);
bot.start((ctx) => ctx.reply("Hi"));
bot.launch();
