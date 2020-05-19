import L from 'leaflet';
// import marker from './star.png';

// const Icon = new L.Icon({
//   iconUrl: marker,
//   iconRetinaUrl: marker,
//   iconSize: new L.Point(60, 75),
//   className: 'leaflet-div-icon',
// });
const Icon = (size = 10) =>
  L.divIcon({
    className: 'leaflet-div-icon',
    iconSize: [size, size],
  });

export default Icon;
