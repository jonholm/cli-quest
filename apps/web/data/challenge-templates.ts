import type { FSNode, ValidatorConfig } from '@cli-quest/shared';

export type ChallengeTemplate = {
  tier: 'quick' | 'standard' | 'hard';
  title: string;
  objective: string;
  fs: FSNode;
  validator: ValidatorConfig;
  xpReward: number;
};

function homeFS(children: FSNode[]): FSNode {
  return { type: 'directory', name: '', children: [
    { type: 'directory', name: 'home', children: [
      { type: 'directory', name: 'user', children },
    ]},
  ]};
}

export const templates: ChallengeTemplate[] = [
  // ========== QUICK (10) ==========
  {
    tier: 'quick', title: 'Find the File', objective: 'Use find to locate all .log files',
    xpReward: 25,
    fs: homeFS([
      { type: 'directory', name: 'logs', children: [
        { type: 'file', name: 'app.log', content: 'app log' },
        { type: 'file', name: 'error.log', content: 'error log' },
        { type: 'file', name: 'config.yml', content: 'port: 3000' },
      ]},
    ]),
    validator: { type: 'all', conditions: [{ type: 'commandUsed', command: 'find' }, { type: 'outputContains', substring: 'app.log' }] },
  },
  {
    tier: 'quick', title: 'Count Lines', objective: 'Count the number of lines in data.txt',
    xpReward: 25,
    fs: homeFS([{ type: 'file', name: 'data.txt', content: 'alpha\nbeta\ngamma\ndelta\nepsilon' }]),
    validator: { type: 'all', conditions: [{ type: 'commandUsed', command: 'wc' }, { type: 'outputContains', substring: '5' }] },
  },
  {
    tier: 'quick', title: 'Create and Navigate', objective: 'Create a directory called "work" and navigate into it',
    xpReward: 25,
    fs: homeFS([]),
    validator: { type: 'all', conditions: [{ type: 'fileExists', path: '/home/user/work' }, { type: 'currentPath', path: '/home/user/work' }] },
  },
  {
    tier: 'quick', title: 'Read the Manual', objective: 'Use man to see the help for the grep command',
    xpReward: 25,
    fs: homeFS([]),
    validator: { type: 'all', conditions: [{ type: 'commandUsed', command: 'man' }, { type: 'outputContains', substring: 'grep' }] },
  },
  {
    tier: 'quick', title: 'Quick Delete', objective: 'Remove the file called trash.txt',
    xpReward: 25,
    fs: homeFS([
      { type: 'file', name: 'keep.txt', content: 'important' },
      { type: 'file', name: 'trash.txt', content: 'delete me' },
    ]),
    validator: { type: 'all', conditions: [{ type: 'fileNotExists', path: '/home/user/trash.txt' }, { type: 'fileExists', path: '/home/user/keep.txt' }] },
  },
  {
    tier: 'quick', title: 'Head Start', objective: 'Show the first 3 lines of log.txt',
    xpReward: 25,
    fs: homeFS([{ type: 'file', name: 'log.txt', content: 'line 1\nline 2\nline 3\nline 4\nline 5\nline 6' }]),
    validator: { type: 'all', conditions: [{ type: 'commandUsed', command: 'head' }, { type: 'outputContains', substring: 'line 3' }] },
  },
  {
    tier: 'quick', title: 'Tail End', objective: 'Show the last 2 lines of notes.txt',
    xpReward: 25,
    fs: homeFS([{ type: 'file', name: 'notes.txt', content: 'note A\nnote B\nnote C\nnote D\nnote E' }]),
    validator: { type: 'all', conditions: [{ type: 'commandUsed', command: 'tail' }, { type: 'outputContains', substring: 'note E' }] },
  },
  {
    tier: 'quick', title: 'Echo Chamber', objective: 'Write "hello world" to a file called greeting.txt',
    xpReward: 25,
    fs: homeFS([]),
    validator: { type: 'all', conditions: [{ type: 'fileExists', path: '/home/user/greeting.txt' }, { type: 'fileContains', path: '/home/user/greeting.txt', substring: 'hello world' }] },
  },
  {
    tier: 'quick', title: 'Where Am I?', objective: 'Navigate to /home and use pwd to confirm',
    xpReward: 25,
    fs: homeFS([]),
    validator: { type: 'all', conditions: [{ type: 'currentPath', path: '/home' }, { type: 'commandUsed', command: 'pwd' }] },
  },
  {
    tier: 'quick', title: 'Copy Cat', objective: 'Copy readme.txt to backup.txt',
    xpReward: 25,
    fs: homeFS([{ type: 'file', name: 'readme.txt', content: 'project readme' }]),
    validator: { type: 'all', conditions: [{ type: 'fileExists', path: '/home/user/backup.txt' }, { type: 'fileExists', path: '/home/user/readme.txt' }] },
  },

  // ========== STANDARD (10) ==========
  {
    tier: 'standard', title: 'Log Analysis', objective: 'Find all ERROR lines in server.log and count them',
    xpReward: 50,
    fs: homeFS([{ type: 'file', name: 'server.log', content: 'INFO: started\nERROR: connection refused\nINFO: retrying\nERROR: timeout\nINFO: connected\nERROR: disk full\nINFO: cleanup done' }]),
    validator: { type: 'all', conditions: [{ type: 'commandUsed', command: 'grep' }, { type: 'commandUsed', command: 'wc' }, { type: 'outputContains', substring: '3' }] },
  },
  {
    tier: 'standard', title: 'File Organizer', objective: 'Move report.txt to archive/ and copy config.yml to backup/',
    xpReward: 50,
    fs: homeFS([
      { type: 'file', name: 'report.txt', content: 'quarterly report' },
      { type: 'file', name: 'config.yml', content: 'env: production' },
      { type: 'directory', name: 'archive', children: [] },
      { type: 'directory', name: 'backup', children: [] },
    ]),
    validator: { type: 'all', conditions: [
      { type: 'fileExists', path: '/home/user/archive/report.txt' },
      { type: 'fileNotExists', path: '/home/user/report.txt' },
      { type: 'fileExists', path: '/home/user/backup/config.yml' },
      { type: 'fileExists', path: '/home/user/config.yml' },
    ]},
  },
  {
    tier: 'standard', title: 'Data Pipeline', objective: 'Sort the names file and save unique entries to output.txt',
    xpReward: 50,
    fs: homeFS([{ type: 'file', name: 'names.txt', content: 'Charlie\nAlice\nBob\nAlice\nDave\nBob\nEve' }]),
    validator: { type: 'all', conditions: [
      { type: 'fileExists', path: '/home/user/output.txt' },
      { type: 'fileContains', path: '/home/user/output.txt', substring: 'Alice' },
      { type: 'commandUsed', command: 'sort' },
    ]},
  },
  {
    tier: 'standard', title: 'Search and Save', objective: 'Grep for "WARNING" in system.log and redirect results to warnings.txt',
    xpReward: 50,
    fs: homeFS([{ type: 'file', name: 'system.log', content: 'OK: boot complete\nWARNING: disk 80% full\nOK: network up\nWARNING: high memory usage\nOK: cron started\nWARNING: outdated packages' }]),
    validator: { type: 'all', conditions: [
      { type: 'fileExists', path: '/home/user/warnings.txt' },
      { type: 'fileContains', path: '/home/user/warnings.txt', substring: 'WARNING' },
    ]},
  },
  {
    tier: 'standard', title: 'Directory Cleanup', objective: 'Remove all files in temp/ but keep the directory itself',
    xpReward: 50,
    fs: homeFS([
      { type: 'directory', name: 'temp', children: [
        { type: 'file', name: 'a.tmp', content: '' },
        { type: 'file', name: 'b.tmp', content: '' },
        { type: 'file', name: 'c.tmp', content: '' },
      ]},
    ]),
    validator: { type: 'all', conditions: [
      { type: 'fileExists', path: '/home/user/temp' },
      { type: 'fileNotExists', path: '/home/user/temp/a.tmp' },
      { type: 'fileNotExists', path: '/home/user/temp/b.tmp' },
      { type: 'fileNotExists', path: '/home/user/temp/c.tmp' },
    ]},
  },
  {
    tier: 'standard', title: 'Env Setup', objective: 'Set DB_HOST to "localhost" and DB_PORT to "5432" using export',
    xpReward: 50,
    fs: homeFS([]),
    validator: { type: 'all', conditions: [
      { type: 'envVar', name: 'DB_HOST', value: 'localhost' },
      { type: 'envVar', name: 'DB_PORT', value: '5432' },
    ]},
  },
  {
    tier: 'standard', title: 'Word Counter', objective: 'Count the total words across all .txt files (use cat and wc)',
    xpReward: 50,
    fs: homeFS([
      { type: 'file', name: 'a.txt', content: 'one two three' },
      { type: 'file', name: 'b.txt', content: 'four five' },
      { type: 'file', name: 'notes.md', content: 'not this' },
    ]),
    validator: { type: 'all', conditions: [{ type: 'commandUsed', command: 'wc' }] },
  },
  {
    tier: 'standard', title: 'Rename Chain', objective: 'Rename draft.txt to final.txt, then copy final.txt to published/',
    xpReward: 50,
    fs: homeFS([
      { type: 'file', name: 'draft.txt', content: 'my article' },
      { type: 'directory', name: 'published', children: [] },
    ]),
    validator: { type: 'all', conditions: [
      { type: 'fileNotExists', path: '/home/user/draft.txt' },
      { type: 'fileExists', path: '/home/user/final.txt' },
      { type: 'fileExists', path: '/home/user/published/final.txt' },
    ]},
  },
  {
    tier: 'standard', title: 'Case Detective', objective: 'Find all lines containing "error" (case insensitive) in mixed.log',
    xpReward: 50,
    fs: homeFS([{ type: 'file', name: 'mixed.log', content: 'ERROR: crash\ninfo: ok\nerror: timeout\nInfo: retry\nError: bad input\nINFO: done' }]),
    validator: { type: 'all', conditions: [
      { type: 'commandUsed', command: 'grep' },
      { type: 'outputContains', substring: 'crash' },
      { type: 'outputContains', substring: 'timeout' },
      { type: 'outputContains', substring: 'bad input' },
    ]},
  },
  {
    tier: 'standard', title: 'Project Setup', objective: 'Create src/ and tests/ directories, with an index.ts in src/ and setup.ts in tests/',
    xpReward: 50,
    fs: homeFS([]),
    validator: { type: 'all', conditions: [
      { type: 'fileExists', path: '/home/user/src/index.ts' },
      { type: 'fileExists', path: '/home/user/tests/setup.ts' },
    ]},
  },

  // ========== HARD (10) ==========
  {
    tier: 'hard', title: 'Incident Response', objective: 'Find all 403 responses in access.log and save them to report.txt',
    xpReward: 100,
    fs: homeFS([{ type: 'file', name: 'access.log', content: '10.0.0.1 GET /api 200\n10.0.0.5 GET /admin 403\n10.0.0.1 GET /api 200\n10.0.0.5 GET /admin/config 403\n10.0.0.3 POST /login 401\n10.0.0.5 GET /admin/users 403\n10.0.0.7 GET /secret 403\n10.0.0.1 GET /api 200' }]),
    validator: { type: 'all', conditions: [
      { type: 'fileExists', path: '/home/user/report.txt' },
      { type: 'fileContains', path: '/home/user/report.txt', substring: '403' },
      { type: 'commandUsed', command: 'grep' },
    ]},
  },
  {
    tier: 'hard', title: 'Environment Deploy', objective: 'Set APP_ENV to "production", create deploy/, write the env var to deploy/config.txt',
    xpReward: 100,
    fs: homeFS([]),
    validator: { type: 'all', conditions: [
      { type: 'envVar', name: 'APP_ENV', value: 'production' },
      { type: 'fileExists', path: '/home/user/deploy/config.txt' },
      { type: 'fileContains', path: '/home/user/deploy/config.txt', substring: 'production' },
    ]},
  },
  {
    tier: 'hard', title: 'Log Forensics', objective: 'Extract unique IP addresses from access.log, sort them, save to ips.txt',
    xpReward: 100,
    fs: homeFS([{ type: 'file', name: 'access.log', content: '192.168.1.1 GET / 200\n10.0.0.5 GET /admin 403\n192.168.1.1 GET /api 200\n10.0.0.5 POST /login 401\n172.16.0.1 GET /health 200\n10.0.0.5 GET /admin 403\n172.16.0.1 GET / 200' }]),
    validator: { type: 'all', conditions: [
      { type: 'fileExists', path: '/home/user/ips.txt' },
      { type: 'commandUsed', command: 'sort' },
    ]},
  },
  {
    tier: 'hard', title: 'Backup Rotation', objective: 'Copy all 3 config files to backup/, remove the originals, verify backup has them',
    xpReward: 100,
    fs: homeFS([
      { type: 'file', name: 'app.conf', content: 'app config' },
      { type: 'file', name: 'db.conf', content: 'db config' },
      { type: 'file', name: 'web.conf', content: 'web config' },
      { type: 'directory', name: 'backup', children: [] },
    ]),
    validator: { type: 'all', conditions: [
      { type: 'fileExists', path: '/home/user/backup/app.conf' },
      { type: 'fileExists', path: '/home/user/backup/db.conf' },
      { type: 'fileExists', path: '/home/user/backup/web.conf' },
      { type: 'fileNotExists', path: '/home/user/app.conf' },
      { type: 'fileNotExists', path: '/home/user/db.conf' },
      { type: 'fileNotExists', path: '/home/user/web.conf' },
    ]},
  },
  {
    tier: 'hard', title: 'Multi-Stage Pipeline', objective: 'Find ERROR lines in logs, sort them, remove duplicates, save to summary.txt',
    xpReward: 100,
    fs: homeFS([{ type: 'file', name: 'app.log', content: 'ERROR: timeout\nINFO: ok\nERROR: disk full\nERROR: timeout\nINFO: restart\nERROR: auth failed\nERROR: disk full\nINFO: recovered' }]),
    validator: { type: 'all', conditions: [
      { type: 'fileExists', path: '/home/user/summary.txt' },
      { type: 'fileContains', path: '/home/user/summary.txt', substring: 'ERROR' },
      { type: 'commandUsed', command: 'grep' },
      { type: 'commandUsed', command: 'sort' },
    ]},
  },
  {
    tier: 'hard', title: 'Server Migration', objective: 'Create new-server/, move all .conf files there, set SERVER_ENV=migrated',
    xpReward: 100,
    fs: homeFS([
      { type: 'file', name: 'nginx.conf', content: 'server { listen 80; }' },
      { type: 'file', name: 'redis.conf', content: 'port 6379' },
      { type: 'file', name: 'readme.txt', content: 'do not move' },
    ]),
    validator: { type: 'all', conditions: [
      { type: 'fileExists', path: '/home/user/new-server/nginx.conf' },
      { type: 'fileExists', path: '/home/user/new-server/redis.conf' },
      { type: 'fileNotExists', path: '/home/user/nginx.conf' },
      { type: 'fileExists', path: '/home/user/readme.txt' },
      { type: 'envVar', name: 'SERVER_ENV', value: 'migrated' },
    ]},
  },
  {
    tier: 'hard', title: 'Build Script', objective: 'Write a multi-line build output to build.log using echo and >> (3 steps)',
    xpReward: 100,
    fs: homeFS([]),
    validator: { type: 'all', conditions: [
      { type: 'fileExists', path: '/home/user/build.log' },
      { type: 'fileContains', path: '/home/user/build.log', substring: 'BUILD' },
    ]},
  },
  {
    tier: 'hard', title: 'Data Merge', objective: 'Combine team-a.csv and team-b.csv, sort the result, save to all-teams.csv',
    xpReward: 100,
    fs: homeFS([
      { type: 'file', name: 'team-a.csv', content: 'Zara,eng\nAlice,design\nMike,pm' },
      { type: 'file', name: 'team-b.csv', content: 'Bob,eng\nCarol,qa\nDan,ops' },
    ]),
    validator: { type: 'all', conditions: [
      { type: 'fileExists', path: '/home/user/all-teams.csv' },
      { type: 'fileContains', path: '/home/user/all-teams.csv', substring: 'Alice' },
      { type: 'fileContains', path: '/home/user/all-teams.csv', substring: 'Bob' },
      { type: 'commandUsed', command: 'sort' },
    ]},
  },
  {
    tier: 'hard', title: 'Permission Audit', objective: 'Find the script.sh file, read it, make it read-only with chmod, move to quarantine/',
    xpReward: 100,
    fs: homeFS([
      { type: 'directory', name: 'scripts', children: [
        { type: 'file', name: 'script.sh', content: '#!/bin/bash\nrm -rf /', permissions: 'rwxrwxrwx' },
        { type: 'file', name: 'deploy.sh', content: '#!/bin/bash\necho deploy', permissions: 'rwxr-xr-x' },
      ]},
      { type: 'directory', name: 'quarantine', children: [] },
    ]),
    validator: { type: 'all', conditions: [
      { type: 'fileExists', path: '/home/user/quarantine/script.sh' },
      { type: 'fileNotExists', path: '/home/user/scripts/script.sh' },
      { type: 'commandUsed', command: 'chmod' },
      { type: 'commandUsed', command: 'mv' },
    ]},
  },
  {
    tier: 'hard', title: 'Full Stack Setup', objective: 'Create frontend/ and backend/ dirs with package.json in each, set NODE_ENV=development',
    xpReward: 100,
    fs: homeFS([]),
    validator: { type: 'all', conditions: [
      { type: 'fileExists', path: '/home/user/frontend/package.json' },
      { type: 'fileExists', path: '/home/user/backend/package.json' },
      { type: 'envVar', name: 'NODE_ENV', value: 'development' },
    ]},
  },
];
