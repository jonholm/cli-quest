import { Level, FSNode } from '@/lib/types';

// ADVANCED ZONE: Master-level challenges

const advancedFS1: FSNode = {
  type: 'directory',
  name: '',
  children: [
    {
      type: 'directory',
      name: 'project',
      children: [
        {
          type: 'directory',
          name: 'src',
          children: [
            {
              type: 'file',
              name: 'app.js',
              content: 'console.log("Hello");',
            },
            {
              type: 'file',
              name: 'config.js',
              content: 'module.exports = {};',
            },
          ],
        },
        {
          type: 'directory',
          name: 'docs',
          children: [
            {
              type: 'file',
              name: 'README.md',
              content: '# Project\n\nDocumentation here.',
            },
          ],
        },
        {
          type: 'directory',
          name: 'tests',
          children: [],
        },
      ],
    },
  ],
};

const advancedFS2: FSNode = {
  type: 'directory',
  name: '',
  children: [
    {
      type: 'directory',
      name: 'database',
      children: [
        {
          type: 'file',
          name: 'users.txt',
          content: 'alice:admin:active\nbob:user:active\ncarol:user:inactive\ndave:admin:active\neve:user:active',
        },
      ],
    },
  ],
};

const advancedFS3: FSNode = {
  type: 'directory',
  name: '',
  children: [
    {
      type: 'directory',
      name: 'workspace',
      children: [
        {
          type: 'file',
          name: 'notes.txt',
          content: 'Meeting notes from Q1\nTODO: Review budget\nTODO: Update timeline\nCompleted: Team hiring\nTODO: Finalize design\nIn Progress: Development',
        },
      ],
    },
  ],
};

const advancedFS4: FSNode = {
  type: 'directory',
  name: '',
  children: [
    {
      type: 'directory',
      name: 'research',
      children: [
        {
          type: 'directory',
          name: 'papers',
          children: [
            {
              type: 'file',
              name: 'ai_research.txt',
              content: 'AI Research findings',
            },
            {
              type: 'file',
              name: 'ml_study.txt',
              content: 'Machine Learning study',
            },
          ],
        },
        {
          type: 'directory',
          name: 'data',
          children: [
            {
              type: 'file',
              name: 'results.csv',
              content: 'experiment,result\ntest1,pass\ntest2,fail',
            },
          ],
        },
      ],
    },
  ],
};

export const advancedLevels: Level[] = [
  {
    id: 'adv-cmd-1',
    title: 'File Finder',
    objective: 'Find all JavaScript files (.js) in the project',
    difficulty: 'advanced',
    zone: 'advanced',
    initialFS: advancedFS1,
    startingPath: '/project',
    hints: [
      'Use the find command',
      'Search for files with .js extension',
      'Try: find . -name "*.js"',
    ],
    validator: (state) => state.lastOutput.includes('app.js') && state.lastOutput.includes('config.js'),
    successMessage: 'All JavaScript files located!',
    xpReward: 175,
  },
  {
    id: 'adv-cmd-2',
    title: 'Admin Filter',
    objective: 'Find all admin users in the database',
    difficulty: 'advanced',
    zone: 'advanced',
    initialFS: advancedFS2,
    startingPath: '/database',
    hints: [
      'Search for lines containing "admin"',
      'Use grep to filter the file',
      'Try: grep admin users.txt',
    ],
    validator: (state) => state.lastOutput.includes('alice') && state.lastOutput.includes('dave') && !state.lastOutput.includes('bob'),
    successMessage: 'Admin users identified!',
    xpReward: 150,
  },
  {
    id: 'adv-cmd-3',
    title: 'Task Master',
    objective: 'Count how many TODO items are in notes.txt',
    difficulty: 'advanced',
    zone: 'advanced',
    initialFS: advancedFS3,
    startingPath: '/workspace',
    hints: [
      'Search for lines with "TODO"',
      'Count the matching lines',
      'Try combining grep and wc: grep TODO notes.txt | wc -l',
      'Or use grep with wc: grep TODO notes.txt then check the count',
    ],
    validator: (state) => {
      const todoLines = state.lastOutput.split('\n').filter(l => l.includes('TODO'));
      return todoLines.length === 3;
    },
    successMessage: 'Task count completed! 3 TODOs found.',
    xpReward: 200,
  },
  {
    id: 'adv-cmd-4',
    title: 'Deep Search',
    objective: 'Find all .txt files in the research directory and subdirectories',
    difficulty: 'expert',
    zone: 'advanced',
    initialFS: advancedFS4,
    startingPath: '/research',
    hints: [
      'Use find to search recursively',
      'Look for .txt files',
      'Try: find . -name "*.txt"',
    ],
    validator: (state) => state.lastOutput.includes('ai_research.txt') && state.lastOutput.includes('ml_study.txt'),
    successMessage: 'Deep search complete! All text files found.',
    xpReward: 225,
  },
  {
    id: 'adv-cmd-5',
    title: 'The Ultimate Challenge',
    objective: 'Copy all files from papers/ to data/, then list data/ to verify',
    difficulty: 'expert',
    zone: 'advanced',
    initialFS: advancedFS4,
    startingPath: '/research',
    hints: [
      'Use cp to copy files',
      'Navigate to papers directory first',
      'Copy each .txt file to ../data/',
      'Then list data/ to verify',
    ],
    validator: (state) => {
      const dataNode = state.fileSystem.children?.[0]?.children?.find(
        (c: FSNode) => c.name === 'data'
      );
      const hasCopiedFiles = dataNode?.children?.some((c: FSNode) =>
        c.name === 'ai_research.txt' || c.name === 'ml_study.txt'
      );
      return hasCopiedFiles || false;
    },
    successMessage: 'MASTER LEVEL COMPLETE! You are a CLI expert!',
    xpReward: 300,
  },
];
