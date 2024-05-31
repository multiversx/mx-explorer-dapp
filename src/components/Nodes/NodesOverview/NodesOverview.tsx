import classNames from 'classnames';

import { NodesStatusPreviewCards, NodesEpochStatusCards } from 'components';
import { NodeStatusPreviewType, WithClassnameType } from 'types';

export interface NodesOverviewUIType extends WithClassnameType {
  nodes: NodeStatusPreviewType[];
  title?: string;
}

export const NodesOverview = ({
  nodes,
  title = 'Nodes Validation Status',
  className
}: NodesOverviewUIType) => {
  return (
    <div
      className={classNames(
        'nodes-overview card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3',
        className
      )}
    >
      <div className='nodes-table-hero font-headings-regular w-100'>
        <div className='row mb-4 gy-3'>
          <div className='col-xl-6'>
            <NodesStatusPreviewCards nodes={nodes} title={title} />
          </div>
          <div className='col-xl-6'>
            <NodesEpochStatusCards />
          </div>
        </div>
      </div>
    </div>
  );
};
