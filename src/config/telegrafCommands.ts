import { ITelegrafCommand } from "../script/TelegrafAdapter";

const commands: ITelegrafCommand[] = [
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
