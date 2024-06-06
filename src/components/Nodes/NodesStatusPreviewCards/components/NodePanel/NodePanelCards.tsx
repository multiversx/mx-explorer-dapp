import classNames from 'classnames';
import { useSelector } from 'react-redux';

import {
  NodeLockedStake,
  NodeQualification,
  NodeRating,
  NodeStatus,
  ShardLink
} from 'components';
import { useIsSovereign } from 'hooks';
import { nodesOverviewSelector } from 'redux/selectors';
import { NodeType, NodeStatusEnum } from 'types';

import { PanelCard } from './PanelCard';
import { TimeRemainingPanelCard } from './TimeRemainingPanelCard';

export const NodePanelCards = ({
  node,
  index
}: {
  node: NodeType;
  index?: number;
}) => {
  const isSovereign = useIsSovereign();
  const { nodes } = useSelector(nodesOverviewSelector);

  return (
    <dl className='node-panel-cards'>
      <PanelCard title='Name'>
        {node.name ? (
          <div className='truncate-item-lg' title={node.name}>
            {node.name}
          </div>
        ) : (
          <span className='text-neutral-400'>N/A</span>
        )}
      </PanelCard>
      <PanelCard title='Version'>
        {node.version ? node.version : 'N/A'}
      </PanelCard>
      <PanelCard title={isSovereign ? 'Chain' : 'Shard'}>
        <ShardLink shard={node.shard} />
      </PanelCard>
      <PanelCard title='Rating'>
        <NodeRating node={node} />
      </PanelCard>
      <PanelCard title='Status' featured>
        <NodeStatus node={node} />
      </PanelCard>
      {node.status === NodeStatusEnum.auction ? (
        <PanelCard
          title='Auction Status'
          className={classNames({
            'border danger-zone': node.auctionQualified && node.isInDangerZone
          })}
          featured
        >
          <NodeQualification node={node} showLed={node.auctionQualified} />
        </PanelCard>
      ) : (
        <>
          {index !== undefined && (
            <PanelCard title='List Index' featured>
              <span className='text-neutral-200'>{index}</span> of{' '}
              {nodes.length}
            </PanelCard>
          )}
        </>
      )}
      <PanelCard
        title={
          node.status === NodeStatusEnum.auction
            ? 'Qualified Stake'
            : 'Locked Stake'
        }
        featured
      >
        <NodeLockedStake node={node} showLabel={false} />
      </PanelCard>
      <TimeRemainingPanelCard node={node} />
    </dl>
  );
};
