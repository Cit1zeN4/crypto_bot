import { Middleware } from "telegraf";
import { TelegrafContext } from "telegraf/typings/context";
import { HearsTriggers } from "telegraf/typings/composer";
import { UpdateType, MessageSubTypes } from "telegraf/typings/telegram-types";

export type TCommand = { commands: string | string[]; actions: Function[] | Object[] };
export type TTrigger = {
  triggers: string | string[] | RegExp | RegExp[] | Function;
  actions: Function[] | Object[];
};
export type TEvent = {
  events: string | string[];
  actions: Function[] | Object[];
};

export type TTelegrafCommand = {
  commands: string | string[];
  actions: Middleware<TelegrafContext>[];
};
export type TTelegrafTrigger = {
  triggers: HearsTriggers<TelegrafContext>;
  actions: Middleware<TelegrafContext>[];
};
export type TTelegrafEvent = {
  events: UpdateType | MessageSubTypes | UpdateType[] | MessageSubTypes[];
  actions: Middleware<TelegrafContext>[];
};
