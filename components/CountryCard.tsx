import Link from 'next/link';

interface CountryCardProps {
  title: string;
  url: string;
  volcanoCount?: number;
}

export default function CountryCard({ title, url, volcanoCount }: CountryCardProps) {
  // Extract country name from title
  const countryName = title.replace('Volcanoes in ', '');
  
  return (
    <Link href={url} className="group">
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4 h-full transition-all hover:bg-[#252525] hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10">
        <h3 className="text-base font-semibold text-white group-hover:text-amber-500 transition-colors mb-2">
          {countryName}
        </h3>
        {volcanoCount !== undefined && (
          <p className="text-2xl font-bold text-amber-500">
            {volcanoCount}
          </p>
        )}
        <p className="text-sm text-gray-400 mt-1">
          {volcanoCount === 1 ? 'volcano' : 'volcanoes'}
        </p>
      </div>
    </Link>
  );
}