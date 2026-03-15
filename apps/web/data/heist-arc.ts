import type { Level } from '@cli-quest/shared';

export const heistLevels: Level[] = [
  // Chapter 1: The Job
  {
    id: 'heist-1-1',
    arcId: 'heist',
    chapter: 1,
    position: 1,
    title: 'The Brief',
    objective: 'Navigate to the case-files directory and read the assignment',
    briefing:
      "You're a digital forensics analyst. A major data breach has been reported. The evidence is spread across dozens of files. Your job: find the truth.",
    dialogue: [
      {
        character: 'Director Chen',
        message:
          "Agent, we have a breach. A company called DataVault lost 2 million customer records last night. Your case files are in `case-files/`. Read the `assignment.txt` to get started.",
        trigger: { type: 'levelStart' },
      },
    ],
    initialFS: {
      type: 'directory', name: '', children: [{ type: 'directory', name: 'home', children: [{ type: 'directory', name: 'user', children: [
        { type: 'directory', name: 'case-files', children: [
          { type: 'file', name: 'assignment.txt', content: 'CASE #7291 - DataVault Breach\nDate: March 2024\nClient: DataVault Inc.\nBreach Type: Unauthorized data exfiltration\nSuspected vector: Internal employee\n\nEvidence collected:\n- Server access logs\n- Employee activity reports\n- Network traffic captures\n- Database query logs\n\nYour task: Identify the perpetrator and the method of exfiltration.' },
          { type: 'file', name: 'employees.csv', content: 'name,role,access_level\nSarah Kim,DBA,admin\nJames Liu,DevOps,admin\nMaria Santos,Analyst,read\nAlex Chen,Engineer,write\nRaj Patel,Manager,read' },
        ]},
      ]}]}],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Use `cd case-files` then `cat assignment.txt`' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'commandUsed', command: 'cat' },
        { type: 'outputContains', substring: 'DataVault Breach' },
      ],
    },
    xpReward: 50,
  },
  {
    id: 'heist-1-2',
    arcId: 'heist',
    chapter: 1,
    position: 2,
    title: 'Employee Roster',
    objective: 'Read the employee list and find who has admin access using grep',
    briefing: 'The breach required admin access. Who has it?',
    dialogue: [
      {
        character: 'Director Chen',
        message:
          "The exfiltration used admin-level database queries. Check `employees.csv` — grep for 'admin' to narrow down our suspects.",
        trigger: { type: 'levelStart' },
      },
    ],
    initialFS: {
      type: 'directory', name: '', children: [{ type: 'directory', name: 'home', children: [{ type: 'directory', name: 'user', children: [
        { type: 'file', name: 'employees.csv', content: 'name,role,access_level\nSarah Kim,DBA,admin\nJames Liu,DevOps,admin\nMaria Santos,Analyst,read\nAlex Chen,Engineer,write\nRaj Patel,Manager,read' },
      ]}]}],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Use `grep admin employees.csv` to find admin users' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'commandUsed', command: 'grep' },
        { type: 'outputContains', substring: 'Sarah Kim' },
        { type: 'outputContains', substring: 'James Liu' },
      ],
    },
    xpReward: 75,
  },
  {
    id: 'heist-1-3',
    arcId: 'heist',
    chapter: 1,
    position: 3,
    title: 'Access Logs',
    objective: 'Find all after-hours access entries (entries containing "02:" or "03:" or "04:") in access.log',
    briefing: 'The breach happened between 2am and 5am. Who was active?',
    dialogue: [
      {
        character: 'Director Chen',
        message:
          "Check the access logs for activity between 2am-5am. Use `grep` to find entries with timestamps in that window. Try `grep -i \"0[2-4]:\" access.log`.",
        trigger: { type: 'levelStart' },
      },
    ],
    initialFS: {
      type: 'directory', name: '', children: [{ type: 'directory', name: 'home', children: [{ type: 'directory', name: 'user', children: [
        { type: 'file', name: 'access.log', content: '2024-03-14 09:00 sarah.kim LOGIN\n2024-03-14 09:15 james.liu LOGIN\n2024-03-14 17:30 sarah.kim LOGOUT\n2024-03-14 17:45 james.liu LOGOUT\n2024-03-15 02:14 james.liu LOGIN\n2024-03-15 02:17 james.liu QUERY SELECT * FROM customers\n2024-03-15 02:45 james.liu QUERY SELECT * FROM payments\n2024-03-15 03:12 james.liu EXPORT customers.csv\n2024-03-15 03:30 james.liu EXPORT payments.csv\n2024-03-15 04:01 james.liu LOGOUT\n2024-03-15 09:00 sarah.kim LOGIN\n2024-03-15 09:05 maria.santos LOGIN' },
      ]}]}],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Try `grep "0[2-4]:" access.log` to match 02:, 03:, 04: timestamps' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'commandUsed', command: 'grep' },
        { type: 'outputContains', substring: 'james.liu' },
        { type: 'outputContains', substring: 'EXPORT' },
      ],
    },
    xpReward: 100,
  },

  // Chapter 2: The Evidence
  {
    id: 'heist-2-1',
    arcId: 'heist',
    chapter: 2,
    position: 1,
    title: 'Query Analysis',
    objective: 'Extract all QUERY and EXPORT entries from the access log, sort them, save to evidence/queries.txt',
    briefing: "James Liu is our prime suspect. Let's compile the database queries he ran.",
    dialogue: [
      {
        character: 'Director Chen',
        message:
          "Liu accessed the database at 2am and exported data. Extract all QUERY and EXPORT entries from the log, sort them, and save to `evidence/queries.txt`.",
        trigger: { type: 'levelStart' },
      },
    ],
    initialFS: {
      type: 'directory', name: '', children: [{ type: 'directory', name: 'home', children: [{ type: 'directory', name: 'user', children: [
        { type: 'file', name: 'access.log', content: '2024-03-15 02:14 james.liu LOGIN\n2024-03-15 02:17 james.liu QUERY SELECT * FROM customers\n2024-03-15 02:30 james.liu QUERY SELECT * FROM users WHERE role=admin\n2024-03-15 02:45 james.liu QUERY SELECT * FROM payments\n2024-03-15 03:00 james.liu QUERY SELECT email,phone FROM customers\n2024-03-15 03:12 james.liu EXPORT customers.csv\n2024-03-15 03:30 james.liu EXPORT payments.csv\n2024-03-15 04:01 james.liu LOGOUT' },
        { type: 'directory', name: 'evidence', children: [] },
      ]}]}],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Use `grep "QUERY\\|EXPORT" access.log | sort > evidence/queries.txt`' },
      { text: 'Or do it in two steps: grep QUERY, then grep EXPORT and append' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'fileExists', path: '/home/user/evidence/queries.txt' },
        { type: 'fileContains', path: '/home/user/evidence/queries.txt', substring: 'QUERY' },
        { type: 'fileContains', path: '/home/user/evidence/queries.txt', substring: 'EXPORT' },
      ],
    },
    xpReward: 125,
  },
  {
    id: 'heist-2-2',
    arcId: 'heist',
    chapter: 2,
    position: 2,
    title: 'Data Volume',
    objective: 'Count the number of records in each exported file and the total',
    briefing: 'How much data was stolen? Count the records.',
    dialogue: [
      {
        character: 'Director Chen',
        message:
          "We recovered the exported files. Count the lines in each one using `wc -l`. The first line is a header, so actual records = lines - 1.",
        trigger: { type: 'levelStart' },
      },
    ],
    initialFS: {
      type: 'directory', name: '', children: [{ type: 'directory', name: 'home', children: [{ type: 'directory', name: 'user', children: [
        { type: 'file', name: 'customers.csv', content: 'email,name,phone,address\njohn@test.com,John,555-0001,123 Main St\njane@test.com,Jane,555-0002,456 Oak Ave\nbob@test.com,Bob,555-0003,789 Pine Rd\nalice@test.com,Alice,555-0004,321 Elm St\ncharlie@test.com,Charlie,555-0005,654 Maple Dr' },
        { type: 'file', name: 'payments.csv', content: 'customer_email,amount,card_last4,date\njohn@test.com,99.99,4242,2024-03-01\njane@test.com,149.99,1234,2024-03-02\nbob@test.com,49.99,5678,2024-03-03' },
      ]}]}],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Use `wc -l customers.csv` and `wc -l payments.csv`' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'commandUsed', command: 'wc' },
      ],
    },
    xpReward: 75,
  },
  {
    id: 'heist-2-3',
    arcId: 'heist',
    chapter: 2,
    position: 3,
    title: 'Network Trace',
    objective: 'Find the external IP in the network log, sort the connections, save unique destinations to evidence/destinations.txt',
    briefing: 'Where did the data go? The network logs show outbound connections.',
    dialogue: [
      {
        character: 'Director Chen',
        message:
          "The network team captured outbound traffic during the breach window. Find connections to external IPs — anything not starting with `10.` or `192.168.`. Sort and deduplicate, save to evidence.",
        trigger: { type: 'levelStart' },
      },
    ],
    initialFS: {
      type: 'directory', name: '', children: [{ type: 'directory', name: 'home', children: [{ type: 'directory', name: 'user', children: [
        { type: 'file', name: 'network.log', content: '02:15 10.0.0.50 -> 10.0.0.1 SSH\n02:17 10.0.0.50 -> 10.0.0.5 POSTGRES\n02:45 10.0.0.50 -> 10.0.0.5 POSTGRES\n03:10 10.0.0.50 -> 45.33.32.156 HTTPS\n03:12 10.0.0.50 -> 45.33.32.156 HTTPS\n03:30 10.0.0.50 -> 45.33.32.156 HTTPS\n03:31 10.0.0.50 -> 198.51.100.42 HTTPS\n03:45 10.0.0.50 -> 192.168.1.1 DNS\n04:00 10.0.0.50 -> 45.33.32.156 HTTPS' },
        { type: 'directory', name: 'evidence', children: [] },
      ]}]}],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Grep for external IPs: `grep -v "10.0.0\\|192.168" network.log | sort | uniq > evidence/destinations.txt`' },
      { text: 'Or grep for the specific suspicious IPs you see in the log' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'fileExists', path: '/home/user/evidence/destinations.txt' },
        { type: 'fileContains', path: '/home/user/evidence/destinations.txt', substring: '45.33.32.156' },
        { type: 'commandUsed', command: 'sort' },
      ],
    },
    xpReward: 150,
    par: 1,
  },

  // Chapter 3: The Report
  {
    id: 'heist-3-1',
    arcId: 'heist',
    chapter: 3,
    position: 1,
    title: 'Building the Timeline',
    objective: 'Create a timeline.txt with the key events sorted chronologically',
    briefing: "Compile the evidence into a coherent timeline for the prosecutors.",
    dialogue: [
      {
        character: 'Director Chen',
        message:
          "We need a timeline. Write the key events to `timeline.txt` — login time, each query, exports, and logout. Use echo and >> to build it line by line.",
        trigger: { type: 'levelStart' },
      },
    ],
    initialFS: {
      type: 'directory', name: '', children: [{ type: 'directory', name: 'home', children: [{ type: 'directory', name: 'user', children: [
        { type: 'file', name: 'notes.txt', content: '02:14 - Liu logged in\n02:17 - First query (customers)\n03:12 - Exported customers.csv\n03:30 - Exported payments.csv\n04:01 - Liu logged out' },
      ]}]}],
    },
    startingPath: '/home/user',
    hints: [
      { text: '`echo "02:14 - Suspect logged into database server" > timeline.txt`' },
      { text: 'Then use >> to append each subsequent event' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'fileExists', path: '/home/user/timeline.txt' },
        { type: 'fileContains', path: '/home/user/timeline.txt', substring: '02:14' },
        { type: 'fileContains', path: '/home/user/timeline.txt', substring: '04:01' },
      ],
    },
    xpReward: 100,
  },
  {
    id: 'heist-3-2',
    arcId: 'heist',
    chapter: 3,
    position: 2,
    title: 'Secure the Evidence',
    objective: 'Copy all evidence files to a locked-evidence directory and make them read-only',
    briefing: 'Evidence must be preserved and tamper-proof for court.',
    dialogue: [
      {
        character: 'Director Chen',
        message:
          "Create `locked-evidence/`, copy everything from `evidence/` there. Then `chmod 444` each file to make them read-only. Chain of custody requires this.",
        trigger: { type: 'levelStart' },
      },
    ],
    initialFS: {
      type: 'directory', name: '', children: [{ type: 'directory', name: 'home', children: [{ type: 'directory', name: 'user', children: [
        { type: 'directory', name: 'evidence', children: [
          { type: 'file', name: 'queries.txt', content: 'QUERY SELECT * FROM customers\nEXPORT customers.csv' },
          { type: 'file', name: 'destinations.txt', content: '45.33.32.156\n198.51.100.42' },
        ]},
      ]}]}],
    },
    startingPath: '/home/user',
    hints: [
      { text: '`mkdir locked-evidence`' },
      { text: '`cp evidence/queries.txt locked-evidence/queries.txt`' },
      { text: '`chmod 444 locked-evidence/queries.txt`' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'fileExists', path: '/home/user/locked-evidence/queries.txt' },
        { type: 'fileExists', path: '/home/user/locked-evidence/destinations.txt' },
        { type: 'commandUsed', command: 'chmod' },
      ],
    },
    xpReward: 125,
  },
  {
    id: 'heist-3-3',
    arcId: 'heist',
    chapter: 3,
    position: 3,
    title: 'Case Closed',
    objective: 'Write the final report: suspect name, method, data volume, external server, set CASE_STATUS=closed',
    briefing: "Compile the final report. This goes straight to the DA's office.",
    dialogue: [
      {
        character: 'Director Chen',
        message:
          "Final report time. Write to `final-report.txt`: the suspect (James Liu), method (admin database queries at 2am), data exfiltrated (customers + payments), destination IP (45.33.32.156). Set `CASE_STATUS=closed`.",
        trigger: { type: 'levelStart' },
      },
      {
        character: 'Director Chen',
        message:
          "Outstanding work, Agent. James Liu has been arrested. The stolen data was recovered from the external server. DataVault's customers are safe. You've earned your reputation. Case #7291 — closed.",
        trigger: { type: 'commandExecuted', command: 'export' },
      },
    ],
    initialFS: {
      type: 'directory', name: '', children: [{ type: 'directory', name: 'home', children: [{ type: 'directory', name: 'user', children: []}]}],
    },
    startingPath: '/home/user',
    hints: [
      { text: '`echo "SUSPECT: James Liu" > final-report.txt`' },
      { text: '`echo "METHOD: Admin database access at 02:14" >> final-report.txt`' },
      { text: '`echo "DESTINATION: 45.33.32.156" >> final-report.txt`' },
      { text: '`export CASE_STATUS=closed`' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'fileExists', path: '/home/user/final-report.txt' },
        { type: 'fileContains', path: '/home/user/final-report.txt', substring: 'James Liu' },
        { type: 'fileContains', path: '/home/user/final-report.txt', substring: '45.33.32.156' },
        { type: 'envVar', name: 'CASE_STATUS', value: 'closed' },
      ],
    },
    xpReward: 300,
    par: 4,
  },
];
