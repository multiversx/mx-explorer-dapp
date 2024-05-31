import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { stakeSelector } from 'redux/selectors';

import {
  NodeStatusEnum,
  NodeStatusPreviewType,
  WithClassnameType
} from 'types';
import { NodeStatusCategory } from './components';

export interface NodesPreviewUIType extends WithClassnameType {
  nodes: NodeStatusPreviewType[];
  title?: string;
}

export const NodesStatusPreview = ({
  nodes,
  title = 'Nodes Validation Status',
  className
}: NodesPreviewUIType) => {
  const { queueSize, auctionValidators } = useSelector(stakeSelector);
  const indexedNodes = nodes.map((node, index) => {
    return { index: index + 1, ...node };
  });

  return (
    <div
      className={classNames(
        'nodes-status-preview d-flex flex-column gap-2 font-headings-regular',
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
