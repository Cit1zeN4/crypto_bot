import { TTelegrafCommand } from "../script/TelegrafAdapter";

const commands: TTelegrafCommand[] = [
  {
    commands: "start",
    actions: [
      (ctx) => {
        ctx.reply("Welcome to new TG bot");
      },
    ],
  },
];

export default commands;
