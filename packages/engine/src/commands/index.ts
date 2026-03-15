import { registerCommand } from './registry';
import { pwd, ls, cd } from './navigation';
import { cat, touch, mkdir, rm, cp, mv, chmod } from './file-ops';
import { grep, find } from './search';
import { head, tail, wc, echo, sort, uniq } from './text';
import { exportCmd, envCmd } from './env';
import { clear, history, man } from './system';

export function registerAllCommands(): void {
  registerCommand('pwd', pwd);
  registerCommand('ls', ls);
  registerCommand('cd', cd);
  registerCommand('cat', cat);
  registerCommand('touch', touch);
  registerCommand('mkdir', mkdir);
  registerCommand('rm', rm);
  registerCommand('cp', cp);
  registerCommand('mv', mv);
  registerCommand('chmod', chmod);
  registerCommand('grep', grep);
  registerCommand('find', find);
  registerCommand('head', head);
  registerCommand('tail', tail);
  registerCommand('wc', wc);
  registerCommand('echo', echo);
  registerCommand('sort', sort);
  registerCommand('uniq', uniq);
  registerCommand('export', exportCmd);
  registerCommand('env', envCmd);
  registerCommand('clear', clear);
  registerCommand('history', history);
  registerCommand('man', man);
}
