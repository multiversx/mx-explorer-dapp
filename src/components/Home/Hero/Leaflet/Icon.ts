import L from 'leaflet';

const Icon = (size = 10) =>
  L.divIcon({
    className: 'leaflet-div-icon',
    iconSize: [size, size],
  });

export default Icon;
