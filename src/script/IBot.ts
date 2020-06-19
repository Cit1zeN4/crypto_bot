import { TCommand, TTrigger, TEvent } from "./IBot-types";
import { addArray } from ".";

export interface IBot {
  use(...middleware: Function[] | Object[]): void;
  on(event: TEvent): void;
  hears(trigger: TTrigger): void;
  command(command: TCommand): void;
  launch(): void;
}

export interface IBotScene {
  use(...middleware: Function[] | Object[]): void;
  on(event: TEvent): void;
  hears(trigger: TTrigger): void;
  command(command: TCommand): void;

  enter(...middleware: Function[] | Object[]): void;
  leave(...middleware: Function[] | Object[]): void;
}

export interface IBotStage {
  use(...middleware: Function[] | Object[]): void;
  on(event: TEvent): void;
  hears(trigger: TTrigger): void;
  command(command: TCommand): void;

  register(): void;
  middleware(): Function | Object;
  enter(sceneId: string, initialState?: object, silent?: boolean): Function | Object;
  reenter(): Function | Object;
  leave(): Function | Object;
}

export function setCommands(commands: TCommand | TCommand[], cb: (ctx: any) => void) {
  addArray(commands, cb);
}
export function setEvents(events: TEvent | TEvent[], cb: (ctx: any) => void) {
  addArray(events, cb);
}
export function setTriggers(triggers: TTrigger | TTrigger[], cb: (ctx: any) => void) {
  addArray(triggers, cb);
}
