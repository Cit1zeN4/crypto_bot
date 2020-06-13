import Telegraf from "telegraf";
import { ICommand, addArray } from ".";
import { TelegrafContext } from "telegraf/typings/context";

export interface IBot {
  addCommand(command: ICommand | Array<ICommand>): void;
  launch(): void;
}

export class TelegrafAdapter implements IBot {
  telegraf: Telegraf<TelegrafContext>;

  constructor(telegraf: Telegraf<TelegrafContext>) {
    this.telegraf = telegraf;
  }

  addCommand(command: ICommand | Array<ICommand>): void {
    addArray(command, (ctx: ICommand) => {
      this.telegraf.command(ctx.name, ctx.action);
    });
  }

  async launch(): Promise<void> {
    this.telegraf.launch();
  }
}
