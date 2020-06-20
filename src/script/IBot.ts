import { IBotCommand, IBotTrigger, IBotEvent } from "./IBot-types";

export interface IBot {
  use(...middleware: Function[] | Object[]): void;
  on(event: IBotEvent): void;
  hears(trigger: IBotTrigger): void;
  command(command: IBotCommand): void;
  launch(): void;
}

export interface IBotScene {
  use(...middleware: Function[] | Object[]): void;
  on(event: IBotEvent): void;
  hears(trigger: IBotTrigger): void;
  command(command: IBotCommand): void;

  enter(...middleware: Function[] | Object[]): void;
  leave(...middleware: Function[] | Object[]): void;
}

export interface IBotStage {
  use(...middleware: Function[] | Object[]): void;
  on(event: IBotEvent): void;
  hears(trigger: IBotTrigger): void;
  command(command: IBotCommand): void;

  register(): void;
  middleware(): Function | Object;
  enter(sceneId: string, initialState?: object, silent?: boolean): Function | Object;
  reenter(): Function | Object;
  leave(): Function | Object;
}
