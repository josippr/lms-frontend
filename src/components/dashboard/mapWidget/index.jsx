import React from 'react';
import { useSelector } from 'react-redux';
import { MapContainer, TileLayer, Marker, CircleMarker, useMap, Tooltip } from 'react-leaflet';
import L from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Optional: Fix missing marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Helper component to center map on marker
function Recenter({ lat, lng }) {
  const map = useMap();
  map.setView([lat, lng], 13);
  return null;
}

const MapWidget = ({ latlong }) => {

  const node = useSelector((state) => state.nodes?.data[0]);
  const theme = useSelector((state) => state.config.theme);
  
  if (!latlong) return <div>Loading location...</div>;

  const [lat, lng] = latlong.split(',').map(Number);

  const tileUrl =
    theme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  return (
    <MapContainer center={[lat, lng]} zoom={13} style={{ height: '100%', width: '100%', borderRadius: '1rem'}}>
      <Recenter lat={lat} lng={lng} />
      
      <TileLayer
        url={tileUrl}
        attribution='&copy; <a href="https://carto.com/">CartoDB</a> contributors'
      />
      
      <CircleMarker
        center={[lat, lng]}
        radius={10}
        pathOptions={{ color: 'white', fillColor: 'blue', fillOpacity: 0.9 }}
      >
        <Tooltip direction="top" offset={[0, -10]} opacity={1}>
          {node?.DeviceName}
        </Tooltip>
      </CircleMarker>
    </MapContainer>
  );
};

export default MapWidget;
