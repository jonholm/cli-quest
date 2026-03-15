export const DEFAULT_LINE_COUNT = 10;
export const HOME_DIRECTORY = '/home/user';
export const MAX_REGEX_LENGTH = 100;

export const PLAYER_LEVELS = [
  'intern',
  'junior',
  'mid',
  'senior',
  'staff',
  'principal',
] as const;

export type PlayerLevel = (typeof PLAYER_LEVELS)[number];

export const MASTERY_TIERS = ['learned', 'practiced', 'mastered'] as const;
export type MasteryTier = (typeof MASTERY_TIERS)[number];

export const MASTERY_THRESHOLDS = {
  practiced: 10,
  mastered: 25,
} as const;

export const DECAY_DAYS = 7;
export const MAX_REVIEW_QUEUE = 3;
