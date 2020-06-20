import { IBotStage, IBotScene } from ".";

export interface IBotCommand {
  commands: string | string[];
  actions: Function[] | Object[];
}

export interface IBotTrigger {
  triggers: string | string[] | RegExp | RegExp[] | Function;
  actions: Function[] | Object[];
}

export interface IBotEvent {
  events: string | string[];
  actions: Function[] | Object[];
}

export interface IBotFunc {
  commands?: IBotCommand[];
  triggers?: IBotTrigger[];
  events?: IBotEvent[];
  middleware?: Function[] | Object[];
}

export interface IBotLogic {
  stage?: IBotStage;
  scenes?: IBotScene[];
  baseFunc?: IBotFunc;
}
