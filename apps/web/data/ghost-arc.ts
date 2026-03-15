import type { Level } from '@cli-quest/shared';

export const ghostLevels: Level[] = [
  // Chapter 1: Orientation
  {
    id: 'ghost-1-1',
    arcId: 'ghost',
    chapter: 1,
    position: 1,
    title: 'First Day',
    objective: 'Navigate to the servers directory and list its contents',
    briefing:
      "Welcome to NovaCorp, the world's leading cloud infrastructure company. You're the newest member of the security team. Your workstation is ready — let's get you oriented.",
    dialogue: [
      {
        character: 'Kai',
        message:
          "Hey, welcome aboard! I'm Kai, your mentor. Let's start by checking out the server directory. Use `cd servers` to navigate there, then `ls` to see what's inside.",
        trigger: { type: 'levelStart' },
      },
    ],
    initialFS: {
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
                  type: 'file',
                  name: 'welcome.txt',
                  content:
                    'Welcome to NovaCorp Security Team!\nYour access level: Junior Analyst\nTeam Lead: Kai Chen\n\nPlease review the servers directory for your first assignment.',
                },
                {
                  type: 'directory',
                  name: 'servers',
                  children: [
                    { type: 'file', name: 'web-01.log', content: '[OK] web-01 healthy\nUptime: 47 days' },
                    { type: 'file', name: 'web-02.log', content: '[OK] web-02 healthy\nUptime: 47 days' },
                    { type: 'file', name: 'db-01.log', content: '[OK] db-01 healthy\nUptime: 120 days' },
                    { type: 'file', name: 'api-gateway.log', content: '[WARN] api-gateway\nUnusual traffic spike at 03:47' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Use `cd servers` to change to the servers directory' },
      { text: 'Then use `ls` to list the files there' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'currentPath', path: '/home/user/servers' },
        { type: 'commandUsed', command: 'ls' },
      ],
    },
    xpReward: 50,
    commandsIntroduced: ['cd', 'ls'],
  },
  {
    id: 'ghost-1-2',
    arcId: 'ghost',
    chapter: 1,
    position: 2,
    title: 'Reading the Logs',
    objective: 'Read the api-gateway.log file to find the warning',
    briefing:
      'Something caught your eye in the server list. One of the logs has a warning status.',
    dialogue: [
      {
        character: 'Kai',
        message:
          "Good eye noticing the server list. That api-gateway looks suspicious. Use `cat` to read the log file and see what's going on.",
        trigger: { type: 'levelStart' },
      },
      {
        character: 'ARIA',
        message:
          "I'm ARIA, NovaCorp's AI assistant. I've flagged the api-gateway for unusual activity. The log should tell you more.",
        trigger: { type: 'commandExecuted', command: 'cat' },
      },
    ],
    initialFS: {
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
                  name: 'servers',
                  children: [
                    { type: 'file', name: 'web-01.log', content: '[OK] web-01 healthy\nUptime: 47 days' },
                    { type: 'file', name: 'web-02.log', content: '[OK] web-02 healthy\nUptime: 47 days' },
                    { type: 'file', name: 'db-01.log', content: '[OK] db-01 healthy\nUptime: 120 days' },
                    {
                      type: 'file',
                      name: 'api-gateway.log',
                      content:
                        '[WARN] api-gateway status report\nTimestamp: 2024-03-15 03:47:22\nAnomaly detected: Unusual traffic spike\nSource: Unknown external IP\nRequests: 14,847 in 60 seconds\nPattern: Sequential endpoint probing\nAction required: Investigate immediately',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    startingPath: '/home/user/servers',
    hints: [
      { text: 'Use `cat api-gateway.log` to read the file' },
      { text: 'The file is in your current directory' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'commandUsed', command: 'cat' },
        { type: 'outputContains', substring: 'Anomaly detected' },
      ],
    },
    xpReward: 50,
    commandsIntroduced: ['cat'],
  },
  {
    id: 'ghost-1-3',
    arcId: 'ghost',
    chapter: 1,
    position: 3,
    title: 'Where Am I?',
    objective: 'Use pwd to confirm your location, then navigate up to /home/user',
    briefing: "Let's make sure you know exactly where you are in the system.",
    dialogue: [
      {
        character: 'Kai',
        message:
          'Good practice to always know where you are. Use `pwd` to print your working directory, then `cd ..` to go up one level.',
        trigger: { type: 'levelStart' },
      },
    ],
    initialFS: {
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
                { type: 'file', name: 'notes.txt', content: 'Remember to check the access logs' },
                {
                  type: 'directory',
                  name: 'servers',
                  children: [
                    { type: 'file', name: 'status.txt', content: 'All systems nominal' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    startingPath: '/home/user/servers',
    hints: [
      { text: 'Use `pwd` to see your current directory' },
      { text: 'Use `cd ..` to go up one directory' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'commandUsed', command: 'pwd' },
        { type: 'currentPath', path: '/home/user' },
      ],
    },
    xpReward: 50,
    commandsIntroduced: ['pwd'],
  },
  {
    id: 'ghost-1-4',
    arcId: 'ghost',
    chapter: 1,
    position: 4,
    title: 'Creating Evidence',
    objective: 'Create a directory called "investigation" and a file called "notes.txt" inside it',
    briefing:
      "We need to start documenting what we find. Create a workspace for your investigation.",
    dialogue: [
      {
        character: 'Kai',
        message:
          "Create a directory called `investigation` with `mkdir`, then create a notes file inside with `touch`. We'll use this to track our findings.",
        trigger: { type: 'levelStart' },
      },
    ],
    initialFS: {
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
                { type: 'file', name: 'welcome.txt', content: 'Welcome to NovaCorp' },
              ],
            },
          ],
        },
      ],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Use `mkdir investigation` to create the directory' },
      { text: 'Use `touch investigation/notes.txt` to create the file' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'fileExists', path: '/home/user/investigation/notes.txt' },
        { type: 'commandUsed', command: 'mkdir' },
        { type: 'commandUsed', command: 'touch' },
      ],
    },
    xpReward: 75,
    commandsIntroduced: ['mkdir', 'touch'],
  },
  {
    id: 'ghost-1-5',
    arcId: 'ghost',
    chapter: 1,
    position: 5,
    title: 'Cleaning Up',
    objective: 'Remove the temp directory and its contents',
    briefing:
      'Someone left a mess of temporary files on the server. Clean them up.',
    dialogue: [
      {
        character: 'Reeves',
        message:
          "Hey, I'm Reeves, the sysadmin. Someone dumped temp files everywhere. Can you clean up the `temp` directory? Use `rm -r` to remove it and everything inside.",
        trigger: { type: 'levelStart' },
      },
    ],
    initialFS: {
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
                  name: 'temp',
                  children: [
                    { type: 'file', name: 'junk1.tmp', content: 'temp data' },
                    { type: 'file', name: 'junk2.tmp', content: 'more temp data' },
                    { type: 'file', name: 'cache.dat', content: 'cached stuff' },
                  ],
                },
                { type: 'file', name: 'important.txt', content: 'Do not delete this!' },
              ],
            },
          ],
        },
      ],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Use `rm -r temp` to remove the directory and all its contents' },
      { text: "Make sure you don't delete important.txt!" },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'fileNotExists', path: '/home/user/temp' },
        { type: 'fileExists', path: '/home/user/important.txt' },
        { type: 'commandUsed', command: 'rm' },
      ],
    },
    xpReward: 75,
    commandsIntroduced: ['rm'],
  },
];

export const allLevels = ghostLevels;
