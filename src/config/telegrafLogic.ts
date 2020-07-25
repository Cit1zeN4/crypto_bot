import { ITelegrafBotLogic, ITelegrafCommand, TelegrafStage, TelegrafScene } from "../script";
import { Markup, Stage } from "telegraf";
import joi from "@hapi/joi";
import { Waves, TTransaction } from "../script/waves";
import { getConfig } from "./config";

enum txStage {
  Recipient,
  Amount,
  Fee,
  Seed,
}

const config = getConfig("config");
const waves = new Waves();
const wavesTransfer: TTransaction = { recipient: "", amount: 0, seed: config.waves.seed };
let botMessage: any = undefined;

const mainScene = new TelegrafScene("main");
mainScene.enter((ctx) => {
  ctx
    .reply(
      "You can make some actions",
      Markup.inlineKeyboard([Markup.callbackButton("Create transaction", "tx")]).extra()
    )
    .then((m) => {
      botMessage = m.message_id;
    });
});

mainScene.action({
  triggers: "tx",
  actions: [
    (ctx) => {
      ctx.answerCbQuery();
      ctx.deleteMessage(botMessage);
      ctx.scene.enter("tx");
    },
  ],
});

const txScene = new TelegrafScene("tx");
txScene.enter((ctx) => {
  (ctx as any).scene.state.backScene = "main";
  (ctx as any).scene.state.txStage = txStage.Recipient;
  ctx
    .reply("Enter the recipient's address", Markup.keyboard(["Cancel"]).resize().oneTime().extra())
    .then((m) => {
      botMessage = m.message_id;
    });
});

txScene.on({
  events: "text",
  actions: [
    (ctx) => {
      switch ((ctx as any).scene.state.txStage) {
        case txStage.Recipient: {
          const valid = joi.string().required().validate(ctx.message?.text);
          if (!valid.error) {
            wavesTransfer.recipient = valid.value;
            (ctx as any).scene.state.txStage = txStage.Amount;
            ctx.reply("Enter Amount").then((m) => {
              botMessage = m.message_id;
            });
          } else {
            ctx.reply(valid.error.message);
          }
          break;
        }
        case txStage.Amount: {
          const valid = joi.number().required().min(1).validate(ctx.message?.text);
          if (!valid.error) {
            wavesTransfer.amount = valid.value;
            ctx.scene.enter("txApply");
          } else {
            ctx.reply(valid.error.message);
          }
          break;
        }
        default: {
          ctx.reply("Something went wrong try again").then((m) => {
            botMessage = m.message_id;
          });
          break;
        }
      }
    },
  ],
});

const txApplyScene = new TelegrafScene("txApply");

txApplyScene.enter((ctx) => {
  (ctx as any).scene.state.backScene = "main";
  ctx
    .reply(
      `Transaction info:\nRecipient: ${wavesTransfer.recipient}\nAmount: ${wavesTransfer.amount}\n\nAre you sure you want to make a transaction?`,
      Markup.inlineKeyboard([
        [Markup.callbackButton("Yes I'm sure", "txYes")],
        [Markup.callbackButton("No, I'm not", "txNo")],
      ]).extra()
    )
    .then((m) => {
      botMessage = m.message_id;
    });
});

txApplyScene.action({
  triggers: "txYes",
  actions: [
    async (ctx) => {
      const result = await waves.createTransaction(wavesTransfer);
      console.log(result);
      waves.sendTxRequest(result).then(async (res) => {
        if (res.ok) {
          await ctx.answerCbQuery();
          await ctx.deleteMessage(botMessage);
          botMessage = await (
            await ctx.reply("Transaction was created successfully", Markup.removeKeyboard().extra())
          ).message_id;
        } else {
          const err = await res.text();
          console.log(err);
          await ctx.reply("Creating transaction error");
        }
        const back = (ctx as any).scene.state.backScene;
        ctx.scene.enter(back);
      });
    },
  ],
});

txApplyScene.action({
  triggers: "txNo",
  actions: [
    async (ctx) => {
      await ctx.answerCbQuery();
      await ctx.deleteMessage(botMessage);
      await ctx.scene.enter("main");
    },
  ],
});

const scenes = [mainScene, txScene, txApplyScene];

const stage = new TelegrafStage(...scenes);
stage.hears({
  triggers: "Cancel",
  actions: [
    async (ctx) => {
      await ctx.deleteMessage(botMessage);
      const back = (ctx as any).scene.state.backScene;
      if (back) await ctx.scene.enter(back);
      else await ctx.scene.enter("main");
    },
  ],
});

stage.command({
  commands: "cancel",
  actions: [
    async (ctx) => {
      await ctx.deleteMessage(botMessage);
      const back = (ctx as any).scene.state.backScene;
      if (back) await ctx.scene.enter(back);
      else await ctx.scene.enter("main");
    },
  ],
});

stage.command({
  commands: "menu",
  actions: [
    async (ctx) => {
      await ctx.deleteMessage(botMessage);
      await ctx.scene.enter("main");
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
            ctx.reply("Welcome to NASHI telegram bot");
            (ctx as any).scene.enter("main");
          },
        ],
      },
    ],
  },
  stage,
};

export default logic;
