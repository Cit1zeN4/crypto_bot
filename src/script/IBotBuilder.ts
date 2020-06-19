import { TCommand } from ".";
import { TEvent, TTrigger } from "./IBot-types";
import { IBotScene, IBot } from "./IBot";
import {
  TelegrafAdapter,
  TTelegrafCommand,
  TTelegrafEvent,
  TTelegrafTrigger,
  TelegrafScene,
  TelegrafStage,
} from "./TelegrafAdapter";
import Telegraf, { Context, Middleware, Stage, session } from "telegraf";
import { addArray } from "./addArray";

export interface IBotBuilder {
  addCommands(...commands: TCommand[]): void;
  addEvents(...events: TEvent[]): void;
  addListener(...triggers: TTrigger[]): void;
  addMiddleware(...middleware: Function[] | Object[]): void;
  addScenes(...scenes: IBotScene[]): void;
  getBot(): IBot;
}

export class TelegrafBotBuilder implements IBotBuilder {
  private bot: TelegrafAdapter;
  private botStage!: TelegrafStage;

  constructor(bot: Telegraf<Context>) {
    this.bot = new TelegrafAdapter(bot);
  }

  addCommands(...commands: TTelegrafCommand[]): void {
    addArray(commands, (item) => {
      this.bot.command(item);
    });
  }
  addEvents(...events: TTelegrafEvent[]): void {
    addArray(events, (item) => {
      this.bot.on(item);
    });
  }
  addListener(...triggers: TTelegrafTrigger[]): void {
    addArray(triggers, (item) => {
      this.bot.hears(item);
    });
  }
  addMiddleware(...middleware: Middleware<Context>[]): void {
    addArray(middleware, (item) => {
      this.bot.use(item);
    });
  }
  addScenes(...scenes: TelegrafScene[]): void {
    if (!this.botStage) this.botStage = new TelegrafStage(...scenes);
    else this.botStage.register(...scenes);
  }
  getBot(): TelegrafAdapter {
    if (this.botStage)
      this.addMiddleware(session(), this.botStage.middleware() as Middleware<Context>);
    return this.bot;
  }
}
