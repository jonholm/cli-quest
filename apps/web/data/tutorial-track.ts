import type { Level } from '@cli-quest/shared';

export const tutorialLevels: Level[] = [
  {
    id: 'tutorial-1',
    arcId: 'tutorial',
    chapter: 1,
    position: 1,
    title: 'Hello, Terminal!',
    objective: 'Type the command: echo hello',
    briefing:
      "Welcome! A terminal is like a text-based conversation with your computer. You type commands, and it responds. Let's start with the simplest command: echo — it just repeats what you say.",
    dialogue: [
      {
        character: 'ARIA',
        message:
          "Hi! I'm ARIA, your guide. Let's start with the basics. Type `echo hello` and press Enter. The terminal will repeat your words back to you!",
        trigger: { type: 'levelStart' },
      },
    ],
    initialFS: {
      type: 'directory',
      name: '',
      children: [
        { type: 'directory', name: 'home', children: [
          { type: 'directory', name: 'user', children: [] },
        ]},
      ],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Type `echo hello` and press Enter', commandHint: 'echo hello' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'commandUsed', command: 'echo' },
        { type: 'outputContains', substring: 'hello' },
      ],
    },
    xpReward: 25,
    commandsIntroduced: ['echo'],
  },
  {
    id: 'tutorial-2',
    arcId: 'tutorial',
    chapter: 1,
    position: 2,
    title: 'Where Are You?',
    objective: 'Use pwd to find out where you are',
    briefing:
      "Your terminal is always \"in\" a directory, like being in a folder on your desktop. The `pwd` command tells you which directory you're currently in.",
    dialogue: [
      {
        character: 'ARIA',
        message:
          "Every terminal session starts in a directory. Think of it like standing in a room. `pwd` stands for \"print working directory\" — it tells you which room you're in. Try it!",
        trigger: { type: 'levelStart' },
      },
      {
        character: 'ARIA',
        message:
          "You're in `/home/user` — that's your home directory! It's like your personal folder where your files live.",
        trigger: { type: 'commandExecuted', command: 'pwd' },
      },
    ],
    initialFS: {
      type: 'directory',
      name: '',
      children: [
        { type: 'directory', name: 'home', children: [
          { type: 'directory', name: 'user', children: [
            { type: 'file', name: 'readme.txt', content: 'Welcome to your home directory!' },
          ]},
        ]},
      ],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Type `pwd` and press Enter', commandHint: 'pwd' },
    ],
    validator: {
      type: 'commandUsed',
      command: 'pwd',
    },
    xpReward: 25,
    commandsIntroduced: ['pwd'],
  },
  {
    id: 'tutorial-3',
    arcId: 'tutorial',
    chapter: 1,
    position: 3,
    title: 'Look Around',
    objective: 'Use ls to see what files are here',
    briefing:
      "Now that you know where you are, let's see what's in this directory. The `ls` command lists all files and folders.",
    dialogue: [
      {
        character: 'ARIA',
        message:
          "`ls` stands for \"list\". It shows you everything in the current directory — files and folders. Like opening a folder and seeing what's inside. Try `ls`!",
        trigger: { type: 'levelStart' },
      },
      {
        character: 'ARIA',
        message:
          "You can see three items! `documents` and `pictures` are directories (folders), and `welcome.txt` is a file. Directories contain more files and directories inside them.",
        trigger: { type: 'commandExecuted', command: 'ls' },
      },
    ],
    initialFS: {
      type: 'directory',
      name: '',
      children: [
        { type: 'directory', name: 'home', children: [
          { type: 'directory', name: 'user', children: [
            { type: 'file', name: 'welcome.txt', content: 'Welcome to CLI Quest!\nYou are learning the command line.' },
            { type: 'directory', name: 'documents', children: [
              { type: 'file', name: 'notes.txt', content: 'Some notes here' },
            ]},
            { type: 'directory', name: 'pictures', children: [] },
          ]},
        ]},
      ],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Type `ls` and press Enter to list files', commandHint: 'ls' },
    ],
    validator: {
      type: 'commandUsed',
      command: 'ls',
    },
    xpReward: 25,
    commandsIntroduced: ['ls'],
  },
  {
    id: 'tutorial-4',
    arcId: 'tutorial',
    chapter: 1,
    position: 4,
    title: 'Reading Files',
    objective: 'Use cat to read the welcome.txt file',
    briefing:
      "You can read the contents of any file using the `cat` command. It displays the entire file in the terminal.",
    dialogue: [
      {
        character: 'ARIA',
        message:
          "`cat` stands for \"concatenate\" but mostly people use it to read files. Type `cat welcome.txt` to see what's inside the file!",
        trigger: { type: 'levelStart' },
      },
    ],
    initialFS: {
      type: 'directory',
      name: '',
      children: [
        { type: 'directory', name: 'home', children: [
          { type: 'directory', name: 'user', children: [
            { type: 'file', name: 'welcome.txt', content: 'Welcome to CLI Quest!\nYou are learning the command line.\nKeep going — you are doing great!' },
          ]},
        ]},
      ],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Type `cat welcome.txt` to read the file', commandHint: 'cat welcome.txt' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'commandUsed', command: 'cat' },
        { type: 'outputContains', substring: 'Welcome to CLI Quest' },
      ],
    },
    xpReward: 25,
    commandsIntroduced: ['cat'],
  },
  {
    id: 'tutorial-5',
    arcId: 'tutorial',
    chapter: 1,
    position: 5,
    title: 'Moving Around',
    objective: 'Use cd to enter the documents directory, then ls to see its contents',
    briefing:
      "You can move between directories using `cd` (change directory). It's like double-clicking a folder to open it.",
    dialogue: [
      {
        character: 'ARIA',
        message:
          "`cd` stands for \"change directory\". Type `cd documents` to move into the documents folder. Then use `ls` to see what's inside!",
        trigger: { type: 'levelStart' },
      },
      {
        character: 'ARIA',
        message:
          "You moved into documents! Now use `ls` to see what files are here. Pro tip: you can go back up with `cd ..` — the two dots mean \"parent directory\".",
        trigger: { type: 'commandExecuted', command: 'cd' },
      },
    ],
    initialFS: {
      type: 'directory',
      name: '',
      children: [
        { type: 'directory', name: 'home', children: [
          { type: 'directory', name: 'user', children: [
            { type: 'directory', name: 'documents', children: [
              { type: 'file', name: 'todo.txt', content: '1. Learn cd\n2. Learn mkdir\n3. Learn touch' },
              { type: 'file', name: 'diary.txt', content: 'Day 1: Started learning the command line!' },
            ]},
          ]},
        ]},
      ],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Type `cd documents` to enter the directory', commandHint: 'cd documents' },
      { text: 'Then type `ls` to list its contents', commandHint: 'ls' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'currentPath', path: '/home/user/documents' },
        { type: 'commandUsed', command: 'ls' },
      ],
    },
    xpReward: 50,
    commandsIntroduced: ['cd'],
  },
  {
    id: 'tutorial-6',
    arcId: 'tutorial',
    chapter: 1,
    position: 6,
    title: 'Creating Files',
    objective: 'Create a new file called my-file.txt using touch',
    briefing:
      "You can create new empty files with the `touch` command. It's the quickest way to make a new file.",
    dialogue: [
      {
        character: 'ARIA',
        message:
          "`touch` creates an empty file. Type `touch my-file.txt` to create a new file. Then use `ls` to verify it was created!",
        trigger: { type: 'levelStart' },
      },
    ],
    initialFS: {
      type: 'directory',
      name: '',
      children: [
        { type: 'directory', name: 'home', children: [
          { type: 'directory', name: 'user', children: [
            { type: 'file', name: 'existing.txt', content: 'I was already here' },
          ]},
        ]},
      ],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Type `touch my-file.txt` to create the file', commandHint: 'touch my-file.txt' },
    ],
    validator: {
      type: 'fileExists',
      path: '/home/user/my-file.txt',
    },
    xpReward: 50,
    commandsIntroduced: ['touch'],
  },
  {
    id: 'tutorial-7',
    arcId: 'tutorial',
    chapter: 1,
    position: 7,
    title: 'Making Directories',
    objective: 'Create a new directory called projects using mkdir',
    briefing:
      "Just like creating files, you can create new directories (folders) with `mkdir`.",
    dialogue: [
      {
        character: 'ARIA',
        message:
          "`mkdir` stands for \"make directory\". Type `mkdir projects` to create a new folder. Then `ls` to see it appear!",
        trigger: { type: 'levelStart' },
      },
    ],
    initialFS: {
      type: 'directory',
      name: '',
      children: [
        { type: 'directory', name: 'home', children: [
          { type: 'directory', name: 'user', children: [] },
        ]},
      ],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Type `mkdir projects` to create the directory', commandHint: 'mkdir projects' },
    ],
    validator: {
      type: 'fileExists',
      path: '/home/user/projects',
    },
    xpReward: 50,
    commandsIntroduced: ['mkdir'],
  },
  {
    id: 'tutorial-8',
    arcId: 'tutorial',
    chapter: 1,
    position: 8,
    title: 'Removing Files',
    objective: 'Delete the file called delete-me.txt using rm',
    briefing:
      "The `rm` command removes files. Be careful — there's no recycle bin in the terminal!",
    dialogue: [
      {
        character: 'ARIA',
        message:
          "`rm` stands for \"remove\". Type `rm delete-me.txt` to delete the file. Warning: this is permanent! In real terminals there's no undo, but here you can always reset the level.",
        trigger: { type: 'levelStart' },
      },
    ],
    initialFS: {
      type: 'directory',
      name: '',
      children: [
        { type: 'directory', name: 'home', children: [
          { type: 'directory', name: 'user', children: [
            { type: 'file', name: 'keep-me.txt', content: 'Please keep this file!' },
            { type: 'file', name: 'delete-me.txt', content: 'This file should be deleted' },
          ]},
        ]},
      ],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Type `rm delete-me.txt` to delete the file', commandHint: 'rm delete-me.txt' },
      { text: "Make sure you don't delete keep-me.txt!" },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'fileNotExists', path: '/home/user/delete-me.txt' },
        { type: 'fileExists', path: '/home/user/keep-me.txt' },
      ],
    },
    xpReward: 50,
    commandsIntroduced: ['rm'],
  },
  {
    id: 'tutorial-9',
    arcId: 'tutorial',
    chapter: 1,
    position: 9,
    title: 'Putting It Together',
    objective: 'Navigate to projects/, create a file called plan.txt, then go back to /home/user',
    briefing:
      "Let's combine what you've learned! Navigate, create a file, and navigate back.",
    dialogue: [
      {
        character: 'ARIA',
        message:
          "Time to combine your skills! Use `cd projects` to enter the folder, `touch plan.txt` to create a file, then `cd ..` to go back up. You've got this!",
        trigger: { type: 'levelStart' },
      },
      {
        character: 'ARIA',
        message:
          "Excellent! You've mastered the fundamentals. You can navigate, read files, create files and directories, and delete things. You're ready for real challenges!",
        trigger: { type: 'commandExecuted', command: 'touch' },
      },
    ],
    initialFS: {
      type: 'directory',
      name: '',
      children: [
        { type: 'directory', name: 'home', children: [
          { type: 'directory', name: 'user', children: [
            { type: 'directory', name: 'projects', children: [] },
          ]},
        ]},
      ],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Step 1: `cd projects`', commandHint: 'cd projects' },
      { text: 'Step 2: `touch plan.txt`', commandHint: 'touch plan.txt' },
      { text: 'Step 3: `cd ..` to go back', commandHint: 'cd ..' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'fileExists', path: '/home/user/projects/plan.txt' },
        { type: 'currentPath', path: '/home/user' },
      ],
    },
    xpReward: 100,
  },
  {
    id: 'tutorial-10',
    arcId: 'tutorial',
    chapter: 1,
    position: 10,
    title: 'The clear Command',
    objective: 'Clear the terminal screen, then use pwd to verify you\'re still in the same place',
    briefing:
      "One more useful trick: `clear` wipes the terminal screen. Your files and location don't change — it just gives you a clean view.",
    dialogue: [
      {
        character: 'ARIA',
        message:
          "Terminals can get cluttered. `clear` gives you a fresh screen. Your files, your location — nothing changes. It's purely visual. Try `clear` then `pwd` to see you're still where you were!",
        trigger: { type: 'levelStart' },
      },
      {
        character: 'ARIA',
        message:
          "Congratulations! You've completed the tutorial! You now know the essential commands: echo, pwd, ls, cat, cd, touch, mkdir, rm, and clear. Ready to start the story? Head to \"Ghost in the Machine\" from the hub!",
        trigger: { type: 'commandExecuted', command: 'pwd' },
      },
    ],
    initialFS: {
      type: 'directory',
      name: '',
      children: [
        { type: 'directory', name: 'home', children: [
          { type: 'directory', name: 'user', children: [
            { type: 'file', name: 'congrats.txt', content: 'You completed the tutorial!\nYou are ready for the real adventure.' },
          ]},
        ]},
      ],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Type `clear` to clear the screen, then `pwd` to check your location' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'commandUsed', command: 'clear' },
        { type: 'commandUsed', command: 'pwd' },
      ],
    },
    xpReward: 50,
    commandsIntroduced: ['clear'],
  },
];
