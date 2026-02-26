interface QuickStatsProps {
  howMany: string;
  howManyActive: string;
  why: string;
  tallest: string;
  mostRecent: string;
}

export default function QuickStats({ howMany, howManyActive, why, tallest, mostRecent }: QuickStatsProps) {
  return (
    <div className="bg-amber-500/10 border-l-4 border-amber-500 rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
        <span className="w-1 h-8 bg-amber-500 mr-3"></span>
        Quick Stats
      </h2>
      <dl className="space-y-3">
        <div>
          <dt className="text-gray-400 text-sm font-semibold uppercase tracking-wider">How Many Volcanoes?</dt>
          <dd className="text-white mt-1">{howMany}</dd>
        </div>
        <div>
          <dt className="text-gray-400 text-sm font-semibold uppercase tracking-wider">How Many Active?</dt>
          <dd className="text-white mt-1">{howManyActive}</dd>
        </div>
        <div>
          <dt className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Why So Many Volcanoes?</dt>
          <dd className="text-white mt-1">{why}</dd>
        </div>
        <div>
          <dt className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Tallest Volcano</dt>
          <dd className="text-white mt-1">{tallest}</dd>
        </div>
        <div>
          <dt className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Most Recent Eruption</dt>
          <dd className="text-white mt-1">{mostRecent}</dd>
        </div>
      </dl>
    </div>
  );
}