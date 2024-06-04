import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { NodesStatusPreviewCards, NodesEpochStatusCards } from 'components';
import { nodesOverviewSelector } from 'redux/selectors';
import { WithClassnameType } from 'types';

export interface NodesOverviewUIType extends WithClassnameType {
  title?: string;
}

export const NodesOverview = ({
  title = 'Nodes Validation Status',
  className
}: NodesOverviewUIType) => {
  const { nodes } = useSelector(nodesOverviewSelector);

  if (nodes.length === 0) {
    return null;
  }

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
