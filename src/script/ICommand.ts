import { TelegrafContext } from "telegraf/typings/context";

export interface ICommand {
  name: string;
  action: (ctx: any) => void;
}

export class TelegrafCommand implements ICommand {
  name: string;
  action: (ctx: TelegrafContext) => void;

  constructor(name: string, action: (ctx: TelegrafContext) => void) {
    this.name = name;
    this.action = action;
  }
}