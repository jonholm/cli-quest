import type { Level } from '@cli-quest/shared';

export const missionLevels: Level[] = [
  // Chapter 1: Arrival
  {
    id: 'mission-1-1',
    arcId: 'mission',
    chapter: 1,
    position: 1,
    title: 'Docking Complete',
    objective: 'Navigate to the station control directory and list the systems',
    briefing:
      "Welcome to the International Space Station Artemis. You've just docked. Time to check in with the station systems.",
    dialogue: [
      {
        character: 'NOVA',
        message:
          "Welcome aboard Station Artemis, Commander. I'm NOVA, the station AI. Let's start by checking the control systems. Use `cd station-control` then `ls` to see what we're working with.",
        trigger: { type: 'levelStart' },
      },
    ],
    initialFS: {
      type: 'directory',
      name: '',
      children: [
        { type: 'directory', name: 'home', children: [
          { type: 'directory', name: 'user', children: [
            { type: 'file', name: 'mission-brief.txt', content: 'MISSION: Routine maintenance and system diagnostics\nDuration: 72 hours\nCrew: Commander (you), NOVA (AI)' },
            { type: 'directory', name: 'station-control', children: [
              { type: 'file', name: 'life-support.status', content: 'O2: 98%\nCO2 Scrubbers: ACTIVE\nTemp: 22°C\nHumidity: 45%' },
              { type: 'file', name: 'power.status', content: 'Solar Array A: ONLINE\nSolar Array B: ONLINE\nBattery: 87%\nConsumption: 12.4kW' },
              { type: 'file', name: 'comms.status', content: 'Ground Link: ACTIVE\nBandwidth: 150Mbps\nLatency: 1.2s\nNext Window: 14:30 UTC' },
              { type: 'file', name: 'navigation.status', content: 'Orbit: 408km\nVelocity: 7.66km/s\nInclination: 51.6°\nNext Reboost: 48h' },
            ]},
          ]},
        ]},
      ],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Use `cd station-control` to enter the control directory' },
      { text: 'Then use `ls` to see all status files' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'currentPath', path: '/home/user/station-control' },
        { type: 'commandUsed', command: 'ls' },
      ],
    },
    xpReward: 50,
  },
  {
    id: 'mission-1-2',
    arcId: 'mission',
    chapter: 1,
    position: 2,
    title: 'Systems Check',
    objective: 'Read the life-support status and the power status',
    briefing: 'Standard procedure: check life support and power before starting any maintenance.',
    dialogue: [
      {
        character: 'NOVA',
        message:
          'Read the life-support and power status files using `cat`. These are your lifeline up here — always check them first.',
        trigger: { type: 'levelStart' },
      },
    ],
    initialFS: {
      type: 'directory',
      name: '',
      children: [
        { type: 'directory', name: 'home', children: [
          { type: 'directory', name: 'user', children: [
            { type: 'directory', name: 'station-control', children: [
              { type: 'file', name: 'life-support.status', content: 'O2: 98%\nCO2 Scrubbers: ACTIVE\nTemp: 22°C\nHumidity: 45%' },
              { type: 'file', name: 'power.status', content: 'Solar Array A: ONLINE\nSolar Array B: OFFLINE\nBattery: 47%\nConsumption: 14.8kW\nWARNING: Array B malfunction detected' },
            ]},
          ]},
        ]},
      ],
    },
    startingPath: '/home/user/station-control',
    hints: [
      { text: 'Use `cat life-support.status` and `cat power.status`' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'commandUsed', command: 'cat' },
        { type: 'outputContains', substring: 'WARNING' },
      ],
    },
    xpReward: 50,
  },
  {
    id: 'mission-1-3',
    arcId: 'mission',
    chapter: 1,
    position: 3,
    title: 'Logging the Problem',
    objective: 'Create a maintenance-log directory and write the power warning to a report file',
    briefing: 'Solar Array B is offline. We need to start a maintenance log immediately.',
    dialogue: [
      {
        character: 'NOVA',
        message:
          'Array B is down — battery at 47%. Create a `maintenance-log` directory and use `echo` with `>` to write "Solar Array B: OFFLINE - malfunction" to `maintenance-log/report.txt`.',
        trigger: { type: 'levelStart' },
      },
    ],
    initialFS: {
      type: 'directory',
      name: '',
      children: [
        { type: 'directory', name: 'home', children: [
          { type: 'directory', name: 'user', children: [
            { type: 'file', name: 'power.status', content: 'Solar Array B: OFFLINE' },
          ]},
        ]},
      ],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'First: `mkdir maintenance-log`' },
      { text: 'Then: `echo "Solar Array B: OFFLINE - malfunction" > maintenance-log/report.txt`' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'fileExists', path: '/home/user/maintenance-log/report.txt' },
        { type: 'fileContains', path: '/home/user/maintenance-log/report.txt', substring: 'OFFLINE' },
      ],
    },
    xpReward: 75,
  },

  // Chapter 2: Diagnostics
  {
    id: 'mission-2-1',
    arcId: 'mission',
    chapter: 2,
    position: 1,
    title: 'Error Scan',
    objective: 'Search the system log for all ERROR entries',
    briefing: "The station has been logging anomalies. Time to scan for errors.",
    dialogue: [
      {
        character: 'NOVA',
        message:
          "I've been collecting system logs for the past 24 hours. Use `grep ERROR system.log` to find all the error entries.",
        trigger: { type: 'levelStart' },
      },
    ],
    initialFS: {
      type: 'directory',
      name: '',
      children: [
        { type: 'directory', name: 'home', children: [
          { type: 'directory', name: 'user', children: [
            { type: 'file', name: 'system.log', content: 'INFO: Life support nominal\nINFO: Comms check passed\nERROR: Solar Array B voltage drop\nINFO: Battery discharge rate normal\nERROR: Array B controller timeout\nINFO: Orbital correction scheduled\nERROR: Array B thermal sensor offline\nINFO: CO2 levels nominal\nWARN: Battery below 50%\nERROR: Array B communication lost' },
          ]},
        ]},
      ],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Use `grep ERROR system.log`' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'commandUsed', command: 'grep' },
        { type: 'outputContains', substring: 'voltage drop' },
      ],
    },
    xpReward: 75,
  },
  {
    id: 'mission-2-2',
    arcId: 'mission',
    chapter: 2,
    position: 2,
    title: 'Error Count',
    objective: 'Count how many ERROR entries are in the system log using a pipe',
    briefing: 'We need to quantify the failures. How many errors in the last 24 hours?',
    dialogue: [
      {
        character: 'NOVA',
        message:
          'Ground control needs a count. Pipe grep into wc: `grep ERROR system.log | wc -l`',
        trigger: { type: 'levelStart' },
      },
    ],
    initialFS: {
      type: 'directory',
      name: '',
      children: [
        { type: 'directory', name: 'home', children: [
          { type: 'directory', name: 'user', children: [
            { type: 'file', name: 'system.log', content: 'INFO: Life support nominal\nERROR: Solar Array B voltage drop\nINFO: Battery discharge rate normal\nERROR: Array B controller timeout\nINFO: Orbital correction scheduled\nERROR: Array B thermal sensor offline\nERROR: Array B communication lost' },
          ]},
        ]},
      ],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Use `grep ERROR system.log | wc -l` to count error lines' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'commandUsed', command: 'grep' },
        { type: 'commandUsed', command: 'wc' },
        { type: 'outputContains', substring: '4' },
      ],
    },
    xpReward: 100,
  },
  {
    id: 'mission-2-3',
    arcId: 'mission',
    chapter: 2,
    position: 3,
    title: 'Diagnostic Report',
    objective: 'Extract all Array B errors, sort them, and save to diagnostics/array-b.txt',
    briefing: 'Compile a clean diagnostic report for the solar array failures.',
    dialogue: [
      {
        character: 'NOVA',
        message:
          'Create a `diagnostics` directory, then use a pipe chain: `grep "Array B" system.log | sort > diagnostics/array-b.txt`',
        trigger: { type: 'levelStart' },
      },
    ],
    initialFS: {
      type: 'directory',
      name: '',
      children: [
        { type: 'directory', name: 'home', children: [
          { type: 'directory', name: 'user', children: [
            { type: 'file', name: 'system.log', content: 'INFO: Life support nominal\nERROR: Solar Array B voltage drop\nINFO: Comms check passed\nERROR: Array B controller timeout\nERROR: Array B thermal sensor offline\nERROR: Array B communication lost' },
          ]},
        ]},
      ],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'First: `mkdir diagnostics`' },
      { text: 'Then: `grep "Array B" system.log | sort > diagnostics/array-b.txt`' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'fileExists', path: '/home/user/diagnostics/array-b.txt' },
        { type: 'fileContains', path: '/home/user/diagnostics/array-b.txt', substring: 'Array B' },
        { type: 'commandUsed', command: 'grep' },
        { type: 'commandUsed', command: 'sort' },
      ],
    },
    xpReward: 150,
    par: 2,
  },

  // Chapter 3: Repair
  {
    id: 'mission-3-1',
    arcId: 'mission',
    chapter: 3,
    position: 1,
    title: 'Firmware Update',
    objective: 'Copy the firmware update to the array controller and set ARRAY_MODE to "maintenance"',
    briefing: "The firmware patch is ready. Deploy it to the array controller.",
    dialogue: [
      {
        character: 'NOVA',
        message:
          'Copy `firmware-v2.bin` to `array-controller/firmware.bin`, then `export ARRAY_MODE=maintenance` to put it in maintenance mode.',
        trigger: { type: 'levelStart' },
      },
    ],
    initialFS: {
      type: 'directory',
      name: '',
      children: [
        { type: 'directory', name: 'home', children: [
          { type: 'directory', name: 'user', children: [
            { type: 'file', name: 'firmware-v2.bin', content: 'FIRMWARE v2.0.1 - Array B controller patch' },
            { type: 'directory', name: 'array-controller', children: [
              { type: 'file', name: 'firmware.bin', content: 'FIRMWARE v1.0.0 - CORRUPTED' },
            ]},
          ]},
        ]},
      ],
    },
    startingPath: '/home/user',
    hints: [
      { text: 'Remove old firmware: `rm array-controller/firmware.bin`' },
      { text: 'Copy new one: `cp firmware-v2.bin array-controller/firmware.bin`' },
      { text: 'Set mode: `export ARRAY_MODE=maintenance`' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'fileContains', path: '/home/user/array-controller/firmware.bin', substring: 'v2.0.1' },
        { type: 'envVar', name: 'ARRAY_MODE', value: 'maintenance' },
      ],
    },
    xpReward: 125,
  },
  {
    id: 'mission-3-2',
    arcId: 'mission',
    chapter: 3,
    position: 2,
    title: 'Reboot Sequence',
    objective: 'Append 3 status lines to reboot.log using >> to document the reboot sequence',
    briefing: 'Document each step of the reboot: INIT, FIRMWARE_LOAD, ONLINE.',
    dialogue: [
      {
        character: 'NOVA',
        message:
          'Log each reboot step. Use `echo "STEP 1: INIT" > reboot.log`, then `echo "STEP 2: FIRMWARE_LOAD" >> reboot.log`, then `echo "STEP 3: ONLINE" >> reboot.log`.',
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
      { text: 'Use > for the first line, >> for subsequent lines' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'fileExists', path: '/home/user/reboot.log' },
        { type: 'fileContains', path: '/home/user/reboot.log', substring: 'INIT' },
        { type: 'fileContains', path: '/home/user/reboot.log', substring: 'FIRMWARE_LOAD' },
        { type: 'fileContains', path: '/home/user/reboot.log', substring: 'ONLINE' },
      ],
    },
    xpReward: 125,
  },
  {
    id: 'mission-3-3',
    arcId: 'mission',
    chapter: 3,
    position: 3,
    title: 'Mission Complete',
    objective: 'Verify the repair: grep for ONLINE in all status files, set ARRAY_MODE to "operational", write "MISSION COMPLETE" to final-report.txt',
    briefing: "Array B is responding. Run the final verification and close out the mission.",
    dialogue: [
      {
        character: 'NOVA',
        message:
          "Final checks, Commander. Grep for 'ONLINE' in power.status to verify. Set `ARRAY_MODE=operational`. Write 'MISSION COMPLETE' to `final-report.txt`. You've saved the station.",
        trigger: { type: 'levelStart' },
      },
      {
        character: 'NOVA',
        message:
          "Outstanding work, Commander. Array B is back online. Ground control sends their thanks. Station Artemis is fully operational. Mission success.",
        trigger: { type: 'commandExecuted', command: 'echo' },
      },
    ],
    initialFS: {
      type: 'directory',
      name: '',
      children: [
        { type: 'directory', name: 'home', children: [
          { type: 'directory', name: 'user', children: [
            { type: 'file', name: 'power.status', content: 'Solar Array A: ONLINE\nSolar Array B: ONLINE\nBattery: 92%\nConsumption: 11.2kW' },
          ]},
        ]},
      ],
    },
    startingPath: '/home/user',
    hints: [
      { text: '`grep ONLINE power.status` to verify' },
      { text: '`export ARRAY_MODE=operational`' },
      { text: '`echo "MISSION COMPLETE" > final-report.txt`' },
    ],
    validator: {
      type: 'all',
      conditions: [
        { type: 'commandUsed', command: 'grep' },
        { type: 'envVar', name: 'ARRAY_MODE', value: 'operational' },
        { type: 'fileExists', path: '/home/user/final-report.txt' },
        { type: 'fileContains', path: '/home/user/final-report.txt', substring: 'MISSION COMPLETE' },
      ],
    },
    xpReward: 250,
    par: 3,
  },
];
