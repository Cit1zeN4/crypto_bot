import Telegraf from "telegraf";
import { getConfig } from "./config";
import { TelegrafAdapter, TelegrafCommand } from "./script"

const config = getConfig("config");
const telegraf = new Telegraf(config.bot.bot_token);
telegraf.start((ctx) => { ctx.reply("Hi man") })

const bot = new TelegrafAdapter(telegraf)
bot.addCommand(new TelegrafCommand('hi', (ctx) => { ctx.reply('oh man') }))
bot.launch().then(() => console.log("Bot started"))
