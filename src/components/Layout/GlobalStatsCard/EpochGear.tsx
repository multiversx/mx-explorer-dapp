import * as React from 'react';
import { ReactComponent as CenterGear } from 'assets/images/network-health/center-gear.svg';
import { ReactComponent as EpochGearBg } from 'assets/images/epoch-gear-bg.svg';
import ProgressRing from '../../Home/NetworkHealth/ProgressRing';
import { initialStats } from 'helpers/processStats';
import moment from 'moment';

const EpochGear = ({ stats, showTime }: { stats: typeof initialStats; showTime?: boolean }) => {
  const ref = React.useRef(null);
  const pageHidden = document.hidden;
  const play = !pageHidden;
  const refreshIntervalSec = 6;

  const [nextEpoch, setNextEpoch] = React.useState<any>();
  const [epochDurationSec, setEpochDurationSec] = React.useState(0);

  const [hours, setHours] = React.useState('0');
  const [minutes, setMinutes] = React.useState('0');
  const [seconds, setSeconds] = React.useState('0');
  const [percentRemaining, setPercentRemaining] = React.useState(0);

  const [roundsLeft, setRoundsLeft] = React.useState<number | undefined>();
  const [resetCount, setResetCount] = React.useState(0);

  const init = () => {
    if (stats.epoch !== '...') {
      const secondsUntilNextEpoch =
        refreshIntervalSec * (stats.roundsPerEpoch - stats.roundsPassed);
      const nextEpochDate: any = moment().utc().add(secondsUntilNextEpoch, 'seconds');

      if (ref.current !== null) {
        setNextEpoch(nextEpochDate);
        setEpochDurationSec(refreshIntervalSec * stats.roundsPerEpoch);
        setRoundsLeft(stats.roundsPerEpoch - stats.roundsPassed);
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

  React.useEffect(init, [stats]);

  const calculate = () => {
    const now: any = moment();
    const diff = moment(nextEpoch).diff(now);

    const hours = moment.utc(diff).format('H');
    const minutes = moment.utc(diff).format('mm');
    const seconds = moment.utc(diff).format('ss');
    const percentRemaining = ((nextEpoch.unix() - now.unix()) * 100) / epochDurationSec;

    if (ref.current !== null) {
      if (percentRemaining <= 0) {
        hardReset(stats.roundsPerEpoch);
      } else {
        setHours(hours);
        setMinutes(minutes);
        setSeconds(seconds);
        setPercentRemaining(100 - percentRemaining);
        setRoundsLeft((roundsLeft) => (roundsLeft && roundsLeft > 0 ? roundsLeft - 1 : roundsLeft));
      }
    }
  };

  const mount = () => {
    if (nextEpoch) {
      calculate();
      const interval = setInterval(calculate, showTime ? 1000 : 6000);
      return () => {
        clearInterval(interval);
      };
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(mount, [nextEpoch]);

  return (
    <div className="ml-lg-2 mr-lg-4 pr-lg-3 mb-4 mb-lg-0" ref={ref}>
      <div className="epoch-gear-container">
        <EpochGearBg className="epoch-gear-bg" />
        <div className={`animate ${play ? '' : 'paused'}`}>
          <CenterGear className="position-relative w-100 h-100" />
        </div>
        <div className="gear-content">
          <ProgressRing progress={percentRemaining} />
          {showTime ? (
            <>
              <span className="mt-2 pt-2">
                {nextEpoch ? (
                  <>
                    {hours}h {minutes}m {seconds}s
                  </>
                ) : (
                  <>...</>
                )}
              </span>

              {nextEpoch !== undefined && (
                <small className="text-secondary">Epoch {stats.epoch + resetCount}</small>
              )}
            </>
          ) : (
            <>
              <span className="mt-1 pt-2">
                {nextEpoch ? <>Epoch {stats.epoch + resetCount}</> : <>...</>}
              </span>
              {roundsLeft !== undefined && (
                <small className="text-secondary">
                  {roundsLeft.toLocaleString('en')} Rounds <br /> Left
                </small>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EpochGear;
