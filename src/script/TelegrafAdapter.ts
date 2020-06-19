import { IBot, IBotScene, IBotStage } from ".";
import { Telegraf, Middleware, BaseScene, Stage, Context } from "telegraf";
import { HearsTriggers, MiddlewareFn } from "telegraf/typings/composer";
import { UpdateType, MessageSubTypes } from "telegraf/typings/telegram-types";
import { SceneContextMessageUpdate } from "telegraf/typings/stage";

export type TTelegrafCommand = {
  commands: string | string[];
  actions: Middleware<Context>[];
};

export type TTelegrafTrigger = {
  triggers: HearsTriggers<Context>;
  actions: Middleware<Context>[];
};

export type TTelegrafEvent = {
  events: UpdateType | MessageSubTypes | UpdateType[] | MessageSubTypes[];
  actions: Middleware<Context>[];
};

export type TTelegrafSceneCommand = {
  commands: string | string[];
  actions: Middleware<SceneContextMessageUpdate>[];
};

export type TTelegrafSceneTrigger = {
  triggers: HearsTriggers<SceneContextMessageUpdate>;
  actions: Middleware<SceneContextMessageUpdate>[];
};

export type TTelegrafSceneEvent = {
  events: UpdateType | MessageSubTypes | UpdateType[] | MessageSubTypes[];
  actions: Middleware<SceneContextMessageUpdate>[];
};

export class TelegrafScene implements IBotScene {
  private scene: BaseScene<SceneContextMessageUpdate>;

  constructor(id: string, options?: Partial<BaseScene<SceneContextMessageUpdate>>) {
    this.scene = new BaseScene<SceneContextMessageUpdate>(id, options);
  }

  use(...middleware: Middleware<SceneContextMessageUpdate>[]): void {
    this.scene.use(...middleware);
  }
  on(event: TTelegrafSceneEvent): void {
    this.scene.on(event.events, ...event.actions);
  }
  hears(trigger: TTelegrafSceneTrigger): void {
    this.scene.hears(trigger.triggers, ...trigger.actions);
  }
  command(command: TTelegrafSceneCommand): void {
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

  use(...middleware: Middleware<SceneContextMessageUpdate>[]): void {
    this.stage.use(...middleware);
  }
  on(event: TTelegrafSceneEvent): void {
    this.stage.on(event.events, ...event.actions);
  }
  hears(trigger: TTelegrafSceneTrigger): void {
    this.stage.hears(trigger.triggers, ...trigger.actions);
  }
  command(command: TTelegrafSceneCommand): void {
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

  use(...middleware: Middleware<Context>[]): void {
    this.telegraf.use(...middleware);
  }
  on(event: TTelegrafEvent): void {
    this.telegraf.on(event.events, ...event.actions);
  }
  hears(trigger: TTelegrafTrigger): void {
    this.telegraf.hears(trigger.triggers, ...trigger.actions);
  }
  command(command: TTelegrafCommand): void {
    this.telegraf.command(command.commands, ...command.actions);
  }
  launch(): Promise<void> {
    return this.telegraf.launch();
  }
}
