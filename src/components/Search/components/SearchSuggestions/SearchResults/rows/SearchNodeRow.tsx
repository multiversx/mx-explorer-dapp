import {
  NetworkLink,
  NodeChangingShardIcon,
  NodeFullHistoryIcon,
  NodeIssueIcon,
  NodeOnlineIcon,
  NodeStatus,
  SharedIdentity,
  Trim
} from 'components';
import { urlBuilder } from 'helpers';
import { NodeType, NodeTypeEnum } from 'types';

export const SearchNodeRow = ({ node }: { node?: NodeType }) => {
  if (!node) {
    return;
  }

  return (
    <NetworkLink
      to={urlBuilder.nodeDetails(node.bls)}
      className='search-suggestion selectable'
    >
      <div className='search-text d-flex align-items-center gap-1'>
        <div className='d-flex align-items-center'>
          <SharedIdentity.Avatar
            identity={node.identityInfo}
            className='identity-avatar-md me-1'
            showTooltip
          />
          <NodeOnlineIcon node={node} />
        </div>
        <div className='hash small-hash trim text-truncate d-flex align-items-center gap-1'>
          <Trim text={node.bls} />
          <NodeChangingShardIcon node={node} />
          <NodeFullHistoryIcon node={node} small={true} />
          <NodeIssueIcon node={node} />
        </div>
        {node.name && (
          <div
            className='hash trim text-truncate text-neutral-500'
            title={node.name}
          >
            ({node.name})
          </div>
        )}
      </div>
      <div className='ms-auto'>
        {node.type !== NodeTypeEnum.observer && <NodeStatus node={node} />}
      </div>
    </NetworkLink>
  );
};
