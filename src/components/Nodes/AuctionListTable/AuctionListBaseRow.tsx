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
import { AuctionValidatorType } from 'types';

import { AuctionListBaseRowUIType } from './types';

const getIdentityLink = (validator: AuctionValidatorType) => {
  const { identity, provider, bls, owner } = validator;
  if (identity) {
    return urlBuilder.identityDetails(identity);
  }
  if (provider) {
    return urlBuilder.providerDetails(provider);
  }
  if (bls) {
    return urlBuilder.nodeDetails(bls);
  }
  if (owner) {
    return urlBuilder.accountDetailsNodes(owner);
  }

  return '';
};

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
    bls,
    provider,
    auctionTopUp,
    qualifiedStake,
    auctionValidators,
    qualifiedAuctionValidators,
    dangerZoneValidators,
    droppedValidators,
    auctionPosition
  } = validator;

  const identityLink = getIdentityLink(validator);

  const bNauctionValidators = new BigNumber(auctionValidators ?? 0);
  const bNqualifiedAuctionValidators = new BigNumber(
    qualifiedAuctionValidators ?? 0
  );

  const computedDroppedValidators = bNauctionValidators
    .minus(bNqualifiedAuctionValidators)
    .toNumber();
  const formattedDroppedValidators =
    droppedValidators ?? computedDroppedValidators;

  const IdentityName = () => {
    if (name) {
      return <>{name.length > 70 ? <Trim text={name} /> : name}</>;
    }
    if (provider) {
      return <Trim text={provider} />;
    }
    if (bls) {
      return <Trim text={bls} />;
    }
    if (owner) {
      return <Trim text={owner} />;
    }
    return 'N/A';
  };

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
            <SharedIdentity.Avatar
              identity={{ identity, name, avatar }}
              className='identity-avatar-md me-2'
            />
          </NetworkLink>
          <div className='d-flex flex-column'>
            <NetworkLink
              to={identityLink}
              className='trim-wrapper trim-size-xl font-headings-regular'
            >
              <IdentityName />
            </NetworkLink>
            {details && (
              <span className='text-neutral-400 trim-wrapper trim-size-xl'>
                <Trim text={details} className='text-neutral-400' />
              </span>
            )}
          </div>
        </div>
      </td>
      <td>{auctionValidators ? auctionValidators : ELLIPSIS}</td>
      <td>
        <div
          className={classNames('d-flex align-items-center gap-2', {
            'text-success': qualifiedAuctionValidators,
            'text-neutral-400': !qualifiedAuctionValidators
          })}
        >
          <Led
            color={classNames('mt-0', {
              'bg-success': qualifiedAuctionValidators,
              'bg-neutral-400': !qualifiedAuctionValidators
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
      <td
        className={classNames('mt-0', {
          'text-red-400': formattedDroppedValidators,
          'text-neutral-400': !formattedDroppedValidators
        })}
      >
        {formattedDroppedValidators ? formattedDroppedValidators : ZERO}
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
