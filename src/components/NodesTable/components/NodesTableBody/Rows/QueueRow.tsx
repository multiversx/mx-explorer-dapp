import {
  NetworkLink,
  Trim,
  NodeIssueIcon,
  SharedIdentity,
  NodeOnlineIcon
} from 'components';
import { urlBuilder } from 'helpers';
import { NodeType } from 'types';

export const QueueRow = ({ nodeData }: { nodeData: NodeType }) => {
  return (
    <tr>
      <td>
        <div className='d-flex align-items-center gap-1 hash hash-lg'>
          {nodeData.position ? (
            nodeData.position
          ) : (
            <span className='text-neutral-400'>N/A</span>
          )}
          <NodeOnlineIcon node={nodeData} className='ms-1 me-2' />
          <NetworkLink to={urlBuilder.nodeDetails(nodeData.bls)}>
            <SharedIdentity.Avatar
              identity={nodeData.identityInfo}
              className='identity-avatar-md me-1'
              showTooltip
            />
          </NetworkLink>
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
        {nodeData.version ? (
          nodeData.version
        ) : (
          <span className='text-neutral-400'>N/A</span>
        )}
      </td>
    </tr>
  );
};
