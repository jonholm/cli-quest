import { GameState } from '../types';

export function pwd(state: GameState): string {
  return state.currentPath;
}
