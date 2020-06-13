import Telegraf from "telegraf";
import { ICommand } from ".";
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
    if (command instanceof Array)
      command.forEach((item) => {
        this.telegraf.command(item.name, item.action);
      });
    else this.telegraf.command(command.name, command.action);
  }

  async launch(): Promise<void> {
    this.telegraf.launch();
  }
}
