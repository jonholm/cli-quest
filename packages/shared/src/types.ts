// === Filesystem ===

export type FSNode = {
  type: 'file' | 'directory';
  name: string;
  content?: string;
  children?: FSNode[];
  permissions?: string;
  hidden?: boolean;
};

// === Environment ===

export type Env = Record<string, string>;

// === Shell Result ===

export type ShellResult = {
  stdout: string;
  stderr: string;
  exitCode: number;
  fs: FSNode;
  env: Env;
  cwd: string;
};

// === Validator ===

export type ValidatorCondition =
  | { type: 'fileExists'; path: string }
  | { type: 'fileNotExists'; path: string }
  | { type: 'fileContains'; path: string; substring: string }
  | { type: 'fileNotContains'; path: string; substring: string }
  | { type: 'directoryContains'; path: string; childName: string }
  | { type: 'currentPath'; path: string }
  | { type: 'commandUsed'; command: string }
  | { type: 'outputContains'; substring: string }
  | { type: 'envVar'; name: string; value: string };

export type ValidatorConfig =
  | { type: 'all'; conditions: ValidatorConfig[] }
  | { type: 'any'; conditions: ValidatorConfig[] }
  | ValidatorCondition;

// === Dialogue ===

export type DialogueEntry = {
  character: string;
  message: string;
  trigger?: {
    type: 'commandExecuted' | 'levelStart' | 'hintUsed';
    command?: string;
  };
};

// === Hints ===

export type Hint = {
  text: string;
  commandHint?: string;
};

// === Level ===

export type Level = {
  id: string;
  arcId: string;
  chapter: number;
  position: number;
  title: string;
  objective: string;
  briefing: string;
  dialogue?: DialogueEntry[];
  initialFS: FSNode;
  initialEnv?: Env;
  startingPath: string;
  hints: Hint[];
  validator: ValidatorConfig;
  xpReward: number;
  commandsIntroduced?: string[];
  par?: number;
};

// === Validation State (passed to validator) ===

export type ValidationState = {
  fs: FSNode;
  cwd: string;
  env: Env;
  lastOutput: string;
  commandsUsed: string[];
};
