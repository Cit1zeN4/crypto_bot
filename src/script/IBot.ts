import Telegraf from "telegraf";
import { TelegrafContext } from "telegraf/typings/context";
import { ICommand } from ".";

export interface IBot {
  addCommand(command: ICommand): void
  launch(): void
}

export class TelegrafAdapter implements IBot {

  telegraf: Telegraf<TelegrafContext>

  constructor(telegraf: Telegraf<TelegrafContext>) {
    this.telegraf = telegraf
  }

  addCommand(command: ICommand): void {
    const c = command
    this.telegraf.command(c.name, c.action)
  }

  async launch(): Promise<void> {
    this.telegraf.launch()
  }
}

