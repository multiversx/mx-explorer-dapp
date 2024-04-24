import BigNumber from 'bignumber.js';
import classNames from 'classnames';

import { ELLIPSIS, ZERO } from 'appConstants';
import {
  FormatAmount,
  NodeThreshold,
  LockedStakeTooltip,
  Overlay,
  Led,
  NodeDangerZoneTooltip,
  FormatNumber,
  NetworkLink,
  SharedIdentity,
  Trim
} from 'components';
import { urlBuilder } from 'helpers';

import { AuctionListBaseRowUIType } from './types';

export const AuctionListBaseRow = ({
  validator,
  index,
  details,
  showPosition = true,
  className
}: AuctionListBaseRowUIType) => {
  const {
    name,
    stake,
    owner,
    identity,
    avatar,
    auctionTopUp,
    qualifiedStake,
    auctionValidators,
    qualifiedAuctionValidators,
    dangerZoneValidators,
    droppedValidators,
    auctionPosition
  } = validator;

  const identityLink = identity
    ? urlBuilder.identityDetails(identity)
    : owner
    ? urlBuilder.providerDetails(owner)
    : name
    ? urlBuilder.nodeDetails(name)
    : '';

  const bNauctionValidators = new BigNumber(auctionValidators ?? 0);
  const bNqualifiedAuctionValidators = new BigNumber(
    qualifiedAuctionValidators ?? 0
  );

  const computedDroppedValidators = bNauctionValidators
    .minus(bNqualifiedAuctionValidators)
    .toNumber();
  const displayDroppedValidators =
    droppedValidators ?? computedDroppedValidators;

  return (
    <tr
      key={auctionPosition ?? index}
      className={classNames(className, {
        q: bNqualifiedAuctionValidators.isGreaterThan(0),
        nq: bNqualifiedAuctionValidators.isZero()
      })}
    >
      {showPosition && <td>{auctionPosition ?? index + 1}</td>}
      <td>
        <div className='d-flex align-items-center'>
          <NetworkLink to={identityLink}>
            <SharedIdentity.Avatar identity={{ identity, name, avatar }} />
          </NetworkLink>
          <div className='d-flex flex-column'>
            {identityLink && (
              <NetworkLink
                to={identityLink}
                className='trim-wrapper trim-size-xl font-headings-regular'
              >
                {name && name.length > 70 ? (
                  <Trim text={name} />
                ) : (
                  <>{name ?? 'N/A'}</>
                )}
              </NetworkLink>
            )}
            {details && (
              <span className='text-neutral-400 trim-wrapper trim-size-xl'>
                <Trim text={details} className='text-neutral-400' />
              </span>
            )}
          </div>
        </div>
      </td>
      <td>{auctionValidators ? auctionValidators : ELLIPSIS}</td>
      <td className='text-red-400'>
        {displayDroppedValidators ? displayDroppedValidators : ZERO}
      </td>
      <td>
        <div
          className={classNames('d-flex align-items-center gap-2', {
            'text-success': qualifiedAuctionValidators,
            'text-red-400': !qualifiedAuctionValidators
          })}
        >
          <Led
            color={classNames('mt-0', {
              'bg-success': qualifiedAuctionValidators,
              'bg-red-400': !qualifiedAuctionValidators
            })}
          />
          {qualifiedAuctionValidators && qualifiedAuctionValidators > 0 ? (
            <FormatNumber value={qualifiedAuctionValidators} />
          ) : (
            ZERO
          )}
          {new BigNumber(dangerZoneValidators ?? 0).isGreaterThan(0) &&
            qualifiedStake && (
              <NodeDangerZoneTooltip qualifiedStake={qualifiedStake} />
            )}
        </div>
      </td>
      <td className='text-neutral-100'>
        {qualifiedStake ? (
          <Overlay
            title={
              <LockedStakeTooltip
                stake={stake}
                auctionTopUp={auctionTopUp}
                showAuctionTopup
              />
            }
            tooltipClassName='tooltip-text-start tooltip-lg'
            persistent
            truncate
          >
            <FormatAmount value={qualifiedStake} showTooltip={false} />
          </Overlay>
        ) : (
          ELLIPSIS
        )}
      </td>
      <td>
        <NodeThreshold qualifiedStake={qualifiedStake} showPercentage />
      </td>
    </tr>
  );
};
