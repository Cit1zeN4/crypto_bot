import { ITelegrafBotLogic, ITelegrafCommand, TelegrafStage, TelegrafScene } from "../script";
import { Markup, Stage } from "telegraf";

const mainScene = new TelegrafScene("main");
mainScene.enter((ctx) => {
  ctx.reply("Our functional", Markup.keyboard(["Log in", "Log out"]).resize().oneTime().extra());
});
mainScene.hears({
  triggers: "Log in",
  actions: [
    (ctx) => {
      ctx.scene.enter("login");
    },
  ],
});

const loginScene = new TelegrafScene("login");
loginScene.enter((ctx) => {
  (ctx as any).scene.state.backScene = "main";
  ctx.reply("Please enter your phrase");
});
loginScene.on({
  events: "text",
  actions: [
    (ctx) => {
      ctx.reply(ctx.message?.text ? ctx.message?.text : "0_0");
    },
  ],
});

const scenes = [mainScene, loginScene];

const stage = new TelegrafStage(...scenes);
stage.command({
  commands: "cancel",
  actions: [
    (ctx) => {
      const back = (ctx as any).scene.state.backScene;
      if (back) ctx.scene.enter(back);
      else ctx.scene.enter("main");
    },
  ],
});

const logic: ITelegrafBotLogic = {
  baseFunc: {
    commands: [
      {
        commands: "start",
        actions: [
          (ctx) => {
            ctx.reply("Welcome to crypto bot");
            (ctx as any).scene.enter("main");
          },
        ],
      },
    ],
  },
  stage,
};

export default logic;
