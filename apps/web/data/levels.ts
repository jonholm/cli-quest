import { ghostLevels } from './ghost-arc';
import { tutorialLevels } from './tutorial-track';
import type { Level } from '@cli-quest/shared';

export const allLevels: Level[] = [...tutorialLevels, ...ghostLevels];

export const arcs = [
  {
    id: 'tutorial',
    title: 'Tutorial',
    subtitle: 'Learn the Basics',
    description: 'A gentle introduction to the command line. No experience needed.',
    color: 'green' as const,
    levels: tutorialLevels,
    chapters: [{ number: 1, title: 'Getting Started', levels: tutorialLevels }],
  },
  {
    id: 'ghost',
    title: 'Ghost in the Machine',
    subtitle: 'A Cybersecurity Thriller',
    description: 'Investigate anomalous server activity at NovaCorp. Uncover the truth before it\'s too late.',
    color: 'purple' as const,
    levels: ghostLevels,
    chapters: [
      { number: 1, title: 'Orientation', levels: ghostLevels.filter(l => l.chapter === 1) },
      { number: 2, title: 'The Trail', levels: ghostLevels.filter(l => l.chapter === 2) },
      { number: 3, title: 'Containment', levels: ghostLevels.filter(l => l.chapter === 3) },
      { number: 4, title: 'The Truth', levels: ghostLevels.filter(l => l.chapter === 4) },
    ],
  },
];

export function getLevelById(id: string): Level | undefined {
  return allLevels.find(l => l.id === id);
}

export function getNextLevel(currentId: string): Level | undefined {
  const idx = allLevels.findIndex(l => l.id === currentId);
  if (idx >= 0 && idx < allLevels.length - 1) {
    return allLevels[idx + 1];
  }
  return undefined;
}
