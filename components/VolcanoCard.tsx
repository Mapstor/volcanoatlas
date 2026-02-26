import Link from 'next/link';

interface VolcanoCardProps {
  title: string;
  url: string;
  country?: string;
  type?: string;
  elevation?: string;
  lastEruption?: string;
  eruptions?: number;
}

export default function VolcanoCard({
  title,
  url,
  country,
  type,
  elevation,
  lastEruption,
  eruptions
}: VolcanoCardProps) {
  return (
    <Link href={url} className="group block h-full">
      <div className="bg-gradient-to-b from-[#1a1a1a] to-[#151515] border border-gray-800 rounded-lg p-6 h-full transition-all duration-300 hover:border-amber-500 hover:shadow-xl hover:shadow-amber-500/20 hover:-translate-y-1">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white group-hover:text-amber-500 transition-colors">
            {title}
          </h3>
          {lastEruption && lastEruption.toLowerCase().includes('ce') && (
            <span className="px-2 py-1 text-xs font-semibold bg-red-500/20 text-red-400 rounded">
              Active
            </span>
          )}
        </div>
        
        <div className="space-y-2 mb-4">
          {country && (
            <div className="flex items-center text-sm">
              <span className="text-gray-500 w-20">Location</span>
              <span className="text-gray-300 font-medium">{country}</span>
            </div>
          )}
          {type && (
            <div className="flex items-center text-sm">
              <span className="text-gray-500 w-20">Type</span>
              <span className="text-gray-300">{type}</span>
            </div>
          )}
          {elevation && (
            <div className="flex items-center text-sm">
              <span className="text-gray-500 w-20">Elevation</span>
              <span className="text-gray-300">{elevation}</span>
            </div>
          )}
          {lastEruption && (
            <div className="flex items-center text-sm">
              <span className="text-gray-500 w-20">Last Active</span>
              <span className="text-amber-400">{lastEruption}</span>
            </div>
          )}
          {eruptions !== undefined && (
            <div className="flex items-center text-sm">
              <span className="text-gray-500 w-20">Eruptions</span>
              <span className="text-gray-300">{eruptions}</span>
            </div>
          )}
        </div>
        
        <div className="pt-4 border-t border-gray-800">
          <span className="text-amber-500 text-sm font-semibold group-hover:text-amber-400 transition-colors flex items-center">
            Explore Volcano
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}