import Telegraf from "telegraf";
import { Middleware } from "telegraf";
import { UpdateType, MessageSubTypes } from "telegraf/typings/telegram-types";
import { TelegrafContext } from "telegraf/typings/context";
import { HearsTriggers } from "telegraf/typings/composer";
import {
  TCommand,
  TTelegrafCommand,
  TTrigger,
  TTelegrafTrigger,
  TEvent,
  TTelegrafEvent,
} from "./IBot-types";
import { addArray } from ".";

export interface IBot {
  use(...middleware: Function[] | Object[]): void;
  on(event: TEvent): void;
  hears(trigger: TTrigger): void;
  command(command: TCommand): void;
  launch(): void;
}

export function setCommands(commands: TCommand | TCommand[], cb: (ctx: any) => void) {
  addArray(commands, cb);
}

export class TelegrafAdapter implements IBot {
  private telegraf: Telegraf<TelegrafContext>;

  constructor(telegraf: Telegraf<TelegrafContext>) {
    this.telegraf = telegraf;
  }

  use(...middleware: Middleware<TelegrafContext>[]): void {
    this.telegraf.use(...middleware);
  }
  on(event: TTelegrafEvent): void {
    this.telegraf.on(event.events, ...event.actions);
  }
  hears(trigger: TTelegrafTrigger): void {
    this.telegraf.hears(trigger.triggers, ...trigger.actions);
  }
  command(command: TTelegrafCommand): void {
    const c = this.telegraf.command(command.commands, ...command.actions);
  }
  launch(): Promise<void> {
    return this.telegraf.launch();
  }
}
