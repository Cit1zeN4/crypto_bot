export interface IBot {
  addTask(): void
  launch(): void
}

export interface ICommand {
  name: string;
  action: Function;
}