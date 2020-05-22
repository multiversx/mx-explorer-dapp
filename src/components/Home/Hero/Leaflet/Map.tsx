import React from 'react';
import L from 'leaflet';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { faMapMarker } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MapDisplayType, getRadius, getGroupedCities } from './helpers/processing';
import Icon from './Icon';
import Control from 'react-leaflet-control';
import './leaflet.scss';

export default function MapDisplay({
  markers,
  leaders,
  metaChainShardId,
  shardsArray,
}: MapDisplayType) {
  const state = {
    lat: 15,
    lng: -2,
    zoom: 1.5,
  };
  const position: any = [state.lat, state.lng];

  const groupedCities = getGroupedCities(markers);

  const radiusByCity = getRadius(groupedCities);

  const tiles = 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png';
  const attribution =
    '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';

  const style = (publicKey: string, offset = 0) => ({
    dangerouslySetInnerHTML: {
      __html: `.leader-marker-${publicKey} {
        z-index: ${markers.length + offset + 1000} !important;
      }`,
    },
  });

  const tileProps = {
    attribution,
    url: tiles,
    style: true,
    noWrap: true,
  };

  return (
    <Map
      zoomControl={false}
      center={position}
      zoom={state.zoom}
      maxZoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer {...tileProps} />

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
              {value}: {`${items.length} node${items.length === 1 ? '' : 's'}`}
            </Popup>
          </Marker>
        );
      })}
      {leaders.map((leader, i) => (
        <style {...style(leader.publicKey, leader.offset)} key={leader.name + i} />
      ))}
      {leaders.map((leader, i) => {
        const iconName = leader.shard === metaChainShardId ? 'metachain' : leader.shard;
        return (
          <Marker
            key={leader.name + i}
            position={new L.LatLng(leader.lat, leader.lon)}
            icon={L.icon({
              iconUrl: require(`assets/img/markers/shard-${iconName}.svg`),
              iconSize: [20, 24],
              iconAnchor: [10 + leader.offset!, 24],
              className: `leader-marker-${leader.publicKey}`,
            })}
            onMouseOver={(e: any) => {
              e.target.openPopup();
            }}
            onMouseOut={(e: any) => {
              e.target.closePopup();
            }}
          />
        );
      })}
      <Control position="bottomleft">
        <p className="text-white mb-0">
          <FontAwesomeIcon icon={faMapMarker} /> <b>Leaders</b>
        </p>
        <ul className="list-unstyled text-white leaflet-legend">
          {shardsArray.map(shard => {
            const shardName = shard === metaChainShardId ? 'Metachain' : `Shard ${shard}`;
            const shardObj = leaders.find(l => l.shard === shard);
            const shardLeader = shardObj ? ` ${shardObj!.name}, ${shardObj!.country}` : '';
            return shardLeader ? (
              <li key={shard}>
                {shardName}: {shardLeader}
              </li>
            ) : null;
          })}
        </ul>
      </Control>
    </Map>
  );
}
