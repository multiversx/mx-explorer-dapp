import * as React from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { MarkerType } from '../helpers/asyncRequests';
import countries from './countries100m.json';
import { useGlobalState } from 'context';

interface SimpleMapType {
  markers: MarkerType[];
}

const calcRadius = (validators: number) => {
  let radius;

  switch (true) {
    case validators > 20:
      radius = 8;
      break;

    case validators > 50:
      radius = 12;
      break;

    case validators > 100:
      radius = 16;
      break;

    default:
      radius = 6;
  }

  return radius;
};

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const MarkerToolTip = ({
  children,
  city,
  validators,
}: {
  children: React.ReactNode;
  city: string;
  validators: number;
}) => (
  <OverlayTrigger
    placement="top"
    delay={{ show: 0, hide: 400 }}
    overlay={(props) => (
      <Tooltip id="marker-tooltip" {...props}>
        {city ? `${city}:` : ''} {`${validators} node${validators === 1 ? '' : 's'}`}
      </Tooltip>
    )}
  >
    {children}
  </OverlayTrigger>
);

const SimpleMap = ({ markers }: SimpleMapType) => {
  const ref = React.useRef(null);
  const {
    refresh: { timestamp },
  } = useGlobalState();

  const [leaders, setLeaders] = React.useState<string[]>([]);

  const isLeader = (city: string) => {
    return leaders.includes(city);
  };

  const chooseLeaders = () => {
    if (ref.current !== null && markers.length > 0) {
      const newLeaders: string[] = [];
      const newMax = getRandomInt(1, 1);

      while (newLeaders.length !== newMax) {
        const candidate = markers[getRandomInt(1, markers.length) - 1];
        if (candidate && candidate.city && !newLeaders.includes(candidate.city)) {
          newLeaders.push(candidate.city);
        }
      }

      setLeaders(newLeaders);

      setTimeout(() => {
        if (ref.current !== null) {
          setLeaders([]);
        }
      }, 2800);
    }
  };

  React.useEffect(chooseLeaders, [timestamp]);

  return (
    <div className="simple-map" ref={ref}>
      <ComposableMap
        projectionConfig={{
          scale: 200,
          center: [15, 0],
        }}
      >
        <Geographies geography={countries}>
          {({ geographies }: any) =>
            geographies.map((geo: any) => <Geography key={geo.rsmKey} geography={geo} />)
          }
        </Geographies>
        {markers.map(({ city, longitude, latitude, validators }) => (
          <Marker key={longitude} coordinates={[longitude, latitude]}>
            <MarkerToolTip city={city} validators={validators}>
              <g>
                <circle
                  r={calcRadius(validators)}
                  className={`simple-map-marker ${isLeader(city) ? 'leader' : ''}`}
                />
                {isLeader(city) && <circle className="pulse" r={calcRadius(validators)} />}
              </g>
            </MarkerToolTip>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
};

export default SimpleMap;
