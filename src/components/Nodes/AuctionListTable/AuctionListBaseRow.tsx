import { useState } from 'react';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';

import { ELLIPSIS, ZERO, MAX_RESULTS } from 'appConstants';
import {
  FormatAmount,
  AuctionThreshold,
  LockedStakeTooltip,
  Overlay,
  Led,
  NodeDangerZoneTooltip,
  FormatNumber,
  NetworkLink,
  SharedIdentity,
  Trim,
  Loader,
  PageState,
  NodesTable
} from 'components';
import { urlBuilder } from 'helpers';
import { useAdapter } from 'hooks';
import { faCogs } from 'icons/regular';
import {
  AuctionValidatorType,
  NodeType,
  NodeTypeEnum,
  SortOrderEnum
} from 'types';

import { AuctionListBaseRowUIType } from './types';

const getIdentityLink = (validator: AuctionValidatorType) => {
  const { identity, provider, owner } = validator;
  if (identity) {
    return urlBuilder.identityDetails(identity);
  }
  if (provider) {
    return urlBuilder.providerDetails(provider);
  }
  if (owner) {
    return urlBuilder.accountDetailsNodes(owner);
  }

  return '';
};

const getNodesFilters = (validator: AuctionValidatorType) => {
  const { auctionValidators, identity, provider, owner } = validator;
  if (!auctionValidators || !(identity || provider || owner)) {
    return;
  }

  return {
    size: MAX_RESULTS,
    type: NodeTypeEnum.validator,
    sort: 'qualifiedStake',
    order: SortOrderEnum.desc,
    isAuctioned: true,
    withIdentityInfo: true,
    ...(identity ? { identity } : {}),
    ...(provider ? { provider } : {}),
    ...(owner ? { owner } : {})
  };
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
    provider,
    auctionTopUp,
    qualifiedStake,
    auctionValidators,
    qualifiedAuctionValidators,
    dangerZoneValidators,
    droppedValidators,
    auctionPosition
  } = validator;

  const { getNodes } = useAdapter();

  const [collapsed, setCollapsed] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [dataReady, setDataReady] = useState<boolean | undefined>();
  const [identityNodes, setIdentityNodes] = useState<NodeType[]>([]);

  const expand = (auctionValidator: AuctionValidatorType) => () => {
    if (dataReady === undefined) {
      const nodeFilters = getNodesFilters(auctionValidator);
      if (nodeFilters) {
        getNodes(nodeFilters).then((nodes) => {
          setDataReady(nodes.success);
          setIdentityNodes(nodes.data);
        });
      }
    }
    setShowDetails(true);
    setCollapsed((collapsed) => !collapsed);
  };

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
    if (owner) {
      return <Trim text={owner} />;
    }
    return 'N/A';
  };

  return (
    <>
      <tr
        key={auctionPosition ?? index}
        onClick={expand(validator)}
        className={classNames('auction-list-row', className, {
          q: bNqualifiedAuctionValidators.isGreaterThan(0),
          nq: bNqualifiedAuctionValidators.isZero(),
          collapsed: collapsed,
          'cursor-pointer': auctionValidators && auctionValidators > 0
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
                {details && (
                  <span className='text-neutral-400 ms-1'>({details})</span>
                )}
              </NetworkLink>
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
          <AuctionThreshold qualifiedStake={qualifiedStake} showPercentage />
        </td>
      </tr>
      {showDetails && (
        <tr
          className={classNames('auction-list-expand-row', {
            collapsed: collapsed
          })}
        >
          <td colSpan={7} className='p-0'>
            <div className='content'>
              {dataReady === undefined && (
                <div className='py-4'>
                  <Loader small={true} noText={true} />
                </div>
              )}
              {dataReady === false && (
                <PageState
                  icon={faCogs}
                  title='Unable to load validators'
                  isError
                />
              )}
              {dataReady === true && (
                <div className='nodes-table-wrapper py-2 px-4'>
                  <NodesTable hideFilters={true} auctionList>
                    <NodesTable.Body
                      nodes={identityNodes}
                      showTresholdRow={false}
                      showPosition
                      auctionList
                    />
                  </NodesTable>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};
