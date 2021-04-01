import * as React from 'react';
import { ReactComponent as CenterGear } from 'assets/images/network-health/center-gear.svg';
import ProgressRing from '../../Home/NetworkHealth/ProgressRing';
import { initialStats } from 'helpers/processStats';

const EpochGear = ({ stats }: { stats: typeof initialStats }) => {
  const pageHidden = document.hidden;
  const play = !pageHidden;

  return (
    <div className="gear-container center">
      <div className={`animate ${play ? '' : 'paused'}`}>
        <CenterGear className="w-100 h-100" />
      </div>
      <div className="gear-content">
        <ProgressRing progress={stats.epochPercentage} />
        <span data-testid="epochTimeRemaining">{stats.epochTimeRemaining}</span>
        <small className="text-secondary">Epoch {stats.epoch}</small>
      </div>
    </div>
  );
};

export default EpochGear;
