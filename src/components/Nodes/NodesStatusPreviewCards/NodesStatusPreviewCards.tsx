import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { stakeSelector } from 'redux/selectors';

import { NodeStatusEnum, WithClassnameType } from 'types';
import { NodeStatusCategory } from './components';

export interface NodesStatusPreviewCardsUIType extends WithClassnameType {
  title?: string;
}

export const NodesStatusPreviewCards = ({
  title = 'Nodes Status',
  className
}: NodesStatusPreviewCardsUIType) => {
  const { queueSize, auctionValidators } = useSelector(stakeSelector);

  return (
    <div
      className={classNames(
        'nodes-status-preview-cards d-flex flex-column gap-3 font-headings-regular',
        className
      )}
    >
      <h2 className='h5 mb-2'>{title}</h2>
      <NodeStatusCategory status={NodeStatusEnum.eligible} />
      <NodeStatusCategory status={NodeStatusEnum.waiting} />
      {queueSize && <NodeStatusCategory status={NodeStatusEnum.queued} />}
      {auctionValidators && (
        <NodeStatusCategory status={NodeStatusEnum.auction} />
      )}
      <NodeStatusCategory
        title='Others'
        excludedStatuses={[
          NodeStatusEnum.eligible,
          NodeStatusEnum.waiting,
          NodeStatusEnum.queued,
          NodeStatusEnum.auction
        ]}
      />
    </div>
  );
};
