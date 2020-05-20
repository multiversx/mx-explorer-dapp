import React from 'react';
import L from 'leaflet';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapDisplayType, getRadius, getGroupedCities } from './helpers/processing';
import Icon from './Icon';
import './leaflet.scss';

export default function MapDisplay({ markers, leaders, metaChainShardId }: MapDisplayType) {
  const state = {
    lat: 33,
    lng: -2,
    zoom: 2.5,
  };
  const position: any = [state.lat, state.lng];

  const groupedCities = getGroupedCities(markers);

  const radiusByCity = getRadius(groupedCities);

  const tiles = 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png';
  const attr =
    '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';

  return (
    <Map
      zoomControl={false}
      center={position}
      zoom={state.zoom}
      maxZoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer attribution={attr} url={tiles} style />
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
      {leaders.map((leader, i) => {
        const iconName = leader.shard === metaChainShardId ? 'metachain' : leader.shard;
        return (
          <Marker
            key={leader.name + i}
            position={new L.LatLng(leader.lat, leader.lon)}
            icon={L.icon({
              iconUrl: require(`assets/img/markers/shard-${iconName}.png`),
              iconRetinaUrl: require(`assets/img/markers/shard-${iconName}@2x.png`),
              iconSize: [20, 24],
              iconAnchor: [10, 24], // point of the icon which will correspond to marker's location
              className: 'leader-marker',
            })}
            onMouseOver={(e: any) => {
              e.target.openPopup();
            }}
            onMouseOut={(e: any) => {
              e.target.closePopup();
            }}
          >
            {/* <Popup>{leader.name}</Popup> */}
          </Marker>
        );
      })}
    </Map>
  );
}
