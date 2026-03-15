import type { Level } from '@cli-quest/shared';

export const startupLevels: Level[] = [
  // Chapter 1: Day One
  {
    id: 'startup-1-1',
    arcId: 'startup',
    chapter: 1,
    position: 1,
    title: 'Welcome to ShipFast',
    objective: 'Explore the project directory and read the README',
    briefing:
      "Congratulations — you're the first (and only) DevOps engineer at ShipFast, a startup that just went viral on Product Hunt. The codebase is a mess. Time to fix it.",
    dialogue: [
      {
        character: 'Priya',
        message:
          "Hey! I'm Priya, the CTO. We just hit #1 on Product Hunt and our servers are melting. I need you to navigate to our `project` directory and read the README. It's... not great.",
        trigger: { type: 'levelStart' },
      },
    ],
    initialFS: {
      type: 'directory', name: '', children: [{ type: 'directory', name: 'home', children: [{ type: 'directory', name: 'user', children: [
        { type: 'directory', name: 'project', children: [
          { type: 'file', name: 'README.md', content: '# ShipFast\nTODO: write actual readme\nDeploy: ???\nTests: none lol\nEnv vars: hardcoded somewhere\n\nHelp.' },
          { type: 'file', name: 'app.js', content: 'const express = require("express");\n// TODO: everything' },
          { type: 'file', name: 'package.json', content: '{"name":"shipfast","version":"0.0.1"}' },
          { type: 'directory', name: 'src', children: [
            { type: 'file', name: 'index.js', content: 'console.log("ShipFast starting...");' },
          ]},
        ]},
      ]}]}],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Use `cd project` then `cat README.md`' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'commandUsed', command: 'cat' },
        { type: 'outputContains', substring: 'TODO: write actual readme' },
      ],
    },
    xpReward: 50,
  },
  {
    id: 'startup-1-2',
    arcId: 'startup',
    chapter: 1,
    position: 2,
    title: 'Project Structure',
    objective: 'Create proper directories: config/, logs/, and backups/',
    briefing: "The project has zero organization. Let's fix that.",
    dialogue: [
      {
        character: 'Priya',
        message:
          "We need structure. Create `config/`, `logs/`, and `backups/` directories. Every real project needs these.",
        trigger: { type: 'levelStart' },
      },
    ],
    initialFS: {
      type: 'directory', name: '', children: [{ type: 'directory', name: 'home', children: [{ type: 'directory', name: 'user', children: [
        { type: 'file', name: 'app.js', content: 'const app = require("./src");' },
        { type: 'directory', name: 'src', children: [
          { type: 'file', name: 'index.js', content: 'module.exports = {};' },
        ]},
      ]}]}],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Use `mkdir config && mkdir logs && mkdir backups`' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'fileExists', path: '/home/user/config' },
        { type: 'fileExists', path: '/home/user/logs' },
        { type: 'fileExists', path: '/home/user/backups' },
      ],
    },
    xpReward: 50,
  },
  {
    id: 'startup-1-3',
    arcId: 'startup',
    chapter: 1,
    position: 3,
    title: 'Environment Variables',
    objective: 'Set up the environment: DATABASE_URL, API_KEY, and NODE_ENV',
    briefing: "The app has hardcoded credentials. Let's use environment variables like professionals.",
    dialogue: [
      {
        character: 'Priya',
        message:
          "Someone hardcoded the database password in the source code. Set up proper env vars: `export DATABASE_URL=postgres://localhost:5432/shipfast`, `export API_KEY=sk_live_abc123`, and `export NODE_ENV=production`.",
        trigger: { type: 'levelStart' },
      },
    ],
    initialFS: {
      type: 'directory', name: '', children: [{ type: 'directory', name: 'home', children: [{ type: 'directory', name: 'user', children: [
        { type: 'file', name: 'app.js', content: 'const DB = "postgres://admin:password123@prod-db:5432/app"; // FIXME' },
      ]}]}],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Use `export DATABASE_URL=postgres://localhost:5432/shipfast`' },
      { text: 'Then `export API_KEY=sk_live_abc123` and `export NODE_ENV=production`' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'envVar', name: 'DATABASE_URL', value: 'postgres://localhost:5432/shipfast' },
        { type: 'envVar', name: 'API_KEY', value: 'sk_live_abc123' },
        { type: 'envVar', name: 'NODE_ENV', value: 'production' },
      ],
    },
    xpReward: 75,
  },

  // Chapter 2: The Incident
  {
    id: 'startup-2-1',
    arcId: 'startup',
    chapter: 2,
    position: 1,
    title: 'Server on Fire',
    objective: 'Check the error log — find all 500 errors and count them',
    briefing: "Users are reporting crashes. The error rate is spiking. Time to investigate.",
    dialogue: [
      {
        character: 'Priya',
        message:
          "Users are angry. Twitter is blowing up. Check `error.log` for 500 errors. I need a count NOW. Use `grep 500 error.log | wc -l`.",
        trigger: { type: 'levelStart' },
      },
      {
        character: 'Marcus',
        message:
          "Hey, I'm Marcus, the backend dev. Sorry about the mess. I pushed a bad deploy at 2am. The 500s started right after.",
        trigger: { type: 'commandExecuted', command: 'grep' },
      },
    ],
    initialFS: {
      type: 'directory', name: '', children: [{ type: 'directory', name: 'home', children: [{ type: 'directory', name: 'user', children: [
        { type: 'file', name: 'error.log', content: 'GET /api/users 200 12ms\nGET /api/feed 200 45ms\nPOST /api/upload 500 timeout\nGET /api/users 200 15ms\nGET /api/feed 500 timeout\nPOST /api/payment 500 db_error\nGET /api/users 200 11ms\nGET /api/feed 500 timeout\nPOST /api/upload 500 timeout\nGET /api/health 200 2ms\nPOST /api/payment 500 db_error\nGET /api/feed 500 timeout' },
      ]}]}],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Use `grep 500 error.log | wc -l` to count the 500 errors' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'commandUsed', command: 'grep' },
        { type: 'commandUsed', command: 'wc' },
        { type: 'outputContains', substring: '6' },
      ],
    },
    xpReward: 100,
  },
  {
    id: 'startup-2-2',
    arcId: 'startup',
    chapter: 2,
    position: 2,
    title: 'Finding the Pattern',
    objective: 'Find which endpoints are failing — grep for 500, sort, and get unique endpoints',
    briefing: "Which endpoints are crashing? We need to find the pattern.",
    dialogue: [
      {
        character: 'Priya',
        message:
          "Is it all endpoints or just some? Use `grep 500 error.log | sort | uniq` to see the unique failing requests.",
        trigger: { type: 'levelStart' },
      },
    ],
    initialFS: {
      type: 'directory', name: '', children: [{ type: 'directory', name: 'home', children: [{ type: 'directory', name: 'user', children: [
        { type: 'file', name: 'error.log', content: 'POST /api/upload 500 timeout\nGET /api/feed 500 timeout\nPOST /api/payment 500 db_error\nGET /api/feed 500 timeout\nPOST /api/upload 500 timeout\nPOST /api/payment 500 db_error\nGET /api/feed 500 timeout' },
      ]}]}],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Use `grep 500 error.log | sort | uniq` to find unique failing endpoints' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'commandUsed', command: 'grep' },
        { type: 'commandUsed', command: 'sort' },
        { type: 'commandUsed', command: 'uniq' },
      ],
    },
    xpReward: 125,
  },
  {
    id: 'startup-2-3',
    arcId: 'startup',
    chapter: 2,
    position: 3,
    title: 'The Rollback',
    objective: 'Back up the bad deploy, restore from the backup, and log the rollback',
    briefing: "We need to roll back Marcus's bad deploy. Backup the broken version, restore the good one.",
    dialogue: [
      {
        character: 'Marcus',
        message:
          "The backup of the last good deploy is in `backups/app-stable.js`. Move the current broken `app.js` to `backups/app-broken.js`, then copy the stable version back to `app.js`.",
        trigger: { type: 'levelStart' },
      },
    ],
    initialFS: {
      type: 'directory', name: '', children: [{ type: 'directory', name: 'home', children: [{ type: 'directory', name: 'user', children: [
        { type: 'file', name: 'app.js', content: '// v2.1.0 - BROKEN\nthrow new Error("oops");' },
        { type: 'directory', name: 'backups', children: [
          { type: 'file', name: 'app-stable.js', content: '// v2.0.0 - STABLE\nconst app = require("express")();\napp.listen(3000);' },
        ]},
      ]}]}],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Step 1: `mv app.js backups/app-broken.js`' },
      { text: 'Step 2: `cp backups/app-stable.js app.js`' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'fileExists', path: '/home/user/backups/app-broken.js' },
        { type: 'fileContains', path: '/home/user/app.js', substring: 'STABLE' },
        { type: 'fileNotContains', path: '/home/user/app.js', substring: 'BROKEN' },
      ],
    },
    xpReward: 125,
  },

  // Chapter 3: Going Pro
  {
    id: 'startup-3-1',
    arcId: 'startup',
    chapter: 3,
    position: 1,
    title: 'Deploy Script',
    objective: 'Create a deploy.sh script by writing commands to it with echo and >>',
    briefing: "We can't keep deploying manually. Write a deploy script.",
    dialogue: [
      {
        character: 'Priya',
        message:
          "We need automation. Create `deploy.sh` with three lines: a header, an echo step, and a done message. Use `>` for the first line and `>>` for the rest.",
        trigger: { type: 'levelStart' },
      },
    ],
    initialFS: {
      type: 'directory', name: '', children: [{ type: 'directory', name: 'home', children: [{ type: 'directory', name: 'user', children: []}]}],
    },
    startingPath: '/home/user',
    hints: [
      { text: '`echo "#!/bin/bash" > deploy.sh`' },
      { text: '`echo "echo Deploying..." >> deploy.sh`' },
      { text: '`echo "echo Deploy complete!" >> deploy.sh`' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'fileExists', path: '/home/user/deploy.sh' },
        { type: 'fileContains', path: '/home/user/deploy.sh', substring: '#!/bin/bash' },
        { type: 'fileContains', path: '/home/user/deploy.sh', substring: 'Deploy' },
      ],
    },
    xpReward: 100,
  },
  {
    id: 'startup-3-2',
    arcId: 'startup',
    chapter: 3,
    position: 2,
    title: 'Config Management',
    objective: 'Create config files for dev and prod environments with proper env vars',
    briefing: "Different environments need different configs. Let's set them up properly.",
    dialogue: [
      {
        character: 'Marcus',
        message:
          "Create `config/dev.env` with `NODE_ENV=development` and `config/prod.env` with `NODE_ENV=production`. Then set `DEPLOY_ENV=staging` for our next deploy.",
        trigger: { type: 'levelStart' },
      },
    ],
    initialFS: {
      type: 'directory', name: '', children: [{ type: 'directory', name: 'home', children: [{ type: 'directory', name: 'user', children: [
        { type: 'directory', name: 'config', children: [] },
      ]}]}],
    },
    startingPath: '/home/user',
    hints: [
      { text: '`echo "NODE_ENV=development" > config/dev.env`' },
      { text: '`echo "NODE_ENV=production" > config/prod.env`' },
      { text: '`export DEPLOY_ENV=staging`' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'fileExists', path: '/home/user/config/dev.env' },
        { type: 'fileContains', path: '/home/user/config/dev.env', substring: 'development' },
        { type: 'fileExists', path: '/home/user/config/prod.env' },
        { type: 'fileContains', path: '/home/user/config/prod.env', substring: 'production' },
        { type: 'envVar', name: 'DEPLOY_ENV', value: 'staging' },
      ],
    },
    xpReward: 125,
  },
  {
    id: 'startup-3-3',
    arcId: 'startup',
    chapter: 3,
    position: 3,
    title: 'Ship It!',
    objective: 'Generate a deployment report: grep successful deploys from the log, count them, save to deploy-report.txt, set STATUS=shipped',
    briefing: "The investors are watching. Time to prove we can ship reliably.",
    dialogue: [
      {
        character: 'Priya',
        message:
          "Final task. We need a deployment report for the investors. Grep for 'SUCCESS' in `deploy.log`, save to `deploy-report.txt`. Set `STATUS=shipped`. Show them we've got this under control.",
        trigger: { type: 'levelStart' },
      },
      {
        character: 'Marcus',
        message:
          "We did it! From chaos to a real deployment pipeline. Priya says the investors are impressed. Welcome to the team — for real this time.",
        trigger: { type: 'commandExecuted', command: 'export' },
      },
    ],
    initialFS: {
      type: 'directory', name: '', children: [{ type: 'directory', name: 'home', children: [{ type: 'directory', name: 'user', children: [
        { type: 'file', name: 'deploy.log', content: 'v2.0.0 SUCCESS deployed in 12s\nv2.0.1 FAILED rollback triggered\nv2.0.2 SUCCESS deployed in 8s\nv2.0.3 SUCCESS deployed in 11s\nv2.1.0 FAILED timeout\nv2.1.1 SUCCESS deployed in 9s\nv2.1.2 SUCCESS deployed in 7s' },
      ]}]}],
    },
    startingPath: '/home/user',
    hints: [
      { text: '`grep SUCCESS deploy.log > deploy-report.txt`' },
      { text: '`export STATUS=shipped`' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'fileExists', path: '/home/user/deploy-report.txt' },
        { type: 'fileContains', path: '/home/user/deploy-report.txt', substring: 'SUCCESS' },
        { type: 'fileNotContains', path: '/home/user/deploy-report.txt', substring: 'FAILED' },
        { type: 'envVar', name: 'STATUS', value: 'shipped' },
      ],
    },
    xpReward: 250,
    par: 2,
  },
];
