import * as React from 'react';
import { ReactComponent as Gear } from 'assets/images/network-health/gear.svg';
import { ReactComponent as CenterGear } from 'assets/images/network-health/center-gear.svg';
import { ReactComponent as LayoutGear } from 'assets/images/network-health/layout-gear.svg';
import ProgressRing from './ProgressRing';

const NetworkHealth = () => {
  const [epochProgress, setEpochProgress] = React.useState(0);
  const [blockTimeProgress, setBlockTimeProgress] = React.useState(0);
  const progressStep = 10;

  React.useEffect(() => {
    const intervalEpoch = setInterval(() => {
      setEpochProgress((epochProgress) => {
        if (epochProgress >= 100) {
          setEpochProgress(0);
        }
        return epochProgress + progressStep;
      });
    }, 1000);
    return () => clearInterval(intervalEpoch);
  }, []);

  React.useEffect(() => {
    const intervalBlockTime = setInterval(() => {
      setBlockTimeProgress((blockTimeProgress) => {
        if (blockTimeProgress >= 100) {
          setBlockTimeProgress(0);
        }
        return blockTimeProgress + progressStep;
      });
    }, 2000);
    return () => clearInterval(intervalBlockTime);
  }, []);

  return (
    <div className="card network-health">
      <div className="card-header">
        <div className="card-header-item d-flex justify-content-between align-items-center">
          <h6 className="m-0">Network Health</h6>
        </div>
      </div>
      <div className="card-body d-flex justify-content-center align-items-center">
        <div className="position-relative flex-fill">
          <LayoutGear className="layout-gear" />

          <div className="gear-container top-left">
            <Gear className="gear rotate" />
            <div className="gear-content">
              <small>Accounts</small>
            </div>
          </div>

          <div className="gear-container top-right">
            <Gear className="gear rotate" />
            <div className="gear-content">
              <small>Transactions</small>
            </div>
          </div>

          <div className="gear-container center">
            <CenterGear className="gear" />
            <div className="gear-content">
              <ProgressRing radius={60} stroke={3} progress={epochProgress} />
              <small>Epoch</small>
            </div>
          </div>

          <div className="gear-container bottom-left">
            <Gear className="gear rotate" />
            <div className="gear-content">
              <small>Block Height</small>
            </div>
          </div>

          <div className="gear-container bottom-right">
            <Gear className="gear rotate" />
            <div className="gear-content">
              <ProgressRing
                radius={60}
                stroke={3}
                progress={blockTimeProgress}
                dotted={progressStep}
              />
              <small>Block Time</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkHealth;
