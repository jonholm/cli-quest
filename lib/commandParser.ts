export type ParsedCommand = {
  cmd: string;
  args: string[];
  flags: Record<string, boolean | string>;
};

export function parseCommand(input: string): ParsedCommand {
  const trimmed = input.trim();
  if (!trimmed) {
    return { cmd: '', args: [], flags: {} };
  }

  const parts = trimmed.split(/\s+/);
  const cmd = parts[0];
  const args: string[] = [];
  const flags: Record<string, boolean | string> = {};

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];

    if (part.startsWith('-')) {
      // Handle flags
      const flagName = part.replace(/^-+/, '');

      // Check if next part is a value for this flag
      if (i + 1 < parts.length && !parts[i + 1].startsWith('-')) {
        flags[flagName] = parts[i + 1];
        i++;
      } else {
        flags[flagName] = true;
      }
    } else {
      args.push(part);
    }
  }

  return { cmd, args, flags };
}
