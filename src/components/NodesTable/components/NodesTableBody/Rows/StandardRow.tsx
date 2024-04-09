import classNames from 'classnames';
import { useSelector } from 'react-redux';

import {
  NodeRating,
  NodeStatus,
  ShardSpan,
  NetworkLink,
  Trim,
  Overlay,
  FormatAmount,
  NodeStatusIcon,
  NodeIssueIcon,
  NodeFullHistoryIcon,
  NodeLockedStakeTooltip,
  NodeQualification
} from 'components';
import { urlBuilder } from 'helpers';
import { stakeSelector } from 'redux/selectors';
import { NodeType } from 'types';

export interface StandardRowUIType {
  nodeData: NodeType;
  index: number;
  type?: NodeType['type'];
  status?: NodeType['status'];
  showTresholdRow?: boolean;
  showPosition?: boolean;
}

export const StandardRow = ({
  nodeData,
  index,
  type,
  status,
  showPosition
}: StandardRowUIType) => {
  const {
    unprocessed: { notQualifiedAuctionValidators }
  } = useSelector(stakeSelector);

  const isInDangerZone =
    nodeData.isInDangerZone &&
    nodeData.auctionQualified &&
    notQualifiedAuctionValidators &&
    status === 'auction';

  return (
    <tr
      className={classNames({
        dz: isInDangerZone
      })}
    >
      {status === 'queued' && (
        <td>
          {nodeData.position ? (
            <div>{nodeData.position}</div>
          ) : (
            <span className='text-neutral-400'>N/A</span>
          )}
        </td>
      )}
      {status === 'auction' && showPosition && (
        <td>{index ?? nodeData.auctionPosition}</td>
      )}
      <td>
        <div className='d-flex align-items-center gap-1 hash'>
          <NodeStatusIcon node={nodeData} />
          <NodeFullHistoryIcon node={nodeData} small={true} />
          <NetworkLink
            to={urlBuilder.nodeDetails(nodeData.bls)}
            className='trim-wrapper'
          >
            <Trim text={nodeData.bls} />
          </NetworkLink>
          <NodeIssueIcon node={nodeData} />
        </div>
      </td>
      <td>
        {nodeData.name ? (
          <div className='truncate-item-lg'>{nodeData.name}</div>
        ) : (
          <span className='text-neutral-400'>N/A</span>
        )}
      </td>
      <td>
        <div className='d-flex'>
          {nodeData.shard !== undefined ? (
            <NetworkLink
              to={urlBuilder.shard(nodeData.shard)}
              data-testid={`shardLink${index}`}
            >
              <ShardSpan shard={nodeData.shard} />
            </NetworkLink>
          ) : (
            <span className='text-neutral-400'>N/A</span>
          )}
        </div>
      </td>
      <td>
        {nodeData.version ? (
          nodeData.version
        ) : (
          <span className='text-neutral-400'>N/A</span>
        )}
      </td>
      {status !== 'auction' && (
        <td className='text-end' style={{ maxWidth: '8rem' }}>
          {nodeData.validatorIgnoredSignatures ? (
            nodeData.validatorIgnoredSignatures.toLocaleString('en')
          ) : (
            <span className='text-neutral-400'>N/A</span>
          )}
        </td>
      )}
      <td>
        <NodeStatus node={nodeData} className='align-items-end' />
      </td>
      {status === 'auction' && (
        <td className='text-end'>
          <NodeQualification
            node={nodeData}
            showDangerZone={true}
            className='justify-content-end'
          />
        </td>
      )}
      {(type === 'validator' || status === 'auction') && nodeData.locked && (
        <td className='text-end'>
          {status !== 'auction' || nodeData.auctionQualified ? (
            <Overlay
              title={
                <NodeLockedStakeTooltip
                  node={nodeData}
                  showAuctionTopup={status === 'auction'}
                />
              }
              tooltipClassName='tooltip-text-start tooltip-lg'
              truncate
            >
              <FormatAmount value={nodeData.locked} showTooltip={false} />
            </Overlay>
          ) : (
            <FormatAmount value={nodeData.locked} />
          )}
        </td>
      )}
      <td className='text-end'>
        <NodeRating node={nodeData} className='justify-content-end' />
      </td>
      <td className='text-end'>
        {nodeData.nonce ? (
          nodeData.nonce
        ) : (
          <span className='text-neutral-400'>N/A</span>
        )}
      </td>
    </tr>
  );
};
