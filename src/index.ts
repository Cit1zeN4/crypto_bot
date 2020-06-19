import Telegraf from "telegraf";
import { getConfig } from "./config";
import { TelegrafBotBuilder } from "./script";

import commands from "./config/telegrafCommands";

const config = getConfig("config");
const telegraf = new Telegraf(config.bot.botToken);
const botBuilder = new TelegrafBotBuilder(telegraf);

botBuilder.addMiddleware(Telegraf.log());
botBuilder.addCommands(...commands);

const bot = botBuilder.getBot();
bot.launch().then(() => console.log("Bot started"));
