import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center">
        <div className="text-8xl font-bold text-cyber-green mb-4 glow-green font-mono">404</div>
        <div className="text-2xl text-cyber-white mb-2">Page Not Found</div>
        <div className="text-cyber-muted mb-8 font-mono">
          <span className="text-terminal-prompt">user@cli-quest:~$</span>{' '}
          <span className="text-cyber-red">cd /this-page</span>
          <br />
          <span className="text-cyber-red">cd: /this-page: No such file or directory</span>
        </div>
        <Link
          href="/"
          className="px-6 py-3 bg-cyber-green text-cyber-bg font-bold rounded-lg hover:opacity-90 transition-opacity"
        >
          cd /home
        </Link>
      </div>
    </div>
  );
}
