import * as React from 'react';
import { ReactComponent as CenterGear } from 'assets/images/network-health/center-gear.svg';
import { ReactComponent as EpochGearBg } from 'assets/images/epoch-gear-bg.svg';
import ProgressRing from '../../Home/NetworkHealth/ProgressRing';
import { initialStats } from 'helpers/processStats';
import moment from 'moment';

const EpochGear = ({ stats }: { stats: typeof initialStats }) => {
  const ref = React.useRef(null);
  const pageHidden = document.hidden;
  const play = !pageHidden;

  const [nextEpoch, setNextEpoch] = React.useState<any>();
  // const [hours, setHours] = React.useState('0');
  // const [minutes, setMinutes] = React.useState('0');
  const [percentRemaining, setPercentRemaining] = React.useState(0);
  const [roundsLeft, setRoundsLeft] = React.useState<number | undefined>();

  const init = () => {
    if (stats.epoch !== '...') {
      const secondsUntilNextEpoch = 6 * (stats.roundsPerEpoch - stats.roundsPassed);
      const nextEpochDate: any = moment().utc().add(secondsUntilNextEpoch, 'seconds');

      if (ref.current !== null) {
        setNextEpoch(nextEpochDate);
        setRoundsLeft(stats.roundsPerEpoch - stats.roundsPassed);
      }
    }
  };

  React.useEffect(init, [stats]);

  const calculate = () => {
    const now: any = moment();
    // const diff = moment(nextEpoch).diff(now);

    // const hours = moment.utc(diff).format('H');
    // const minutes = moment.utc(diff).format('mm');
    const percentRemaining = ((nextEpoch.unix() - now.unix()) * 100) / 86400;

    if (ref.current !== null) {
      // setHours(hours);
      // setMinutes(minutes);
      setPercentRemaining(100 - percentRemaining);
      setRoundsLeft((roundsLeft) => (roundsLeft && roundsLeft > 0 ? roundsLeft - 1 : roundsLeft));
    }
  };

  const mount = () => {
    if (nextEpoch) {
      calculate();
      const interval = setInterval(calculate, 6000);
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
          <span className="mt-1 pt-1">{nextEpoch ? <>Epoch {stats.epoch}</> : <>...</>}</span>
          {roundsLeft && (
            <small className="text-secondary">
              {roundsLeft.toLocaleString('en')} Rounds <br /> Left
            </small>
          )}
        </div>
      </div>
    </div>
  );
};

export default EpochGear;
