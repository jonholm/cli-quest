'use client';

/**
 * TerminalWindow Component
 *
 * Wraps the entire application in an authentic MacOS terminal window chrome.
 * Features:
 * - MacOS-style traffic light buttons (red, yellow, green)
 * - Terminal title bar
 * - Window border and shadow for depth
 * - Responsive design
 */

interface TerminalWindowProps {
  children: React.ReactNode;
  title?: string;
}

export default function TerminalWindow({ children, title = 'CLI Quest' }: TerminalWindowProps) {
  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8 flex items-center justify-center">
      <div className="w-full max-w-[1400px] bg-terminal-bg rounded-lg shadow-2xl overflow-hidden border border-gray-800">
        {/* MacOS Title Bar */}
        <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
          {/* Traffic Light Buttons */}
          <div className="flex items-center gap-2" aria-hidden="true">
            <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors" />
          </div>

          {/* Window Title */}
          <div className="absolute left-1/2 transform -translate-x-1/2 text-gray-400 text-sm font-medium">
            {title}
          </div>

          {/* Right side spacer for balance */}
          <div className="w-[52px]" />
        </div>

        {/* Terminal Content */}
        <div className="bg-terminal-bg">
          {children}
        </div>
      </div>
    </div>
  );
}
