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
import { TelegrafContext } from "telegraf/typings/context";

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

  constructor(bot: Telegraf<TelegrafContext>) {
    this.bot = new TelegrafAdapter(bot);
  }

  configByLogic(logic: ITelegrafBotLogic): void {
    if (logic.stage) this.setStage(logic.stage);
    if (logic.scenes) this.addScenes(...logic.scenes);
    if (logic.baseFunc) {
      if (logic.baseFunc.middleware) this.addMiddleware(...logic.baseFunc.middleware);
      if (logic.baseFunc.commands) this.addCommands(...logic.baseFunc.commands);
      if (logic.baseFunc.events) this.addEvents(...logic.baseFunc.events);
      if (logic.baseFunc.triggers) this.addTriggers(...logic.baseFunc.triggers);
    }
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
    if (!this.botStage) {
      this.botStage = new TelegrafStage(...scenes);
      this.addMiddleware(session(), this.botStage.middleware() as Middleware<TelegrafContext>);
    } else this.botStage.register(...scenes);
  }
  setStage(stage: TelegrafStage): void {
    this.botStage = stage;
    this.addMiddleware(session(), this.botStage.middleware() as Middleware<TelegrafContext>);
  }
  getStage(): TelegrafStage {
    return this.botStage;
  }
  getBot(): TelegrafAdapter {
    return this.bot;
  }
}
