import { Level, FSNode } from '@/lib/types';

// CHALLENGE ZONE: File Detective
// Find hidden files, search for patterns, investigate mysteries

const detectiveFS1: FSNode = {
  type: 'directory',
  name: '',
  children: [
    {
      type: 'directory',
      name: 'crime_scene',
      children: [
        {
          type: 'file',
          name: 'evidence_log.txt',
          content: 'Case #4217: Missing Data\n\nWitness reports:\n- Suspect was seen near the config files\n- Left behind a hidden clue\n- Time: 23:47',
        },
        {
          type: 'file',
          name: '.hidden_clue',
          content: 'The password is: BLUE_PHOENIX',
          hidden: true,
        },
        {
          type: 'file',
          name: 'report.txt',
          content: 'Investigation ongoing...',
        },
      ],
    },
  ],
};

const detectiveFS2: FSNode = {
  type: 'directory',
  name: '',
  children: [
    {
      type: 'directory',
      name: 'investigation',
      children: [
        {
          type: 'file',
          name: 'suspect1.txt',
          content: 'Name: John Doe\nAlibi: At home\nStatus: Clear',
        },
        {
          type: 'file',
          name: 'suspect2.txt',
          content: 'Name: Jane Smith\nAlibi: No alibi\nStatus: SUSPICIOUS\nNote: Check bank records',
        },
        {
          type: 'file',
          name: 'suspect3.txt',
          content: 'Name: Bob Johnson\nAlibi: At work\nStatus: Clear',
        },
      ],
    },
  ],
};

// CHALLENGE ZONE: System Administrator
// Manage servers, organize files, maintain systems

const sysadminFS1: FSNode = {
  type: 'directory',
  name: '',
  children: [
    {
      type: 'directory',
      name: 'server',
      children: [
        {
          type: 'directory',
          name: 'logs',
          children: [
            {
              type: 'file',
              name: 'access.log',
              content: '2024-01-15 10:23:11 - User login\n2024-01-15 10:24:05 - File accessed\n2024-01-15 10:25:33 - ERROR: Permission denied\n2024-01-15 10:26:12 - User logout',
            },
            {
              type: 'file',
              name: 'error.log',
              content: 'ERROR: Disk space low\nERROR: Connection timeout\nWARNING: High memory usage',
            },
          ],
        },
        {
          type: 'directory',
          name: 'backups',
          children: [],
        },
      ],
    },
  ],
};

const sysadminFS2: FSNode = {
  type: 'directory',
  name: '',
  children: [
    {
      type: 'directory',
      name: 'server',
      children: [
        {
          type: 'file',
          name: 'file1.tmp',
          content: 'temporary',
        },
        {
          type: 'file',
          name: 'important.txt',
          content: 'important data',
        },
        {
          type: 'file',
          name: 'file2.tmp',
          content: 'temporary',
        },
        {
          type: 'directory',
          name: 'archive',
          children: [],
        },
      ],
    },
  ],
};

// CHALLENGE ZONE: Data Analyst
// Work with data files, count, analyze, extract information

const analystFS1: FSNode = {
  type: 'directory',
  name: '',
  children: [
    {
      type: 'directory',
      name: 'data',
      children: [
        {
          type: 'file',
          name: 'sales.csv',
          content: 'Date,Product,Amount\n2024-01-01,Widget,100\n2024-01-02,Gadget,150\n2024-01-03,Widget,200\n2024-01-04,Gizmo,175\n2024-01-05,Widget,125',
        },
      ],
    },
  ],
};

const analystFS2: FSNode = {
  type: 'directory',
  name: '',
  children: [
    {
      type: 'directory',
      name: 'reports',
      children: [
        {
          type: 'file',
          name: 'quarterly.txt',
          content: 'Q1 Report\n\nRevenue: $50,000\nExpenses: $30,000\nProfit: $20,000\n\nKey Metrics:\n- Customer growth: 15%\n- Retention rate: 92%\n- Market share: 8%\n\nConclusion: Strong performance',
        },
      ],
    },
  ],
};

