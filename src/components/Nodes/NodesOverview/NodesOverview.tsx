import classNames from 'classnames';

import { NodesStatusPreviewCards, NodesEpochStatusCards } from 'components';
import { WithClassnameType } from 'types';

export interface NodesOverviewUIType extends WithClassnameType {
  title?: string;
}

export const NodesOverview = ({
  title = 'Nodes Validation Status',
  className
}: NodesOverviewUIType) => {
  return (
    <div className={classNames('nodes-overview', className)}>
      <div className='row gy-3'>
        <div className='col-lg-6'>
          <NodesStatusPreviewCards title={title} />
        </div>
        <div className='col-lg-6'>
          <NodesEpochStatusCards />
        </div>
      </div>
    </div>
  );
};
