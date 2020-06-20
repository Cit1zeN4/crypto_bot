import { TCommand, TTrigger, TEvent } from "./IBot-types";

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
