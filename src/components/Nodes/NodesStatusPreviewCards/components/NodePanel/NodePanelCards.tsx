import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { ELLIPSIS } from 'appConstants';
import {
  NodeLockedStake,
  NodeQualification,
  NodeRating,
  NodeStatus,
  ShardLink
} from 'components';
import { formatBigNumber } from 'helpers';
import { useGetEpochRemainingTime, useIsSovereign } from 'hooks';
import { nodesOverviewSelector } from 'redux/selectors';
import { NodeType, NodeStatusEnum, WithClassnameType } from 'types';

export interface PanelCardUIType extends WithClassnameType {
  title?: React.ReactNode;
  children?: React.ReactNode;
  featured?: boolean;
}

export const PanelCard = ({
  title,
  children,
  featured,
  className
}: PanelCardUIType) => {
  if (!(title || children)) {
    return null;
  }

  return (
    <div
      className={classNames('panel-card', className, { featured: featured })}
    >
      {title && <dt>{title}</dt>}
      {children && <dd>{children}</dd>}
    </div>
  );
};

const TimeRemainingPanelCard = ({ node }: { node: NodeType }) => {
  const { epoch, remainingTime, isStatsFetched } = useGetEpochRemainingTime();
  const [days, hours, minutes, seconds] = remainingTime;

  const getRemainingTimeTitle = () => {
    if (node.status === NodeStatusEnum.auction) {
      return 'Auction ends in';
    }
    if (node.status === NodeStatusEnum.eligible) {
      return 'Next Rewards';
    }

    return <>Epoch {formatBigNumber({ value: epoch })} end</>;
  };

  return (
    <PanelCard
      title={getRemainingTimeTitle()}
      className='text-primary'
      featured
    >
      {isStatsFetched ? (
        <>
          {days.time && days.time !== '00' && (
            <>
              <span className='time-container'>{days.time}</span>d{' '}
            </>
          )}
          <span className='time-container'>{hours.time}</span>h{' '}
          <span className='time-container'>{minutes.time}</span>m{' '}
          <span className='time-container'>{seconds.time}</span>s
        </>
      ) : (
        ELLIPSIS
      )}
    </PanelCard>
  );
};

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
