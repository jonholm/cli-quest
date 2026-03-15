'use client';

interface LevelObjectiveProps {
  objective: string;
}

export default function LevelObjective({ objective }: LevelObjectiveProps) {
  return (
    <div role="status" aria-label="Level objective" className="sticky top-0 bg-terminal-bg border-b border-terminal-green p-3 mb-4">
      <div className="text-terminal-green font-bold mb-1">OBJECTIVE:</div>
      <div className="text-terminal-white">{objective}</div>
    </div>
  );
}
