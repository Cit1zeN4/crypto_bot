import Telegraf from "telegraf";
import { getConfig } from "./config";
import { TelegrafAdapter, TelegrafCommand } from "./script";
import commands from "./config/telegrafCommands";

const config = getConfig("config");
const telegraf = new Telegraf(config.bot.botToken);

const bot = new TelegrafAdapter(telegraf);
bot.addCommand(commands);
bot.launch().then(() => console.log("Bot started"));
