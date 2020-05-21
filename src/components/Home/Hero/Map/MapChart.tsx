import * as React from 'react';
import { ComposableMap, Marker, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { MarkerPoint, MapDisplayType, getRadius, getGroupedCities } from './helpers/processing';

const geoUrl =
  'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-50m.json';

const MapChart = ({ markers }: MapDisplayType) => {
  const [zoom, setZoom] = React.useState(1);
  const groupedCities = getGroupedCities(markers);

  const radiusByCity = getRadius(groupedCities);

  const onMoveEnd = (e: any) => {
    setZoom(e.zoom);
  };

  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{
        rotate: [-20.0, 0, 0],
        scale: 150,
        center: [-40, 28],
        // parallels: [40, 80],
      }}
      width={980}
      height={440}
      style={{
        // width: '100%',
        height: 'auto',
      }}
    >
      <ZoomableGroup zoom={1} onMoveEnd={onMoveEnd}>
        <Geographies geography={geoUrl}>
          {({ geographies }: any) =>
            geographies.map((geo: any) => (
              <Geography
                key={geo.rsmKey}
                strokeWidth={0.2}
                geography={geo}
                fill="#EAEAEC"
                stroke="#D6D6DA"
                style={{
                  default: {
                    fill: '#FFF',
                    stroke: '#d0d0d0',
                    strokeWidth: 0.2,
                    outline: 'none',
                  },
                  hover: {
                    fill: '#FFF',
                    stroke: '#d0d0d0',
                    strokeWidth: 0.2,
                    outline: 'none',
                  },
                  // pressed: {
                  //   fill: '#FF5722',
                  //   stroke: '#607D8B',
                  //   strokeWidth: 0.75,
                  //   outline: 'none',
                  // },
                }}
              />
            ))
          }
        </Geographies>
        {groupedCities.map(({ items, value }: any, i: number) => {
          const { lat, lon } = items[0];
          return (
            <OverlayTrigger
              key={value + i}
              placement="top"
              delay={{ show: 250, hide: 400 }}
              overlay={(props: any) => (
                <Tooltip id={value + i} {...props} show={props.show.toString()}>
                  {value}: {items.length} nodes
                </Tooltip>
              )}
            >
              <Marker
                coordinates={[lon, lat]}
                // onMouseEnter={() => {
                //   const { NAME, POP_EST } = geo.properties;
                //   setTooltipContent(`${name} — ${rounded(POP_EST)}`);
                // }}
                // onMouseLeave={() => {
                //   setTooltipContent('');
                // }}
              >
                <circle
                  r={radiusByCity[value] / zoom}
                  fill="#1b46c2"
                  stroke="#FFF"
                  strokeWidth={1 / zoom}
                />
                <text
                  textAnchor="middle"
                  y={2}
                  style={{ fontFamily: 'system-ui', fill: '#5D5A6D' }}
                >
                  {/* {name} */}
                </text>
              </Marker>
            </OverlayTrigger>
          );
        })}
      </ZoomableGroup>
    </ComposableMap>
  );
};

export default MapChart;
