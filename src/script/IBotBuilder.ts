import { Telegraf, Context, Middleware, Stage, session } from "telegraf";
import {
  IBotCommand,
  TelegrafAdapter,
  ITelegrafCommand,
  ITelegrafEvent,
  ITelegrafTrigger,
  TelegrafScene,
  TelegrafStage,
  IBotEvent,
  IBotTrigger,
  IBotScene,
  IBot,
  IBotStage,
  IBotLogic,
  ITelegrafBotLogic,
  addArray,
} from ".";

export interface IBotBuilder {
  configByLogic(logic: IBotLogic): void;
  addCommands(...commands: IBotCommand[]): void;
  addEvents(...events: IBotEvent[]): void;
  addTriggers(...triggers: IBotTrigger[]): void;
  addMiddleware(...middleware: Function[] | Object[]): void;
  addScenes(...scenes: IBotScene[]): void;
  setStage(stage: IBotStage): void;
  getStage(): IBotStage;
  getBot(): IBot;
}

export class TelegrafBotBuilder implements IBotBuilder {
  private bot: TelegrafAdapter;
  private botStage!: TelegrafStage;

  constructor(bot: Telegraf<Context>) {
    this.bot = new TelegrafAdapter(bot);
  }

  configByLogic(logic: ITelegrafBotLogic): void {
    throw new Error("Method not implemented.");
  }
  addCommands(...commands: ITelegrafCommand[]): void {
    addArray(commands, (item) => {
      this.bot.command(item);
    });
  }
  addEvents(...events: ITelegrafEvent[]): void {
    addArray(events, (item) => {
      this.bot.on(item);
    });
  }
  addTriggers(...triggers: ITelegrafTrigger[]): void {
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
  setStage(stage: TelegrafStage): void {
    this.botStage = stage;
  }
  getStage(): TelegrafStage {
    return this.botStage;
  }
  getBot(): TelegrafAdapter {
    if (this.botStage)
      this.addMiddleware(session(), this.botStage.middleware() as Middleware<Context>);
    return this.bot;
  }
}
