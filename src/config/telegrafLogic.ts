import { ITelegrafBotLogic, ITelegrafCommand, TelegrafStage, TelegrafScene } from "../script";
import { Markup, Stage } from "telegraf";

const mainScene = new TelegrafScene("main");
mainScene.enter((ctx) => {
  ctx.reply(
    "Our functional",
    Markup.inlineKeyboard([
      Markup.callbackButton("Coke", "Coke"),
      Markup.callbackButton("Pepsi", "Pepsi"),
    ]).extra()
  );
});

const loginScene = new TelegrafScene("login");
loginScene.enter((ctx) => {
  ctx.reply("Plese enter your login");
});
loginScene.leave((ctx) => {
  ctx.scene.enter("main ");
});

const scenes = [mainScene, loginScene];

const stage = new TelegrafStage(...scenes);
stage.command({ commands: "cancel", actions: [Stage.leave()] });

const logic: ITelegrafBotLogic = {
  baseFunc: {
    commands: [
      {
        commands: "start",
        actions: [
          (ctx) => {
            ctx.reply("Welcom to crypto bot");
            (ctx as any).scene.enter("main");
          },
        ],
      },
    ],
  },
  stage,
};

export default logic;
