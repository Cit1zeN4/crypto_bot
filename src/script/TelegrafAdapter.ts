import { Telegraf, Middleware, BaseScene, Stage, Context } from "telegraf";
import { HearsTriggers, MiddlewareFn } from "telegraf/typings/composer";
import { UpdateType, MessageSubTypes } from "telegraf/typings/telegram-types";
import { SceneContextMessageUpdate } from "telegraf/typings/stage";
import {
  IBot,
  IBotScene,
  IBotStage,
  IBotBuilder,
  IBotCommand,
  IBotTrigger,
  IBotEvent,
  IBotFunc,
  IBotLogic,
} from ".";
import { IBotAction } from "./IBot-types";

export interface ITelegrafCommand extends IBotCommand {
  commands: string | string[];
  actions: Middleware<Context>[];
}

export interface ITelegrafTrigger extends IBotTrigger {
  triggers: HearsTriggers<Context>;
  actions: Middleware<Context>[];
}

export interface ITelegrafEvent extends IBotEvent {
  events: UpdateType | MessageSubTypes | UpdateType[] | MessageSubTypes[];
  actions: Middleware<Context>[];
}

export interface ITelegrafAction extends IBotAction {
  triggers: HearsTriggers<Context>;
  actions: Middleware<Context>[];
}

export interface ITelegrafSceneCommand extends IBotCommand {
  commands: string | string[];
  actions: Middleware<SceneContextMessageUpdate>[];
}

export interface ITelegrafSceneTrigger extends IBotTrigger {
  triggers: HearsTriggers<SceneContextMessageUpdate>;
  actions: Middleware<SceneContextMessageUpdate>[];
}

export interface ITelegrafSceneEvent extends IBotEvent {
  events: UpdateType | MessageSubTypes | UpdateType[] | MessageSubTypes[];
  actions: Middleware<SceneContextMessageUpdate>[];
}

export interface ITelegrafSceneAction extends IBotAction {
  triggers: HearsTriggers<SceneContextMessageUpdate>;
  actions: Middleware<SceneContextMessageUpdate>[];
}

export interface ITelegrafBotFunc extends IBotFunc {
  commands?: ITelegrafCommand[];
  triggers?: ITelegrafTrigger[];
  events?: ITelegrafEvent[];
  middleware?: Middleware<Context>[];
}

export interface ITelegrafBotLogic extends IBotLogic {
  stage?: TelegrafStage;
  scenes?: TelegrafScene[];
  baseFunc?: ITelegrafBotFunc;
}

export class TelegrafScene implements IBotScene {
  private scene: BaseScene<SceneContextMessageUpdate>;

  constructor(id: string, options?: Partial<BaseScene<SceneContextMessageUpdate>>) {
    this.scene = new BaseScene<SceneContextMessageUpdate>(id, options);
  }

  action(action: ITelegrafSceneAction): void {
    this.scene.action(action.triggers, ...action.actions);
  }
  use(...middleware: Middleware<SceneContextMessageUpdate>[]): void {
    this.scene.use(...middleware);
  }
  on(event: ITelegrafSceneEvent): void {
    this.scene.on(event.events, ...event.actions);
  }
  hears(trigger: ITelegrafSceneTrigger): void {
    this.scene.hears(trigger.triggers, ...trigger.actions);
  }
  command(command: ITelegrafSceneCommand): void {
    this.scene.command(command.commands, ...command.actions);
  }

  enter(...middleware: Middleware<SceneContextMessageUpdate>[]): void {
    this.scene.enter(...middleware);
  }
  leave(...middleware: Middleware<SceneContextMessageUpdate>[]): void {
    this.scene.leave(...middleware);
  }

  getScene(): BaseScene<SceneContextMessageUpdate> {
    return this.scene;
  }
}

export class TelegrafStage implements IBotStage {
  private stage: Stage<SceneContextMessageUpdate>;

  constructor(...scene: TelegrafScene[]) {
    const baseScenes = scene.map((o) => o.getScene());
    this.stage = new Stage(baseScenes);
  }

  action(action: ITelegrafSceneAction): void {
    this.stage.action(action.triggers, ...action.actions);
  }
  use(...middleware: Middleware<SceneContextMessageUpdate>[]): void {
    this.stage.use(...middleware);
  }
  on(event: ITelegrafSceneEvent): void {
    this.stage.on(event.events, ...event.actions);
  }
  hears(trigger: ITelegrafSceneTrigger): void {
    this.stage.hears(trigger.triggers, ...trigger.actions);
  }
  command(command: ITelegrafSceneCommand): void {
    this.stage.command(command.commands, ...command.actions);
  }

  register(...scenes: TelegrafScene[]): void {
    const baseScenes = scenes.map((o) => o.getScene());
    this.stage.register(...baseScenes);
  }
  middleware(): MiddlewareFn<SceneContextMessageUpdate> {
    return this.stage.middleware();
  }
  enter(
    sceneId: string,
    initialState?: object | undefined,
    silent?: boolean | undefined
  ): Middleware<SceneContextMessageUpdate> {
    return Stage.enter(sceneId, initialState, silent);
  }
  reenter(): Middleware<SceneContextMessageUpdate> {
    return Stage.reenter();
  }
  leave(): Middleware<SceneContextMessageUpdate> {
    return Stage.leave();
  }
}

export class TelegrafAdapter implements IBot {
  private telegraf: Telegraf<Context>;

  constructor(telegraf: Telegraf<Context>) {
    this.telegraf = telegraf;
  }

  action(action: ITelegrafAction): void {
    this.telegraf.action(action.triggers, ...action.actions);
  }
  use(...middleware: Middleware<Context>[]): void {
    this.telegraf.use(...middleware);
  }
  on(event: ITelegrafEvent): void {
    this.telegraf.on(event.events, ...event.actions);
  }
  hears(trigger: ITelegrafTrigger): void {
    this.telegraf.hears(trigger.triggers, ...trigger.actions);
  }
  command(command: ITelegrafCommand): void {
    this.telegraf.command(command.commands, ...command.actions);
  }
  launch(): Promise<void> {
    return this.telegraf.launch();
  }
}
