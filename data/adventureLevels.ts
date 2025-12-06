import { Level, FSNode } from '@/lib/types';

// Adventure Mode: "The Lost Data"
// A narrative-driven series where you're a digital archaeologist

const adventure1FS: FSNode = {
  type: 'directory',
  name: '',
  children: [
    {
      type: 'directory',
      name: 'expedition',
      children: [
        {
          type: 'directory',
          name: 'camp',
          children: [
            {
              type: 'file',
              name: 'mission_brief.txt',
              content: 'EXPEDITION LOG - DAY 1\n\nWelcome, Digital Archaeologist!\n\nYou\'ve been hired to recover lost data from an abandoned server farm.\nYour first task: Orient yourself and find the expedition supplies.\n\nStart by checking your current location.',
            },
            {
              type: 'file',
              name: 'supplies.txt',
              content: 'Basic tools loaded.\nReady for exploration.',
            },
          ],
        },
      ],
    },
  ],
};

const adventure2FS: FSNode = {
  type: 'directory',
  name: '',
  children: [
    {
      type: 'directory',
      name: 'expedition',
      children: [
        {
          type: 'directory',
          name: 'camp',
          children: [
            {
              type: 'file',
              name: 'mission_brief.txt',
              content: 'DAY 2: The site has multiple data vaults.\nLocate them all.',
            },
          ],
        },
        {
          type: 'directory',
          name: 'vault_alpha',
          children: [],
        },
        {
          type: 'directory',
          name: 'vault_beta',
          children: [],
        },
        {
          type: 'directory',
          name: 'vault_gamma',
          children: [],
        },
      ],
    },
  ],
};

const adventure3FS: FSNode = {
  type: 'directory',
  name: '',
  children: [
    {
      type: 'directory',
      name: 'expedition',
      children: [
        {
          type: 'directory',
          name: 'vault_alpha',
          children: [
            {
              type: 'file',
              name: 'encrypted_01.dat',
              content: 'xxxxxxxx',
            },
            {
              type: 'file',
              name: 'encrypted_02.dat',
              content: 'xxxxxxxx',
            },
            {
              type: 'file',
              name: 'key.txt',
              content: 'DECRYPTION KEY: PHOENIX\n\nThis key unlocks vault_beta.',
            },
          ],
        },
        {
          type: 'directory',
          name: 'vault_beta',
          children: [],
        },
      ],
    },
  ],
};

const adventure4FS: FSNode = {
  type: 'directory',
  name: '',
  children: [
    {
      type: 'directory',
      name: 'expedition',
      children: [
        {
          type: 'directory',
          name: 'vault_beta',
          children: [
            {
              type: 'file',
              name: 'research_notes.txt',
              content: 'Dr. Sarah Chen - Research Log\n\nThe ancient servers hold secrets.\nKey findings stored in vault_gamma.\nLook for files containing PROJECT.',
            },
            {
              type: 'file',
              name: 'PROJECT_GUARDIAN.txt',
              content: 'PROJECT GUARDIAN: An AI system designed to protect digital artifacts.',
            },
            {
              type: 'file',
              name: 'maintenance_log.txt',
              content: 'Routine maintenance performed.',
            },
          ],
        },
      ],
    },
  ],
};

