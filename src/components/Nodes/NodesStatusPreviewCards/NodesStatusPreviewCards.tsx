import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { stakeSelector } from 'redux/selectors';

import {
  NodeStatusEnum,
  NodeStatusPreviewType,
  WithClassnameType
} from 'types';
import { NodeStatusCategory } from './components';

export interface NodesStatusPreviewCardsUIType extends WithClassnameType {
  nodes: NodeStatusPreviewType[];
  title?: string;
}

export const NodesStatusPreviewCards = ({
  nodes,
  title = 'Nodes Validation Status',
  className
}: NodesStatusPreviewCardsUIType) => {
  const { queueSize, auctionValidators } = useSelector(stakeSelector);
  const indexedNodes = nodes.map((node, index) => {
    return { index: index + 1, ...node };
  });

  return (
    <div
      className={classNames(
        'nodes-status-preview-cards d-flex flex-column gap-3 font-headings-regular',
        className
      )}
    >
      <h2 className='h5'>{title}</h2>
      <NodeStatusCategory
        nodes={indexedNodes}
        status={NodeStatusEnum.eligible}
      />
      <NodeStatusCategory
        nodes={indexedNodes}
        status={NodeStatusEnum.waiting}
      />
      {queueSize && (
        <NodeStatusCategory
          nodes={indexedNodes}
          status={NodeStatusEnum.queued}
        />
      )}
      {auctionValidators && (
        <NodeStatusCategory
          nodes={indexedNodes}
          status={NodeStatusEnum.auction}
        />
      )}
      <NodeStatusCategory
        title='Others'
        nodes={indexedNodes}
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
