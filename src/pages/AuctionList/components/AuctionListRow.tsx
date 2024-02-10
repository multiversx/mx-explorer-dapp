import classNames from 'classnames';

import {
  NodeQualification,
  NetworkLink,
  Trim,
  Overlay,
  Denominate,
  NodeDangerZoneTooltip,
  NodeIcon,
  NodeFullHistoryIcon,
  NodeIssueIcon,
  NodeLockedStakeTooltip,
  SharedIdentity
} from 'components';
import { urlBuilder } from 'helpers';

import { NodeType, IdentityType, WithClassnameType } from 'types';

export interface AuctionListRowUIType extends WithClassnameType {
  node: NodeType;
  identities: IdentityType[];
}

export const AuctionListRow = ({
  node,
  identities,
  className
}: AuctionListRowUIType) => {
  const nodeIdentity = identities.find(
    (identity) => identity.identity === node.identity
  );

  const nodeIdentityLink = node.identity
    ? urlBuilder.identityDetails(node.identity)
    : urlBuilder.nodeDetails(node.bls);

  return (
    <tr
      className={classNames(className, { 'row-danger': node?.isInDangerZone })}
    >
      <td>{node.auctionPosition ?? node.position}</td>
      <td>
        <NodeQualification node={node} showDangerZone={false} />
      </td>
      <td>
        <div className='d-flex align-items-center'>
          {nodeIdentity && (
            <NetworkLink to={nodeIdentityLink}>
              <SharedIdentity.Avatar identity={nodeIdentity} />
            </NetworkLink>
          )}
          {nodeIdentity?.name && nodeIdentity.name.length > 70 ? (
            <NetworkLink
              to={nodeIdentityLink}
              className='trim-wrapper trim-size-xl'
            >
              <Trim text={nodeIdentity?.name} />
            </NetworkLink>
          ) : (
            <NetworkLink
              to={nodeIdentityLink}
              className='trim-wrapper trim-size-xl'
            >
              {nodeIdentity?.name ?? 'N/A'}
            </NetworkLink>
          )}
        </div>
      </td>
      <td>
        {node.name ? (
          <div className='truncate-item-lg'>{node.name}</div>
        ) : (
          <span className='text-neutral-400'>N/A</span>
        )}
      </td>
      <td>
        <div className='d-flex align-items-center hash'>
          <NodeIcon node={node} />
          <NodeFullHistoryIcon node={node} />
          <NetworkLink
            to={urlBuilder.nodeDetails(node.bls)}
            className='trim-wrapper'
          >
            <Trim text={node.bls} />
          </NetworkLink>
          <NodeIssueIcon node={node} />
        </div>
      </td>
      <td>
        <Overlay
          title={<NodeLockedStakeTooltip node={node} />}
          tooltipClassName='tooltip-text-start tooltip-lg'
          className='cursor-context'
        >
          <Denominate value={node.locked} showTooltip={false} />
        </Overlay>
      </td>
      <td></td>
      <td>
        <NodeDangerZoneTooltip node={node} />
      </td>
    </tr>
  );
};
