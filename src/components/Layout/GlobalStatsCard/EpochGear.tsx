import * as React from 'react';
import { ReactComponent as CenterGear } from 'assets/images/network-health/center-gear.svg';
import ProgressRing from '../../Home/NetworkHealth/ProgressRing';
import { initialStats } from 'helpers/processStats';
import moment from 'moment';

const EpochGear = ({ stats }: { stats: typeof initialStats }) => {
  const ref = React.useRef(null);
  const pageHidden = document.hidden;
  const play = !pageHidden;

  const [nextEpoch, setNextEpoch] = React.useState<any>();
  const [hours, setHours] = React.useState('0');
  const [minutes, setMinutes] = React.useState('0');
  const [percentRemaining, setPercentRemaining] = React.useState(0);

  const init = () => {
    if (stats.epoch !== '...') {
      const secondsUntilNextEpoch = 6 * (stats.roundsPerEpoch - stats.roundsPassed);
      const nextEpochDate: any = moment().utc().add(secondsUntilNextEpoch, 'seconds');
      if (ref.current !== null) {
        setNextEpoch(nextEpochDate);
      }
    }
  };

  React.useEffect(init, [stats]);

  const calculate = () => {
    const now: any = moment();
    const diff = moment(nextEpoch).diff(now);

    const hours = moment.utc(diff).format('H');
    const minutes = moment.utc(diff).format('mm');
    const percentRemaining = ((nextEpoch.unix() - now.unix()) * 100) / 86400;

    if (ref.current !== null) {
      setHours(hours);
      setMinutes(minutes);
      setPercentRemaining(100 - percentRemaining);
    }
  };

  const mount = () => {
    if (nextEpoch) {
      calculate();
      const interval = setInterval(calculate, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(mount, [nextEpoch]);

  return (
    <div ref={ref} className="gear-container center">
      <div className={`animate ${play ? '' : 'paused'}`}>
        <CenterGear className="w-100 h-100" />
      </div>
      <div className="gear-content">
        <ProgressRing progress={percentRemaining} />
        <span data-testid="epochTimeRemaining">
          {nextEpoch ? (
            <>
              {hours}:{minutes}
            </>
          ) : (
            <>...</>
          )}
        </span>
        <small className="text-secondary">Epoch {stats.epoch}</small>
      </div>
    </div>
  );
};

export default EpochGear;
