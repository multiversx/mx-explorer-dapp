import React from 'react';
import L from 'leaflet';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { faMapMarker } from '@fortawesome/pro-regular-svg-icons/faMapMarker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MapDisplayType, getRadius } from './helpers/processing';
import Icon from './Icon';
import Control from 'react-leaflet-control';

export default function MapDisplay({
  cities,
  leaders,
  metaChainShardId,
  shardsArray,
}: MapDisplayType) {
  const state = {
    lat: 15,
    lng: -2,
    zoom: 1.5,
    minZoom: 1.5,
  };
  const position: any = [state.lat, state.lng];
  const ref = React.useRef(null);

  const handleScroll = () => {
    if (ref.current) {
      const elem: HTMLElement = L.DomUtil.get('legend') as any;
      L.DomEvent.on(elem, 'mousewheel', L.DomEvent.stopPropagation);
    }
  };

  React.useEffect(handleScroll, [ref.current]);

  const radiusByCity = getRadius(cities);

  const tiles = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  const attribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

  // const tiles = 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png';
  // const attribution =
  //   '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';

  // const style = (publicKey: string, offset = 0) => ({
  //   dangerouslySetInnerHTML: {
  //     __html: `.leader-marker-${publicKey} {
  //       z-index: ${markers.length + offset + 1000} !important;
  //     }`,
  //   },
  // });

  const tileProps = {
    attribution,
    url: tiles,
    style: true,
    noWrap: true,
  };

  const southWest = L.latLng(-90, -180);
  const northEast = L.latLng(90, 180);
  const bounds = L.latLngBounds(southWest, northEast);

  const shardLeaders: { shard: number; leader: string; valid: boolean }[] = shardsArray
    .map((shard) => {
      const shardName = shard === metaChainShardId ? 'Metachain' : `Shard ${shard}`;
      const shardObj = leaders.find((l) => l.shard === shard);
      const shardLeader = shardObj ? ` ${shardObj!.name}, ${shardObj!.country}` : '';
      return {
        shard,
        leader: `${shardName}: ${shardLeader}`,
        valid: shardLeader !== '',
      };
    })
    .filter(({ valid }) => valid);

  return (
    <Map
      zoomControl={false}
      center={position}
      zoom={state.zoom}
      maxBounds={bounds}
      maxBoundsViscosity={1.0}
      minZoom={state.minZoom}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer {...tileProps} />

      {cities.map(({ validators, latitude: lat, longitude: lon, city }, i: number) => {
        return (
          <Marker
            key={city + i}
            position={new L.LatLng(lat, lon)}
            icon={Icon(radiusByCity[city])}
            onMouseOver={(e: any) => {
              e.target.openPopup();
            }}
            onMouseOut={(e: any) => {
              e.target.closePopup();
            }}
          >
            <Popup>
              {city}: {`${validators.length} node${validators.length === 1 ? '' : 's'}`}
            </Popup>
          </Marker>
        );
      })}
      {/* {leaders.map((leader, i) => (
        <style {...style(leader.publicKey, leader.offset)} key={leader.name + i} />
      ))} */}
      {/* {leaders.map((leader, i) => {
        let iconName =
          leader.shard === metaChainShardId ? 'shard-metachain.svg' : `shard-${leader.shard}.svg`;
        if (leaders.length > 6) {
          iconName = 'shard.svg';
        }
        return (
          <Marker
            key={leader.name + i}
            position={new L.LatLng(leader.lat, leader.lon)}
            icon={L.icon({
              iconUrl: require(`assets/images/markers/${iconName}`),
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
      })} */}
      {shardLeaders.length > 0 && (
        <Control position="bottomleft">
          <p className="text-white mb-0">
            <FontAwesomeIcon icon={faMapMarker} /> <b>Leaders</b>
          </p>
          <ul className="list-unstyled text-white leaflet-legend map-legend" id="legend" ref={ref}>
            {shardLeaders.map(({ shard, leader }) => (
              <li key={shard}>{leader}</li>
            ))}
          </ul>
        </Control>
      )}
    </Map>
  );
}
