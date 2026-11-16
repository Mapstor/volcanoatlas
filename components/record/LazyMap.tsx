'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

// The map library is only downloaded when the reader scrolls near the map.
const VolcanoLocationMap = dynamic(() => import('@/components/VolcanoLocationMap'), { ssr: false });

interface LazyMapProps {
  name: string;
  lat: number;
  lon: number;
  elevation: number;
  type: string;
  country: string;
  region: string;
  status: string;
}

export default function LazyMap({ name, lat, lon, elevation, type, country, region, status }: LazyMapProps) {
  const box = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const node = box.current;
    if (!node || show) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShow(true);
          observer.disconnect();
        }
      },
      { rootMargin: '600px 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [show]);

  return (
    <div ref={box} className="va-map">
      {show ? (
        <VolcanoLocationMap volcano={{ name, coordinates: { lat, lon }, elevation_m: elevation, type, country, region, status }} />
      ) : (
        <p className="va-mapwait">
          Map of {name}’s location: {lat}°, {lon}°
        </p>
      )}
    </div>
  );
}
