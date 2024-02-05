import {
  NetworkLink,
  Trim,
  NodeStatus,
  NodeIcon,
  NodeIssueIcon
} from 'components';
import { urlBuilder } from 'helpers';
import { NodeType } from 'types';

export const QueueRow = ({ nodeData }: { nodeData: NodeType }) => {
  return (
    <>
      <td>
        {nodeData.position ? (
          <div className='truncate-item-lg'>
            {nodeData.position.toLocaleString('en')}
          </div>
        ) : (
          <span className='text-neutral-400'>N/A</span>
        )}
      </td>
      <td>
        <div className='d-flex align-items-center hash'>
          <NodeIcon node={nodeData} />
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
      <td>
        <NodeStatus node={nodeData} className='align-items-end' />
      </td>
    </>
  );
};
