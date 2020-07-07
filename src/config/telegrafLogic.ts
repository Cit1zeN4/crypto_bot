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
let wavesTransfer: TTransaction;

const mainScene = new TelegrafScene("main");
mainScene.enter((ctx) => {
  ctx.reply(
    "You can make some actions",
    Markup.keyboard(["Create transaction"]).resize().oneTime().extra()
  );
});

mainScene.hears({
  triggers: "Create transaction",
  actions: [
    (ctx) => {
      ctx.scene.enter("tx");
    },
  ],
});

const txScene = new TelegrafScene("tx");
txScene.enter((ctx) => {
  (ctx as any).scene.state.backScene = "main";
  (ctx as any).scene.state.txStage = txStage.Recipient;
  (ctx as any).scene.state.txData = { recipient: null, amount: null, fee: null, seed: null };
  ctx.reply(
    "Enter the recipient's address",
    Markup.keyboard(["Cancel"]).resize().oneTime().extra()
  );
});

txScene.on({
  events: "text",
  actions: [
    (ctx) => {
      switch ((ctx as any).scene.state.txStage) {
        case txStage.Recipient: {
          const valid = joi.string().required().validate(ctx.message?.text);
          if (!valid.error) {
            (ctx as any).scene.state.txData.recipient = valid.value;
            (ctx as any).scene.state.txStage = txStage.Amount;
            ctx.reply("Enter Amount");
          } else {
            ctx.reply(valid.error.message);
          }
          break;
        }
        case txStage.Amount: {
          const valid = joi.number().required().min(1).validate(ctx.message?.text);
          if (!valid.error) {
            (ctx as any).scene.state.txData.amount = valid.value;
            (ctx as any).scene.state.txStage = txStage.Fee;
            ctx.reply("Enter fee");
          } else {
            ctx.reply(valid.error.message);
          }

          break;
        }
        case txStage.Fee: {
          const valid = joi
            .number()
            .required()
            .min(Number(config.waves.minFee) | 100000)
            .validate(ctx.message?.text);
          if (!valid.error) {
            (ctx as any).scene.state.txData.fee = valid.value;
            (ctx as any).scene.state.txStage = txStage.Seed;
            ctx.reply("Enter seed");
          } else {
            ctx.reply(valid.error.message);
          }

          break;
        }
        case txStage.Seed: {
          const valid = joi.string().required().validate(ctx.message?.text);
          if (!valid.error) {
            (ctx as any).scene.state.txData.seed = valid.value;
            const txData = (ctx as any).scene.state.txData;
            ctx
              .reply(
                `Transaction:\nRecipient: ${txData.recipient}\nAmount: ${txData.amount}\nFee: ${txData.fee}`
              )
              .then(() => {
                ctx.scene.enter("txApply");
              });
            wavesTransfer = {
              recipient: txData.recipient,
              amount: txData.amount,
              fee: txData.fee,
              seed: txData.seed,
            };
          } else {
            ctx.reply(valid.error.message);
          }
          break;
        }
        default: {
          ctx.reply("Something went wrong");
          break;
        }
      }
    },
  ],
});

const txApplyScene = new TelegrafScene("txApply");

txApplyScene.enter((ctx) => {
  (ctx as any).scene.state.backScene = "main";
  ctx.reply(
    "Are you sure you want to make a transaction?",
    Markup.keyboard(["Yes I'm sure", "Cancel"]).resize().oneTime().extra()
  );
});

txApplyScene.hears({
  triggers: "Yes I'm sure",
  actions: [
    (ctx) => {
      const result = waves.createTransaction(wavesTransfer);
      waves.sendTxRequest(result).then(async (res) => {
        if (res.ok) {
          await ctx.reply("OK", Markup.removeKeyboard().extra());
        } else {
          const err = await res.json();
          console.log(err);
          await ctx.reply("Creating transaction error");
        }
        console.log(result);
        const back = (ctx as any).scene.state.backScene;
        ctx.scene.enter(back);
      });
    },
  ],
});

const scenes = [mainScene, txScene, txApplyScene];

const stage = new TelegrafStage(...scenes);
stage.hears({
  triggers: "Cancel",
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