const adventure5FS: FSNode = {
  type: 'directory',
  name: '',
  children: [
    {
      type: 'directory',
      name: 'expedition',
      children: [
        {
          type: 'directory',
          name: 'vault_gamma',
          children: [
            {
              type: 'file',
              name: 'data_001.txt',
              content: 'Fragment 1: The truth',
            },
            {
              type: 'file',
              name: 'data_002.txt',
              content: 'Fragment 2: lies in',
            },
            {
              type: 'file',
              name: 'data_003.txt',
              content: 'Fragment 3: the core',
            },
            {
              type: 'directory',
              name: 'core',
              children: [
                {
                  type: 'file',
                  name: 'FINAL_MESSAGE.txt',
                  content: 'CONGRATULATIONS, ARCHAEOLOGIST!\n\nYou\'ve uncovered the truth:\nThe servers weren\'t abandoned - they were PROTECTED.\nThe AI Guardian preserved this data for someone worthy.\n\nThat someone is you.\n\nMission Complete.',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const adventureLevels: Level[] = [
  {
    id: 'adv-1',
    title: 'Day 1: Arrival',
    objective: 'Read the mission brief to begin your expedition',
    difficulty: 'beginner',
    zone: 'adventure',
    initialFS: adventure1FS,
    startingPath: '/expedition/camp',
    storyText: 'You arrive at the abandoned server farm. The air hums with forgotten electricity. Your journey begins here.',
    hints: ['Use pwd to see where you are', 'Use ls to see what files are here', 'Use cat to read the mission_brief.txt'],
    validator: (state) => state.lastOutput.includes('Orient yourself'),
    successMessage: 'Mission brief read. You\'re ready to explore!',
    xpReward: 50,
  },
  {
    id: 'adv-2',
    title: 'Day 2: The Vaults',
    objective: 'Discover all three data vaults in the expedition site',
    difficulty: 'beginner',
    zone: 'adventure',
    initialFS: adventure2FS,
    startingPath: '/expedition/camp',
    storyText: 'The site is larger than expected. Multiple vaults dot the landscape.',
    hints: ['Go back to the expedition directory', 'List all directories', 'You need to see all three vaults: alpha, beta, and gamma'],
    validator: (state) => {
      const hasAlpha = state.history.some(h => h.output.includes('vault_alpha'));
      const hasBeta = state.history.some(h => h.output.includes('vault_beta'));
      const hasGamma = state.history.some(h => h.output.includes('vault_gamma'));
      return hasAlpha && hasBeta && hasGamma;
    },
    successMessage: 'All vaults located! Time to investigate.',
    unlockRequirements: ['adv-1'],
    xpReward: 75,
  },
  {
    id: 'adv-3',
    title: 'Day 3: The Key',
    objective: 'Find and read the decryption key in vault_alpha',
    difficulty: 'intermediate',
    zone: 'adventure',
    initialFS: adventure3FS,
    startingPath: '/expedition',
    storyText: 'Vault Alpha\'s door creaks open. Inside, encrypted files wait...',
    hints: ['Navigate to vault_alpha', 'List the files inside', 'Read the key.txt file'],
    validator: (state) => state.lastOutput.includes('PHOENIX'),
    successMessage: 'Decryption key acquired! Vault Beta awaits.',
    unlockRequirements: ['adv-2'],
    xpReward: 100,
  },
  {
    id: 'adv-4',
    title: 'Day 4: Project Files',
    objective: 'Search vault_beta for files containing "PROJECT"',
    difficulty: 'intermediate',
    zone: 'adventure',
    initialFS: adventure4FS,
    startingPath: '/expedition/vault_beta',
    storyText: 'Vault Beta is filled with research notes. What was Dr. Chen working on?',
    hints: ['You need to search for files with "PROJECT" in the name', 'Use grep to search file contents', 'Try: grep PROJECT *.txt'],
    validator: (state) => state.lastOutput.includes('GUARDIAN'),
    successMessage: 'Project Guardian discovered! The mystery deepens.',
    unlockRequirements: ['adv-3'],
    xpReward: 150,
  },
  {
    id: 'adv-5',
    title: 'Day 5: The Core',
    objective: 'Navigate to the core and read the final message',
    difficulty: 'intermediate',
    zone: 'adventure',
    initialFS: adventure5FS,
    startingPath: '/expedition/vault_gamma',
    storyText: 'The final vault. Data fragments scattered like puzzle pieces.',
    hints: [
      'Explore the directory structure',
      'There\'s a subdirectory called core',
      'Navigate to core and read FINAL_MESSAGE.txt',
    ],
    validator: (state) => state.lastOutput.includes('Mission Complete'),
    successMessage: 'EXPEDITION COMPLETE! The Lost Data has been found!',
    unlockRequirements: ['adv-4'],
    xpReward: 200,
  },
];
