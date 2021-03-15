import * as React from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { MarkerType, LeaderType } from '../helpers/asyncRequests';
import countries from './countries100m.json';
import { useGlobalState } from 'context';

interface SimpleMapType {
  markers: MarkerType[];
  leaders: LeaderType[];
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
      radius = 5;
  }

  return radius;
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
        {city}: {`${validators} node${validators === 1 ? '' : 's'}`}
      </Tooltip>
    )}
  >
    {children}
  </OverlayTrigger>
);

const SimpleMap = ({ markers, leaders }: SimpleMapType) => {
  const {
    refresh: { timestamp },
  } = useGlobalState();

  const ref = React.useRef(null);

  const isLeader = (city: string) => {
    return leaders.filter((leader) => leader.city === city).length === 1;
  };

  const [blink /*setBlink*/] = React.useState(false);
  // React.useEffect(() => {
  //   if (ref.current !== null) {
  //     setBlink(true);
  //     setTimeout(() => {
  //       setBlink(false);
  //     }, 1000);
  //   }
  // }, [timestamp]);

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
        {markers.map(({ city, longitude, latitude, validators }, i) => (
          <Marker key={city} coordinates={[longitude, latitude]}>
            {isLeader(city) ? (
              <MarkerToolTip city={city} validators={validators}>
                <circle
                  r={calcRadius(validators)}
                  className={`simple-map-marker ${blink ? 'blink' : ''}`}
                />
              </MarkerToolTip>
            ) : (
              <MarkerToolTip city={city} validators={validators}>
                <circle r={calcRadius(validators)} className="simple-map-marker" />
              </MarkerToolTip>
            )}
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
};

export default SimpleMap;
