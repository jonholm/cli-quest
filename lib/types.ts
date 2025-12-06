export type FSNode = {
  type: 'file' | 'directory';
  name: string;
  content?: string;
  children?: FSNode[];
  permissions?: string;
  hidden?: boolean;
};

export type ZoneType = 'basics' | 'adventure' | 'challenges' | 'sandbox' | 'advanced';

export type Level = {
  id: string;
  title: string;
  objective: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  zone: ZoneType;
  initialFS: FSNode;
  startingPath: string;
  hints: string[];
  validator: (state: GameState) => boolean;
  successMessage: string;
  storyText?: string;
  unlockRequirements?: string[];
  xpReward?: number;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
};

export type UserProgress = {
  completedLevels: string[];
  achievements: Achievement[];
  totalXP: number;
  currentStreak: number;
  commandsExecuted: number;
};

export type CommandOutput = {
  input: string;
  output: string;
  isError: boolean;
};

export type GameState = {
  currentPath: string;
  fileSystem: FSNode;
  history: CommandOutput[];
  hintsUsed: number;
  commandCount: number;
  lastOutput: string;
  variables?: Record<string, string>;
};
