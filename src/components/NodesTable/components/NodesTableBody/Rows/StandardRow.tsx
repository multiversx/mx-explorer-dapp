import classNames from 'classnames';

import {
  NodeRating,
  NodeStatus,
  ShardSpan,
  NetworkLink,
  Trim,
  Overlay,
  Denominate,
  NodeStatusIcon,
  NodeIssueIcon,
  NodeFullHistoryIcon,
  NodeLockedStakeTooltip,
  NodeQualification
} from 'components';
import { urlBuilder } from 'helpers';
import { useGetSort } from 'hooks';
import { NodeType, SortOrderEnum } from 'types';

import { AuctionListTresholdRow } from './AuctionListTresholdRow';

export interface StandardRowUIType {
  nodeData: NodeType;
  index: number;
  type?: NodeType['type'];
  status?: NodeType['status'];
  showTresholdRow?: boolean;
}

export const StandardRow = ({
  nodeData,
  index,
  type,
  status,
  showTresholdRow
}: StandardRowUIType) => {
  const { sort, order } = useGetSort();
  const isSortDesc = sort === 'auctionPosition' && order === SortOrderEnum.desc;

  const showTreshold = showTresholdRow && status === 'auction';

  return (
    <>
      {isSortDesc && showTreshold && (
        <AuctionListTresholdRow colSpan={10} isSortDesc />
      )}
      <tr
        className={classNames({
          'row-danger':
            nodeData?.isInDangerZone &&
            nodeData.auctionQualified &&
            status === 'auction'
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
        {status === 'auction' && <td>{index ?? nodeData.auctionPosition}</td>}
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
            <Overlay
              title={<NodeLockedStakeTooltip node={nodeData} />}
              tooltipClassName='tooltip-text-start tooltip-lg'
              className='cursor-context'
            >
              <Denominate value={nodeData.locked} showTooltip={false} />
            </Overlay>
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
      {!isSortDesc && showTreshold && <AuctionListTresholdRow colSpan={10} />}
    </>
  );
};
