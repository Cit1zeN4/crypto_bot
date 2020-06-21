import { IBotCommand, IBotTrigger, IBotEvent, IBotAction } from "./IBot-types";

export interface IBotComposite {
  use(...middleware: Function[] | Object[]): void;
  on(event: IBotEvent): void;
  hears(trigger: IBotTrigger): void;
  command(command: IBotCommand): void;
  action(action: IBotAction): void;
}

export interface IBot extends IBotComposite {
  launch(): void;
}

export interface IBotScene extends IBotComposite {
  enter(...middleware: Function[] | Object[]): void;
  leave(...middleware: Function[] | Object[]): void;
}

export interface IBotStage extends IBotComposite {
  register(): void;
  middleware(): Function | Object;
  enter(sceneId: string, initialState?: object, silent?: boolean): Function | Object;
  reenter(): Function | Object;
  leave(): Function | Object;
}
