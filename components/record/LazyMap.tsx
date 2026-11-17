'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import type { RecordMapProps } from './RecordMap';

// The map library is downloaded only when the reader is about to reach the map.
const RecordMap = dynamic(() => import('./RecordMap'), { ssr: false });

export default function LazyMap(props: RecordMapProps) {
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
      { rootMargin: '400px 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [show]);

  return (
    <div ref={box} className="va-map" role="region" aria-label={`Map showing where ${props.name} is`}>
      {show ? (
        <RecordMap {...props} />
      ) : (
        <p className="va-mapwait">
          Map showing where {props.name} is: {props.detail}
        </p>
      )}
    </div>
  );
}
