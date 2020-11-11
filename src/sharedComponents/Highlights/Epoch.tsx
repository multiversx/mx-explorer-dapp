import * as React from 'react';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/pro-regular-svg-icons/faClock';
import { adapter } from 'sharedComponents';
import { useGlobalState } from 'context';

const Epoch = () => {
  const { activeNetworkId } = useGlobalState();
  const { getNetworkStatus } = adapter();

  const ref = React.useRef(null);

  const [hours, setHours] = React.useState('0');
  const [minutes, setMinutes] = React.useState('0');
  const [percentRemaning, setPercentRemaning] = React.useState(100);
  const [nextEpochDate, setNextEpochDate] = React.useState<any>();
  const [epoch, setEpoch] = React.useState(-1);

  const calculate = () => {
    const now: any = moment();
    const diff = moment(nextEpochDate).diff(now);

    const hours = moment.utc(diff).format('H');
    const minutes = moment.utc(diff).format('mm');

    const percentRemaning = ((nextEpochDate.unix() - now.unix()) * 100) / 86400;

    if (ref.current) {
      setHours(hours);
      setMinutes(minutes);
      setPercentRemaning(percentRemaning);
      if (nextEpochDate.unix() - now.unix() <= 0) {
        setEpoch((epoch) => epoch + 1);
        setNextEpochDate(moment(nextEpochDate).add(24, 'hours'));
      }
    }
  };

  const getNetworkStatusData = () => {
    getNetworkStatus().then(({ data, success }) => {
      if (success && data) {
        const secondsUntilNextEpoch = 6 * (data.roundsPerEpoch - data.roundsPassed);
        const nextEpochDate: any = moment().utc().add(secondsUntilNextEpoch, 'seconds');
        setNextEpochDate(nextEpochDate);
        setEpoch(data.epoch);
      }
    });
  };

  React.useEffect(getNetworkStatusData, [activeNetworkId]);

  const mount = () => {
    if (nextEpochDate) {
      calculate();
      const interval = setInterval(calculate, 6000);
      return () => {
        clearInterval(interval);
      };
    }
  };

  React.useEffect(mount, [nextEpochDate]);

  return (
    <li className="my-3 px-2" ref={ref}>
      <div className="highlight-item d-flex align-items-center">
        <FontAwesomeIcon className="fa-2x" icon={faClock} />
        <div className="d-flex flex-column ml-3">
          <small className="mb-1 epoch-label">EPOCH</small>
          <span className="d-flex">
            <span className="h5 mb-0 current-epoch">
              {epoch >= 0 ? epoch.toLocaleString('en') : '...'}
            </span>
            <div className="px-2">
              <div className="epoch-time d-flex flex-column">
                <div className="epoch-progress">
                  <div className="fill" style={{ width: `${100 - percentRemaning}%` }}>
                    &nbsp;
                  </div>
                </div>
                <small data-testid="metaEpochTimeRemaining">
                  {nextEpochDate ? `${hours}:${minutes}` : '...'} remaining
                </small>
              </div>
            </div>
          </span>
        </div>
      </div>
    </li>
  );
};

export default Epoch;