export const challengeLevels: Level[] = [
  // File Detective Challenges
  {
    id: 'detect-1',
    title: 'Hidden Evidence',
    objective: 'Find and read the hidden clue file (starts with .)',
    difficulty: 'beginner',
    zone: 'challenges',
    initialFS: detectiveFS1,
    startingPath: '/crime_scene',
    hints: [
      'Hidden files start with a dot (.)',
      'Use ls -a to see hidden files',
      'Read the .hidden_clue file',
    ],
    validator: (state) => state.lastOutput.includes('BLUE_PHOENIX'),
    successMessage: 'Evidence found! The suspect is identified.',
    xpReward: 100,
  },
  {
    id: 'detect-2',
    title: 'Suspect Search',
    objective: 'Find which suspect file contains "SUSPICIOUS"',
    difficulty: 'intermediate',
    zone: 'challenges',
    initialFS: detectiveFS2,
    startingPath: '/investigation',
    hints: [
      'You need to search inside files',
      'Use grep to search for patterns',
      'Try: grep SUSPICIOUS *.txt',
    ],
    validator: (state) => state.lastOutput.includes('suspect2'),
    successMessage: 'Suspect identified! Case closed.',
    xpReward: 125,
  },

  // System Administrator Challenges
  {
    id: 'sysadmin-1',
    title: 'Error Hunter',
    objective: 'Find all ERROR entries in the log files',
    difficulty: 'intermediate',
    zone: 'challenges',
    initialFS: sysadminFS1,
    startingPath: '/server',
    hints: [
      'Navigate to the logs directory',
      'Search for "ERROR" in the log files',
      'Use grep ERROR *.log',
    ],
    validator: (state) => state.lastOutput.includes('Permission denied') || state.lastOutput.includes('Disk space low'),
    successMessage: 'Errors identified! Time to fix them.',
    xpReward: 125,
  },
  {
    id: 'sysadmin-2',
    title: 'Cleanup Crew',
    objective: 'Move all .tmp files to the archive directory',
    difficulty: 'advanced',
    zone: 'challenges',
    initialFS: sysadminFS2,
    startingPath: '/server',
    hints: [
      'List files to see the .tmp files',
      'Use mv to move files',
      'Move file1.tmp and file2.tmp to archive/',
    ],
    validator: (state) => {
      const archiveNode = state.fileSystem.children?.[0]?.children?.find(
        (c: FSNode) => c.name === 'archive'
      );
      return archiveNode?.children?.some((c: FSNode) => c.name.endsWith('.tmp')) || false;
    },
    successMessage: 'Server cleaned! Disk space recovered.',
    xpReward: 150,
  },

  // Data Analyst Challenges
  {
    id: 'analyst-1',
    title: 'Sales Counter',
    objective: 'Count how many lines mention "Widget" in sales.csv',
    difficulty: 'intermediate',
    zone: 'challenges',
    initialFS: analystFS1,
    startingPath: '/data',
    hints: [
      'Use grep to find lines with "Widget"',
      'Use wc -l to count lines',
      'Try: grep Widget sales.csv',
    ],
    validator: (state) => {
      const lines = state.lastOutput.split('\n').filter(l => l.includes('Widget'));
      return lines.length >= 3;
    },
    successMessage: 'Analysis complete! Widget sales tracked.',
    xpReward: 125,
  },
  {
    id: 'analyst-2',
    title: 'Report Preview',
    objective: 'View only the first 5 lines of the quarterly report',
    difficulty: 'beginner',
    zone: 'challenges',
    initialFS: analystFS2,
    startingPath: '/reports',
    hints: [
      'Use head to see the beginning of a file',
      'Try: head -n 5 quarterly.txt',
    ],
    validator: (state) => {
      const lines = state.lastOutput.split('\n');
      return lines.length <= 6 && state.lastOutput.includes('Q1 Report');
    },
    successMessage: 'Report preview generated!',
    xpReward: 75,
  },
];
