import React, { useEffect, useRef, useState } from 'react';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import { useSelector } from 'react-redux';

import { ELLIPSIS, REFRESH_RATE } from 'appConstants';
import { ProgressRing } from 'components';
import { statsSelector } from 'redux/selectors';
import { WithClassnameType } from 'types';

export interface EpochRingType extends WithClassnameType {
  showTime?: boolean;
}

export const EpochProgressRing = ({
  showTime = true,
  className
}: EpochRingType) => {
  const ref = useRef(null);

  const { isFetched, unprocessed } = useSelector(statsSelector);

  const refreshInterval = unprocessed?.refreshRate
    ? unprocessed.refreshRate
    : REFRESH_RATE;
  const refreshIntervalSec = refreshInterval / 1000;

  const [nextEpoch, setNextEpoch] = useState<any>();
  const [epochDurationSec, setEpochDurationSec] = useState<number>(0);

  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('0');
  const [seconds, setSeconds] = useState('0');
  const [percentRemaining, setPercentRemaining] = useState(0);

  const [roundsLeft, setRoundsLeft] = useState<number | undefined>();
  const [resetCount, setResetCount] = useState(0);

  const init = () => {
    if (isFetched) {
      const secondsUntilNextEpoch =
        refreshIntervalSec *
        (unprocessed?.roundsPerEpoch - unprocessed?.roundsPassed);
      const nextEpochDate: any = moment()
        .utc()
        .add(secondsUntilNextEpoch, 'seconds');

      if (ref.current !== null) {
        setNextEpoch(nextEpochDate);
        setEpochDurationSec(refreshIntervalSec * unprocessed?.roundsPerEpoch);
        setRoundsLeft(unprocessed?.roundsPerEpoch - unprocessed?.roundsPassed);
      }
    }
  };

  const hardReset = (roundsPerEpoch: number) => {
    const nextEpochDate: any = moment().utc().add(epochDurationSec, 'seconds');

    if (ref.current !== null) {
      setNextEpoch(nextEpochDate);
      setRoundsLeft(roundsPerEpoch);
      setResetCount((resetCount) => resetCount + 1);
    }
  };

  const calculate = () => {
    const now: any = moment();
    const diff = moment(nextEpoch).diff(now);

    const hours = moment.utc(diff).format('H');
    const minutes = moment.utc(diff).format('mm');
    const seconds = moment.utc(diff).format('ss');
    const percentRemaining =
      ((nextEpoch.unix() - now.unix()) * 100) / epochDurationSec;

    if (ref.current !== null) {
      if (percentRemaining <= 0) {
        hardReset(unprocessed?.roundsPerEpoch);
      } else {
        setHours(hours);
        setMinutes(minutes);
        setSeconds(seconds);
        setPercentRemaining(100 - percentRemaining);
        setRoundsLeft((roundsLeft) =>
          roundsLeft && roundsLeft > 0 ? roundsLeft - 1 : roundsLeft
        );
      }
    }
  };

  const mount = () => {
    if (nextEpoch) {
      calculate();
      const interval = setInterval(calculate, refreshInterval);
      return () => {
        clearInterval(interval);
      };
    }
  };

  useEffect(init, [isFetched, unprocessed]);

  React.useEffect(mount, [nextEpoch]);

  const timeLabel = nextEpoch ? `${hours}h ${minutes}m ${seconds}s` : '...';
  const epochLabel = new BigNumber(unprocessed?.epoch + resetCount).toFormat(0);

  return (
    <div className={`epoch-progress-ring ${className ?? ''}`} ref={ref}>
      <ProgressRing progress={percentRemaining} size={140} hasBg>
        <div className='label' data-testid='currentEpoch'>
          {epochLabel ? (
            <>
              Epoch
              <br />
              {epochLabel}
            </>
          ) : (
            ELLIPSIS
          )}
        </div>
        <div
          className='description'
          {...(showTime ? { title: timeLabel } : {})}
        >
          {roundsLeft ? (
            <>{new BigNumber(roundsLeft).toFormat(0)} Rounds Left</>
          ) : (
            '...'
          )}
        </div>
      </ProgressRing>
    </div>
  );
};
