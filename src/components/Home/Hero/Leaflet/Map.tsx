import React from 'react';
import L from 'leaflet';
import { Map, Marker, Popup, GeoJSON, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MarkerPoint, MapDisplayType, getRadius, getGroupedCities } from './helpers/processing';
import countries from './countries.json';
// import waters from './waters.json';
import Icon from './Icon';
import './icon.scss';

L.Icon.Default.imagePath = './../../../../node_modules/leaflet';
// http://leaflet-extras.github.io/leaflet-providers/preview/
delete (L.Icon.Default.prototype as any).getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default function MapDisplay({ markers }: MapDisplayType) {
  const state = {
    lat: 40.257017,
    lng: 2.077524,
    zoom: 2.5,
  };
  const position: any = [state.lat, state.lng];

  const groupedCities = getGroupedCities(markers);

  const radiusByCity = getRadius(groupedCities);

  // const stamenTonerTiles =
  //   'http://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.png';
  // const stamenTonerAttr =
  //   'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';

  const tiles = 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png';
  const attr =
    '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';

  return (
    <Map
      zoomControl={false}
      // attributionControl={false}
      center={position}
      zoom={state.zoom}
      maxZoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer attribution={attr} url={tiles} style />
      {/* <GeoJSON
        data={countries as any}
        style={{
          color: '#1b46c240',
          weight: 1,
          opacity: 1,
          fillColor: '#fff',
          fillOpacity: 1,
        }}
      /> */}
      {groupedCities.map(({ items, value }: any, i: number) => {
        const { lat, lon } = items[0];
        return (
          <Marker
            key={value + i}
            position={new L.LatLng(lat, lon)}
            icon={Icon(radiusByCity[value])}
            onMouseOver={(e: any) => {
              e.target.openPopup();
            }}
            onMouseOut={(e: any) => {
              e.target.closePopup();
            }}
          >
            <Popup>
              {value}: {items.length} nodes
            </Popup>
          </Marker>
        );
      })}

      {/* <MarkerCluster markers={markers} /> */}
    </Map>
  );
}
