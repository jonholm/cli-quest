import { ParsedCommand } from '../commandParser';

export function echo(parsed: ParsedCommand): string {
  return parsed.args.join(' ');
}
