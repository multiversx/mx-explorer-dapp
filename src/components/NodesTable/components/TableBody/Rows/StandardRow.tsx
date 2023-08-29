import {
  ShardSpan,
  NetworkLink,
  Trim,
  Led,
  Overlay,
  Denominate
} from 'components';
import { urlBuilder } from 'helpers';
import { NodeType } from 'types';
import { RowFullHistory } from '../../RowFullHistory';
import { RowIcon } from '../../RowIcon';
import { RowIssueIcon } from '../../RowIssueIcon';

export const StandardRow = ({
  nodeData,
  index,
  type,
  status
}: {
  nodeData: NodeType;
  index: number;
  type?: NodeType['type'];
  status?: NodeType['status'];
}) => {
  const ValidatorLockedStakeTooltip = () => {
    if (
      (type === 'validator' && nodeData.locked && nodeData.stake) ||
      nodeData.topUp
    ) {
      return (
        <>
          {nodeData.stake && (
            <div>
              Staked: <Denominate value={nodeData.stake} showTooltip={false} />
            </div>
          )}
          {nodeData.topUp && (
            <div>
              Top up: <Denominate value={nodeData.topUp} showTooltip={false} />
            </div>
          )}
        </>
      );
    }

    return null;
  };

  return (
    <>
      <td>
        <div className='d-flex align-items-center hash'>
          <RowIcon node={nodeData} />
          <RowFullHistory node={nodeData} />
          <NetworkLink
            to={urlBuilder.nodeDetails(nodeData.bls)}
            className='trim-wrapper'
          >
            <Trim text={nodeData.bls} />
          </NetworkLink>
          <RowIssueIcon node={nodeData} />
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
      <td className='text-end' style={{ maxWidth: '8rem' }}>
        {nodeData.validatorIgnoredSignatures ? (
          nodeData.validatorIgnoredSignatures.toLocaleString('en')
        ) : (
          <span className='text-neutral-400'>N/A</span>
        )}
      </td>
      <td>
        <div className='d-flex align-items-center justify-content-end'>
          <Led color={nodeData.online ? 'bg-success' : 'bg-danger'} />
          <span
            className={`ms-2 ${
              nodeData.online ? 'text-success' : 'text-danger'
            }`}
          >
            {nodeData.online ? 'online' : 'offline'}
          </span>
        </div>
      </td>
      <td className='text-end'>
        {!isNaN(nodeData.tempRating) ? (
          Math.floor(nodeData.tempRating)
        ) : (
          <span className='text-neutral-400'>N/A</span>
        )}
      </td>
      <td className='text-end'>
        {nodeData.nonce ? (
          nodeData.nonce
        ) : (
          <span className='text-neutral-400'>N/A</span>
        )}
      </td>

      {status === 'queued' && (
        <td className='text-end'>
          {nodeData.position ? (
            <div className='truncate-item-lg'>{nodeData.position}</div>
          ) : (
            <span className='text-neutral-400'>N/A</span>
          )}
        </td>
      )}

      {type === 'validator' && nodeData.locked && (
        <td className='text-end'>
          <Overlay title={<ValidatorLockedStakeTooltip />}>
            <Denominate value={nodeData.locked} showTooltip={false} />
          </Overlay>
        </td>
      )}
    </>
  );
};
