'use client';

import 'leaflet/dist/leaflet.css';
import { AttributionControl, CircleMarker, MapContainer, Popup, TileLayer, Tooltip } from 'react-leaflet';

export interface RecordMapProps {
  name: string;
  lat: number;
  lon: number;
  zoom: number;
  /** One line for the marker's popup, built from the page's own data. */
  detail: string;
  /** Put the name under the marker at every width, when the street map prints its own label beside it. */
  labelBelow?: boolean;
}

/**
 * Locator map of a rebuilt volcano page, in the page's look (styles in record.css).
 * It is loaded by LazyMap only, in the browser, so it can read the window.
 */
export default function RecordMap({ name, lat, lon, zoom, detail, labelBelow }: RecordMapProps) {
  // On a touch screen one finger scrolls the page, not the map; the map zooms by its buttons or a pinch.
  const touch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
  const position: [number, number] = [lat, lon];
  // A long name does not fit beside the marker on a phone-width map: it goes underneath.
  const below = labelBelow || (typeof window !== 'undefined' && window.innerWidth < 520 && name.length > 12);

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      minZoom={3}
      maxZoom={13}
      scrollWheelZoom={false}
      dragging={!touch}
      touchZoom="center"
      doubleClickZoom="center"
      attributionControl={false}
      className="va-leaflet"
    >
      <AttributionControl prefix={false} />
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <CircleMarker center={position} radius={21} pathOptions={{ color: '#c21f1f', weight: 2.5, fill: false, className: 'va-mapring' }} interactive={false} />
      <CircleMarker center={position} radius={6} pathOptions={{ color: '#17212b', weight: 1.5, fillColor: '#d9482b', fillOpacity: 1 }}>
        <Tooltip permanent direction={below ? 'bottom' : 'right'} offset={below ? [0, 22] : [24, -2]} className="va-maplabel">
          {name}
        </Tooltip>
        <Popup>
          <strong>{name}</strong>
          <br />
          {detail}
        </Popup>
      </CircleMarker>
    </MapContainer>
  );
}
