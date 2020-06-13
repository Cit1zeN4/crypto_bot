import { ICommand, TelegrafCommand } from "../script";

const commands: Array<ICommand> = [
  new TelegrafCommand("start", (ctx) => {
    ctx.reply("Welcome to crypto trader");
  }),
];

export default commands;
