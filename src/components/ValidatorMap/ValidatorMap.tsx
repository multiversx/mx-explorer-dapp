import React, { useEffect, useRef, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from 'react-simple-maps';
import { MarkerType, WithClassnameType } from 'types';
import countries from './countries100m.json';

export interface ValidatorMapType extends WithClassnameType {
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
  validators
}: {
  children: React.ReactNode;
  city: string;
  validators: number;
}) => (
  <OverlayTrigger
    placement='top'
    delay={{ show: 0, hide: 400 }}
    overlay={(props) => (
      <Tooltip id='marker-tooltip' {...props}>
        {city ? `${city}:` : ''}{' '}
        {`${validators} node${validators === 1 ? '' : 's'}`}
      </Tooltip>
    )}
  >
    <>{children}</>
  </OverlayTrigger>
);

export const ValidatorMap = ({ markers, className }: ValidatorMapType) => {
  const ref = useRef(null);
  const [localMarkers, setLocalMarkers] = useState<MarkerType[]>([]);
  const [pulse, setPulse] = useState(0);
  const [pulseMarker, setPulseMarker] = useState<MarkerType | undefined>();

  useEffect(() => {
    setLocalMarkers(markers);
  }, [markers]);

  const chooseMarker = () => {
    if (ref.current !== null && localMarkers.length > 0) {
      let newPulseMarker;

      while (newPulseMarker === undefined) {
        const candidate =
          localMarkers[getRandomInt(1, localMarkers.length) - 1];
        if (candidate && candidate.city) {
          newPulseMarker = candidate;
        }
      }

      setPulseMarker(newPulseMarker);

      setTimeout(() => {
        setPulseMarker(undefined);
      }, 800);
    }
  };

  useEffect(chooseMarker, [pulse]);

  const pulseInterval = () => {
    const interval = setInterval(() => {
      if (ref.current !== null && !document.hidden) {
        setPulse((pulse) => pulse + 1);
      }
    }, 2000);
    return () => clearInterval(interval);
  };

  useEffect(pulseInterval, []);

  return (
    <div className={`validator-map ${className ?? ''}`} ref={ref}>
      <ComposableMap
        projectionConfig={{
          scale: 200,
          center: [15, 0]
        }}
      >
        <Geographies geography={countries}>
          {({ geographies }: any) =>
            geographies.map((geo: any) => (
              <Geography key={geo.rsmKey} geography={geo} />
            ))
          }
        </Geographies>
        {localMarkers.map(({ city, longitude, latitude, validators }) => (
          <Marker key={longitude} coordinates={[longitude, latitude]}>
            <MarkerToolTip city={city} validators={validators}>
              <g>
                <circle
                  r={calcRadius(validators)}
                  className={`validator-map-marker ${
                    pulseMarker && pulseMarker.city === city
                      ? 'pulse-marker'
                      : ''
                  }`}
                />
                {pulseMarker && pulseMarker.city === city && (
                  <circle className='pulse' r={calcRadius(validators)} />
                )}
              </g>
            </MarkerToolTip>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
};
