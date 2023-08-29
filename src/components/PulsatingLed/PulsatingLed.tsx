import { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';

import { refreshSelector } from 'redux/selectors';
import { WithClassnameType } from 'types/withClassname.types';

export const PulsatingLed = ({ className }: WithClassnameType) => {
  const intervalRef = useRef<any>(null);
  const { timestamp } = useSelector(refreshSelector);
  const [hasAnimation, setHasAnimation] = useState<boolean>(false);

  const setLoopInterval = () => {
    setHasAnimation(true);
    intervalRef.current = setInterval(() => {
      const withinInterval = moment().subtract(2000, 'ms').isBefore(timestamp);

      if (!document.hidden && !withinInterval) {
        setHasAnimation(false);
      }
    }, 2000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  };

  useEffect(setLoopInterval, [timestamp]);

  return (
    <div className={`pulsating-led ${className}`}>
      <div className={`pulse ${hasAnimation ? 'animation' : ''}`}></div>
      <div className='circle'></div>
    </div>
  );
};
