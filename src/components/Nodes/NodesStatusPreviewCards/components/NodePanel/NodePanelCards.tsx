import classNames from 'classnames';
import { useSelector } from 'react-redux';

import {
  NodeLockedStake,
  NodeQualification,
  NodeRating,
  NodeStatus,
  PreviewPanelCard,
  ShardLink
} from 'components';
import { useIsSovereign } from 'hooks';
import { nodesOverviewSelector } from 'redux/selectors';
import { NodeType, NodeStatusEnum } from 'types';

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
    <dl className='preview-panel-cards'>
      <PreviewPanelCard title='Name'>
        {node.name ? (
          <div className='truncate-item-lg' title={node.name}>
            {node.name}
          </div>
        ) : (
          <span className='text-neutral-400'>N/A</span>
        )}
      </PreviewPanelCard>
      <PreviewPanelCard title='Version'>
        {node.version ? node.version : 'N/A'}
      </PreviewPanelCard>
      <PreviewPanelCard title={isSovereign ? 'Chain' : 'Shard'}>
        <ShardLink shard={node.shard} />
      </PreviewPanelCard>
      <PreviewPanelCard title='Rating'>
        <NodeRating node={node} />
      </PreviewPanelCard>
      <PreviewPanelCard title='Status' featured>
        <NodeStatus node={node} />
      </PreviewPanelCard>
      {node.status === NodeStatusEnum.auction ? (
        <PreviewPanelCard
          title='Auction Status'
          className={classNames({
            'border border-warning':
              node.auctionQualified && node.isInDangerZone
          })}
          featured
        >
          <NodeQualification node={node} showLed={node.auctionQualified} />
        </PreviewPanelCard>
      ) : (
        <>
          {index !== undefined && (
            <PreviewPanelCard title='List Index' featured>
              <span className='text-neutral-200'>{index}</span> of{' '}
              {nodes.length}
            </PreviewPanelCard>
          )}
        </>
      )}
      <PreviewPanelCard
        title={
          node.status === NodeStatusEnum.auction
            ? 'Qualified Stake'
            : 'Locked Stake'
        }
        featured
      >
        <NodeLockedStake node={node} showLabel={false} />
      </PreviewPanelCard>
      <TimeRemainingPanelCard node={node} />
    </dl>
  );
};
