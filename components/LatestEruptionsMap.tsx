'use client';

import dynamic from 'next/dynamic';
import { MapMarker } from '@/lib/data';

const EnhancedInteractiveMap = dynamic(() => import('@/components/EnhancedInteractiveMap'), {
  ssr: false,
  loading: () => <div className="h-full bg-gray-900" />,
});

interface LatestEruptionsMapProps {
  volcanoMarkers: MapMarker[];
}

export default function LatestEruptionsMap({ volcanoMarkers }: LatestEruptionsMapProps) {
  // Fixed height so the page does not jump when the map loads.
  return (
    <div className="h-[420px] md:h-[500px] rounded-lg overflow-hidden border border-gray-700 relative z-0">
      {volcanoMarkers && volcanoMarkers.length > 0 ? (
        <EnhancedInteractiveMap markers={volcanoMarkers} />
      ) : (
        <div className="h-full bg-gray-900 flex items-center justify-center text-gray-400">No reports to map right now</div>
      )}
    </div>
  );
}
