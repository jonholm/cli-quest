'use client';

import { useRouter } from 'next/navigation';
import { useEscapeToHub } from '@/hooks/useEscapeToHub';

export default function Tutorial() {
  const router = useRouter();

  useEscapeToHub();

  return (
    <div className="min-h-screen bg-terminal-bg p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push('/hub')}
          className="text-terminal-green hover:underline mb-6"
        >
          ← Back to Hub
        </button>

        <h1 className="text-5xl font-bold text-terminal-green mb-8">
          Welcome to CLI Quest
        </h1>

        <div className="space-y-8">
          <section className="border-2 border-terminal-green p-6 bg-terminal-green bg-opacity-5">
            <h2 className="text-3xl font-bold text-terminal-green mb-4">
              [ABOUT] This App
            </h2>
            <p className="text-terminal-white mb-4">
              CLI Quest is an interactive learning platform that teaches you command-line skills through fun, engaging challenges. You'll explore virtual file systems, solve mysteries, and complete missions—all while mastering real CLI commands.
            </p>
            <p className="text-terminal-white">
              No prior experience needed! Start with Basic Training and progress through increasingly challenging zones.
            </p>
          </section>

          <section className="border-2 border-terminal-green p-6 bg-terminal-green bg-opacity-5">
            <h2 className="text-3xl font-bold text-terminal-green mb-4">
              [ZONES] The Learning Paths
            </h2>
            <div className="space-y-4 text-terminal-white">
              <div>
                <h3 className="text-xl font-bold text-green-400 mb-2">
                  [BASICS] Basic Training
                </h3>
                <p>
                  Start here! Learn fundamental commands like pwd, ls, cd, cat, mkdir, and more. Perfect for beginners.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-blue-400 mb-2">
                  [ADVENTURE] The Lost Data
                </h3>
                <p>
                  Follow a narrative storyline as a digital archaeologist recovering lost data from abandoned servers. Solve puzzles and uncover secrets!
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-2">
                  [CHALLENGES] Challenge Zones
                </h3>
                <p>
                  Test your skills with themed challenges:
                  <ul className="list-disc list-inside ml-4 mt-2">
                    <li>File Detective: Hunt for hidden files and clues</li>
                    <li>System Administrator: Manage servers and clean up files</li>
                    <li>Data Analyst: Extract insights from data files</li>
                  </ul>
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-red-400 mb-2">
                  [ADVANCED] Advanced Techniques
                </h3>
                <p>
                  Master complex commands like grep, find, head, tail, wc, and learn to combine them for powerful workflows.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-purple-400 mb-2">
                  [SANDBOX] Sandbox Lab
                </h3>
                <p>
                  Free exploration mode! All commands unlocked. Create your own file system, experiment, and practice without constraints.
                </p>
              </div>
            </div>
          </section>

          <section className="border-2 border-terminal-green p-6 bg-terminal-green bg-opacity-5">
            <h2 className="text-3xl font-bold text-terminal-green mb-4">
              [COMMANDS] What You'll Learn
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-terminal-white">
              <div>
                <h3 className="text-lg font-bold text-green-400 mb-2">Basic Commands</h3>
                <ul className="space-y-1 font-mono text-sm">
                  <li><span className="text-terminal-green">pwd</span> - Print working directory</li>
                  <li><span className="text-terminal-green">ls</span> - List files and directories</li>
                  <li><span className="text-terminal-green">cd</span> - Change directory</li>
                  <li><span className="text-terminal-green">cat</span> - View file contents</li>
                  <li><span className="text-terminal-green">mkdir</span> - Create directory</li>
                  <li><span className="text-terminal-green">touch</span> - Create file</li>
                  <li><span className="text-terminal-green">rm</span> - Remove files/directories</li>
                  <li><span className="text-terminal-green">clear</span> - Clear terminal</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-yellow-400 mb-2">Advanced Commands</h3>
                <ul className="space-y-1 font-mono text-sm">
                  <li><span className="text-terminal-green">grep</span> - Search file contents</li>
                  <li><span className="text-terminal-green">find</span> - Search for files</li>
                  <li><span className="text-terminal-green">head</span> - View file start</li>
                  <li><span className="text-terminal-green">tail</span> - View file end</li>
                  <li><span className="text-terminal-green">wc</span> - Count words/lines</li>
                  <li><span className="text-terminal-green">cp</span> - Copy files</li>
                  <li><span className="text-terminal-green">mv</span> - Move/rename files</li>
                  <li><span className="text-terminal-green">echo</span> - Print text</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="border-2 border-terminal-green p-6 bg-terminal-green bg-opacity-5">
            <h2 className="text-3xl font-bold text-terminal-green mb-4">
              [HOWTO] Playing the Game
            </h2>
            <ol className="space-y-3 text-terminal-white list-decimal list-inside">
              <li>Choose a zone from the main hub</li>
              <li>Select a level to begin</li>
              <li>Read the objective carefully</li>
              <li>Type commands in the terminal to complete the task</li>
              <li>Use hints if you get stuck (press Ctrl/Cmd+H)</li>
              <li>Complete the objective to unlock the next level</li>
              <li>Earn XP and track your progress!</li>
            </ol>
          </section>

          <section className="border-2 border-terminal-green p-6 bg-terminal-green bg-opacity-5">
            <h2 className="text-3xl font-bold text-terminal-green mb-4">
              [KEYS] Keyboard Controls
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-terminal-white">
              <div>
                <h3 className="text-lg font-bold text-terminal-green mb-2">Navigation</h3>
                <ul className="space-y-1">
                  <li><kbd className="bg-gray-800 px-2 py-1 rounded">↑ ↓ ← →</kbd> Navigate menus</li>
                  <li><kbd className="bg-gray-800 px-2 py-1 rounded">Enter</kbd> Select/Confirm</li>
                  <li><kbd className="bg-gray-800 px-2 py-1 rounded">ESC</kbd> Go back</li>
                  <li><kbd className="bg-gray-800 px-2 py-1 rounded">H</kbd> Open tutorial</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-terminal-green mb-2">In-Game</h3>
                <ul className="space-y-1">
                  <li><kbd className="bg-gray-800 px-2 py-1 rounded">Ctrl/Cmd + H</kbd> Show hint</li>
                  <li><kbd className="bg-gray-800 px-2 py-1 rounded">Ctrl/Cmd + R</kbd> Reset level</li>
                  <li><kbd className="bg-gray-800 px-2 py-1 rounded">ESC</kbd> Exit to menu</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="border-2 border-terminal-green p-6 bg-terminal-green bg-opacity-5">
            <h2 className="text-3xl font-bold text-terminal-green mb-4">
              [TIPS] For Success
            </h2>
            <ul className="space-y-2 text-terminal-white list-disc list-inside">
              <li>Read objectives carefully—they tell you exactly what to do</li>
              <li>Use <code className="bg-gray-800 px-2 py-1 rounded">ls</code> often to see what's around you</li>
              <li>Don't be afraid to experiment—you can always reset!</li>
              <li>Hints are there to help—use them when stuck</li>
              <li>Practice in Sandbox mode to build confidence</li>
              <li>Command flags matter: <code className="bg-gray-800 px-2 py-1 rounded">ls -a</code> shows hidden files!</li>
            </ul>
          </section>

          <div className="text-center">
            <button
              onClick={() => router.push('/hub')}
              className="px-8 py-4 bg-terminal-green text-terminal-bg font-bold text-xl hover:opacity-80 transition-opacity"
            >
              [START QUEST]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
