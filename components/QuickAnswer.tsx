interface QuickAnswerProps {
  what: string;
  status: string;
  famousFor: string;
  dangerLevel: string;
}

export default function QuickAnswer({ what, status, famousFor, dangerLevel }: QuickAnswerProps) {
  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-amber-500 mb-4">Quick Answer</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1">What is it?</h3>
          <p className="text-white">{what}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1">Current Status</h3>
          <p className="text-white">{status}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1">Famous For</h3>
          <p className="text-white">{famousFor}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1">Danger Level</h3>
          <p className="text-white">{dangerLevel}</p>
        </div>
      </div>
    </div>
  );
}