import type { ValidatorConfig, ValidationState } from '@cli-quest/shared';
import { getNode } from '../filesystem/operations';

export function validate(config: ValidatorConfig, state: ValidationState): boolean {
  switch (config.type) {
    case 'all':
      return config.conditions.every((c) => validate(c, state));
    case 'any':
      return config.conditions.some((c) => validate(c, state));
    case 'fileExists':
      return getNode(state.fs, config.path) !== null;
    case 'fileNotExists':
      return getNode(state.fs, config.path) === null;
    case 'fileContains': {
      const node = getNode(state.fs, config.path);
      return node?.type === 'file' && (node.content || '').includes(config.substring);
    }
    case 'fileNotContains': {
      const node = getNode(state.fs, config.path);
      return !node || node.type !== 'file' || !(node.content || '').includes(config.substring);
    }
    case 'directoryContains': {
      const node = getNode(state.fs, config.path);
      return (
        node?.type === 'directory' &&
        (node.children || []).some((c) => c.name === config.childName)
      );
    }
    case 'currentPath':
      return state.cwd === config.path;
    case 'commandUsed':
      return state.commandsUsed.includes(config.command);
    case 'outputContains':
      return state.lastOutput.includes(config.substring);
    case 'envVar':
      return state.env[config.name] === config.value;
    default:
      return false;
  }
}
