import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import {
  NodeQualification,
  NetworkLink,
  Trim,
  Overlay,
  FormatAmount,
  NodeDangerZoneTooltip,
  NodeFullHistoryIcon,
  NodeIssueIcon,
  NodeLockedStakeTooltip,
  NodeTreshold,
  SharedIdentity
} from 'components';
import { urlBuilder } from 'helpers';
import { nodesIdentitiesSelector, stakeSelector } from 'redux/selectors';
import { NodeType, WithClassnameType } from 'types';

export interface AuctionListBaseRowUIType extends WithClassnameType {
  nodeData: NodeType;
  index?: number;
  showPosition?: boolean;
}

export const AuctionListBaseRow = ({
  nodeData,
  index,
  showPosition,
  className
}: AuctionListBaseRowUIType) => {
  const { nodesIdentities } = useSelector(nodesIdentitiesSelector);
  const { isFetched: isStakeFetched, minimumAuctionQualifiedStake } =
    useSelector(stakeSelector);

  if (!isStakeFetched || !minimumAuctionQualifiedStake) {
    return null;
  }

  const bNLocked = new BigNumber(nodeData.locked);
  const bNMinimumAuctionStake = new BigNumber(minimumAuctionQualifiedStake);

  const isDangerZone =
    nodeData.isInDangerZone &&
    nodeData.auctionQualified &&
    bNLocked.isGreaterThanOrEqualTo(bNMinimumAuctionStake);

  const nodeIdentity = nodesIdentities.find(
    (identity) => nodeData.identity && identity.identity === nodeData.identity
  );
  const nodeIdentityLink = nodeData.identity
    ? urlBuilder.identityDetails(nodeData.identity)
    : urlBuilder.nodeDetails(nodeData.bls);

  return (
    <tr
      className={classNames(className, {
        q: nodeData.auctionQualified && !isDangerZone,
        dz: isDangerZone,
        nq: !nodeData.auctionQualified
      })}
    >
      {showPosition && <td>{index ?? nodeData.auctionPosition}</td>}
      <td>
        <NodeQualification node={nodeData} showDangerZone={false} />
      </td>
      <td>
        <div className='d-flex align-items-center'>
          {nodeIdentity && (
            <NetworkLink to={nodeIdentityLink}>
              <SharedIdentity.Avatar identity={nodeIdentity} />
            </NetworkLink>
          )}
          <div className='d-flex flex-column'>
            {nodeIdentity && (
              <NetworkLink
                to={nodeIdentityLink}
                className='trim-wrapper trim-size-xl'
              >
                {nodeIdentity?.name && nodeIdentity.name.length > 70 ? (
                  <Trim text={nodeIdentity?.name} />
                ) : (
                  <>{nodeIdentity?.name ?? 'N/A'}</>
                )}
              </NetworkLink>
            )}
            {nodeData.name ? (
              <div className='truncate-item-lg text-neutral-400'>
                {nodeData.name}
              </div>
            ) : (
              <span className='text-neutral-400'>N/A</span>
            )}
          </div>
        </div>
      </td>
      <td>
        <div className='d-flex align-items-center gap-1 hash'>
          <NodeFullHistoryIcon node={nodeData} />
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
        <Overlay
          title={<NodeLockedStakeTooltip node={nodeData} showAuctionTopup />}
          tooltipClassName='tooltip-text-start tooltip-lg'
          className='cursor-context'
          persistent
        >
          <FormatAmount value={bNLocked.toString(10)} showTooltip={false} />
        </Overlay>
      </td>
      <td>
        <NodeTreshold node={nodeData} />
      </td>
      <td>
        <NodeDangerZoneTooltip node={nodeData} />
      </td>
    </tr>
  );
};
