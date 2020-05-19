import React from 'react';
import L from 'leaflet';
// @ts-ignore
import kendo from 'kendo-ui-core/js/kendo.data';
import { Map, Marker, Popup, GeoJSON, useLeaflet } from 'react-leaflet';
import 'leaflet.markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import countries from './countries.json';
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

const mcg = L.markerClusterGroup({
  chunkedLoading: true,
  iconCreateFunction: cluster => {
    const markers = cluster.getAllChildMarkers();
    const html = `<div class="marker-circle">${markers.length}</div>`;
    return L.divIcon({ html, className: 'leaflet-div-icon', iconSize: L.point(32, 32) });
  },
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,

  // zoomToBoundsOnClick: false,
});

mcg.on('clusterclick', a => {
  const latLngBounds = a.layer.getBounds();
  console.warn(latLngBounds);
});

const MarkerCluster = ({ markers }: MapDisplayType) => {
  const { map } = useLeaflet();

  React.useEffect(() => {
    mcg.clearLayers();
    markers.forEach(({ lat, lon, name }) => {
      return L.marker(new L.LatLng(lat, lon), {
        // icon: Icon,
      })
        .addTo(mcg)
        .on('click', a => {
          console.warn(a.target._popup._content);
        })
        .bindPopup(name);
    });

    // optionally center the map around the markers
    // map.fitBounds(mcg.getBounds());
    // // add the marker cluster group to the map
    (map as any).addLayer(mcg);
  }, [markers, map]);

  return null;
};

export interface MarkerPoint {
  name: string;
  lat: number;
  lon: number;
  markerOffset: number;
  ip: string;
}

interface MapDisplayType {
  markers: MarkerPoint[];
}

export default function MapDisplay({ markers }: MapDisplayType) {
  const state = {
    lat: 41.257017,
    lng: 29.077524,
    zoom: 3,
  };
  const position: any = [state.lat, state.lng];

  // const stamenTonerTiles =
  //   'http://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.png';
  // const stamenTonerAttr =
  //   'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';

  const dataSource = new kendo.data.DataSource({
    data: markers,
  });
  dataSource.group({ field: 'name' });
  const groupedCities = dataSource.view();
  const totalNodesArray = groupedCities.map((city: any) => city.items.length);
  const uniqueTotalNodes = [...new (Set as any)(totalNodesArray)];

  console.log();

  return (
    <Map
      zoomControl={false}
      attributionControl={false}
      center={position}
      zoom={state.zoom}
      maxZoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      {/* <TileLayer attribution={stamenTonerAttr} url={stamenTonerTiles} style /> */}
      <GeoJSON
        data={countries as any}
        style={{
          color: '#6db8ee',
          weight: 1,
          opacity: 1,
          fillColor: '#fff',
          fillOpacity: 1,
        }}
      />
      {groupedCities.map(({ items, value }: any, i: number) => {
        const { lat, lon } = items[0];
        return (
          <Marker key={value + i} position={new L.LatLng(lat, lon)} icon={Icon}>
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
