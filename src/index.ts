import Telegraf, { Stage, session, Middleware } from "telegraf";
import { getConfig } from "./config";
import { TelegrafBotBuilder, TelegrafScene, TelegrafStage, TelegrafAdapter } from "./script";

import logic from "./config/telegrafLogic";
import { TelegrafContext } from "telegraf/typings/context";

const config = getConfig("config");
const telegraf = new Telegraf(config.bot.botToken);
const botBuilder = new TelegrafBotBuilder(telegraf);

botBuilder.addMiddleware(Telegraf.log());
botBuilder.configByLogic(logic);

const bot = botBuilder.getBot();
bot.launch().then(() => console.log("Bot started"));
