import type { CommandHandler } from '../types';

const commands = new Map<string, CommandHandler>();

export function registerCommand(name: string, handler: CommandHandler): void {
  commands.set(name, handler);
}

export function getCommand(name: string): CommandHandler | undefined {
  return commands.get(name);
}

export function getRegisteredCommands(): string[] {
  return Array.from(commands.keys()).sort();
}
