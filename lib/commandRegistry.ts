import { GameState } from './types';
import { ParsedCommand } from './commandParser';

export type CommandResult = { output: string; newState?: Partial<GameState> };
type CommandHandler = (state: GameState, parsed: ParsedCommand) => CommandResult;

const registry = new Map<string, CommandHandler>();

export function registerCommand(name: string, handler: CommandHandler): void {
  registry.set(name, handler);
}

export function getCommand(name: string): CommandHandler | undefined {
  return registry.get(name);
}

export function getRegisteredCommands(): string[] {
  return Array.from(registry.keys()).sort();
}
