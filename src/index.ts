import Telegraf, { Stage, session, BaseScene, Middleware } from "telegraf";
import { getConfig } from "./config";
import { TelegrafAdapter, setCommands, TelegrafScene, TelegrafStage } from "./script";
import telegrafCommands from "./config/telegrafCommands";
import { TelegrafContext } from "telegraf/typings/context";

const config = getConfig("config");
const telegraf = new Telegraf(config.bot.botToken);
const bot = new TelegrafAdapter(telegraf);

bot.use(Telegraf.log());

setCommands(telegrafCommands, (ctx) => {
  bot.command(ctx);
});

bot.launch().then(() => console.log("Bot started"));
