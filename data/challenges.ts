import { Level, FSNode } from '@/lib/types';

const level1FS: FSNode = {
  type: 'directory',
  name: '',
  children: [
    {
      type: 'directory',
      name: 'home',
      children: [
        {
          type: 'directory',
          name: 'user',
          children: [],
        },
      ],
    },
  ],
};

const level2FS: FSNode = {
  type: 'directory',
  name: '',
  children: [
    {
      type: 'directory',
      name: 'home',
      children: [
        {
          type: 'directory',
          name: 'user',
          children: [
            {
              type: 'directory',
              name: 'documents',
              children: [],
            },
            {
              type: 'directory',
              name: 'downloads',
              children: [],
            },
            {
              type: 'file',
              name: 'notes.txt',
              content: 'Remember to learn CLI commands!',
            },
          ],
        },
      ],
    },
  ],
};

const level3FS: FSNode = {
  type: 'directory',
  name: '',
  children: [
    {
      type: 'directory',
      name: 'home',
      children: [
        {
          type: 'directory',
          name: 'user',
          children: [
            {
              type: 'directory',
              name: 'documents',
              children: [
                {
                  type: 'file',
                  name: 'welcome.txt',
                  content: 'Welcome to the documents folder!',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const level4FS: FSNode = {
  type: 'directory',
  name: '',
  children: [
    {
      type: 'directory',
      name: 'home',
      children: [
        {
          type: 'directory',
          name: 'user',
          children: [
            {
              type: 'directory',
              name: 'documents',
              children: [
                {
                  type: 'file',
                  name: 'welcome.txt',
                  content: 'Congratulations! You\'ve learned cat.',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const level5FS: FSNode = {
  type: 'directory',
  name: '',
  children: [
    {
      type: 'directory',
      name: 'home',
      children: [
        {
          type: 'directory',
          name: 'user',
          children: [
            {
              type: 'directory',
              name: 'documents',
              children: [
                {
                  type: 'file',
                  name: 'readme.txt',
                  content: 'Look deeper for the secret...',
                },
                {
                  type: 'directory',
                  name: 'hidden',
                  children: [
                    {
                      type: 'file',
                      name: 'secret.txt',
                      content: 'FLAG-1337',
                    },
                  ],
                },
              ],
            },
            {
              type: 'directory',
              name: 'downloads',
              children: [],
            },
          ],
        },
      ],
    },
  ],
};

export const levels: Level[] = [
  {
    id: '1',
    title: 'Where Am I?',
    objective: 'Print your current working directory',
    difficulty: 'beginner',
    initialFS: level1FS,
    startingPath: '/home/user',
    hints: ['Try the pwd command'],
    validator: (state) => state.lastOutput.includes('/home/user'),
    successMessage: 'Great! You\'ve learned the pwd command.',
  },
  {
    id: '2',
    title: 'Look Around',
    objective: 'List the contents of this directory',
    difficulty: 'beginner',
    initialFS: level2FS,
    startingPath: '/home/user',
    hints: ['The ls command lists files and folders'],
    validator: (state) => state.commandCount > 0 && state.lastOutput.includes('documents'),
    successMessage: 'Excellent! You can now see what\'s in a directory.',
  },
  {
    id: '3',
    title: 'Go Deeper',
    objective: 'Navigate into the documents folder',
    difficulty: 'beginner',
    initialFS: level3FS,
    startingPath: '/home/user',
    hints: ['cd stands for "change directory"', 'Try: cd documents'],
    validator: (state) => state.currentPath.endsWith('/documents'),
    successMessage: 'Perfect! You\'ve mastered navigation.',
  },
  {
    id: '4',
    title: 'Read the Manual',
    objective: 'Read the contents of welcome.txt',
    difficulty: 'beginner',
    initialFS: level4FS,
    startingPath: '/home/user/documents',
    hints: ['cat prints file contents to the screen', 'Try: cat welcome.txt'],
    validator: (state) => state.lastOutput.includes('Congratulations'),
    successMessage: 'You\'ve learned to read files!',
  },
  {
    id: '5',
    title: 'Treasure Hunt',
    objective: 'Find and read the file containing the secret code',
    difficulty: 'beginner',
    initialFS: level5FS,
    startingPath: '/home/user',
    hints: [
      'Explore the directories first',
      'Check inside documents',
      'Go deeper...',
      'The secret is in documents/hidden/secret.txt',
    ],
    validator: (state) => state.lastOutput.includes('FLAG-1337'),
    successMessage: 'Incredible! You found the secret code!',
  },
];
