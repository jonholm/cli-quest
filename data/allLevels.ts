import { Level } from '@/lib/types';
import { levels as basicLevels } from './challenges';
import { adventureLevels } from './adventureLevels';
import { challengeLevels } from './challengeLevels';
import { advancedLevels } from './advancedLevels';

// Add zone to basic levels
const basicsWithZone: Level[] = basicLevels.map(level => ({
  ...level,
  zone: 'basics' as const,
  xpReward: level.xpReward || 50,
}));

// Combine all levels
export const allLevels: Level[] = [
  ...basicsWithZone,
  ...adventureLevels,
  ...challengeLevels,
  ...advancedLevels,
];

// Export by zone for easy filtering
export const levelsByZone = {
  basics: basicsWithZone,
  adventure: adventureLevels,
  challenges: challengeLevels,
  advanced: advancedLevels,
  sandbox: [] as Level[], // Sandbox is freeform, no levels
};

// Zone metadata
export const zoneInfo = {
  basics: {
    title: 'Basic Training',
    description: 'Learn fundamental CLI commands step by step',
    icon: '[BASICS]',
    color: 'green',
  },
  adventure: {
    title: 'The Lost Data',
    description: 'A narrative-driven expedition to recover ancient servers',
    icon: '[ADVENTURE]',
    color: 'blue',
  },
  challenges: {
    title: 'Challenge Zones',
    description: 'Themed challenges: Detective, SysAdmin, Data Analyst',
    icon: '[CHALLENGES]',
    color: 'yellow',
  },
  advanced: {
    title: 'Advanced Techniques',
    description: 'Master complex commands and workflows',
    icon: '[ADVANCED]',
    color: 'red',
  },
  sandbox: {
    title: 'Sandbox Lab',
    description: 'Free exploration with all commands unlocked',
    icon: '[SANDBOX]',
    color: 'purple',
  },
};
