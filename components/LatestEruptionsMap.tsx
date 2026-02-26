'use client';

import dynamic from 'next/dynamic';
import { MapMarker } from '@/lib/data';

const EnhancedInteractiveMap = dynamic(() => import('@/components/EnhancedInteractiveMap'), {
  ssr: false,
  loading: () => <div className="h-[500px] bg-gray-900 animate-pulse rounded-lg" />
});

interface LatestEruptionsMapProps {
  volcanoMarkers: MapMarker[];
}

export default function LatestEruptionsMap({ volcanoMarkers }: LatestEruptionsMapProps) {
  if (!volcanoMarkers || volcanoMarkers.length === 0) {
    return <div className="h-[500px] bg-gray-900 rounded-lg flex items-center justify-center text-gray-400">No active volcanoes to display</div>;
  }
  
  return (
    <EnhancedInteractiveMap 
      markers={volcanoMarkers}
    />
  );
}