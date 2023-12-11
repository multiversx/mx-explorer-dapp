import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

import { ELLIPSIS } from 'appConstants';
import {
  CopyButton,
  Denominate,
  NetworkLink,
  ShardSpan,
  ScAddressIcon,
  Trim,
  TimeAgo,
  PropertyPill,
  FormatUSD,
  Overlay,
  AccountLink
} from 'components';
import { DECIMALS } from 'config';
import { isContract, urlBuilder } from 'helpers';
import { useAdapter } from 'hooks';
import { faExclamationTriangle, faInfoCircle } from 'icons/regular';
import { activeNetworkSelector, accountSelector } from 'redux/selectors';
import { AccountUpgradeType } from 'types';
import { StatsCard, SmallStatsCard } from 'widgets';

import { ApplicationDetailItem } from './components/ApplicationDetailItem';
import { VerifiedBadge } from './components/VerifiedBadge';

export const ApplicationDetailsCard = () => {
  const ref = useRef(null);

  const { account } = useSelector(accountSelector);
  const {
    address,
    balance,
    shard,
    ownerAddress,
    developerReward,
    deployedAt,
    scamInfo,
    isUpgradeable,
    isReadable,
    isPayable,
    isPayableBySmartContract,
    assets,
    txCount
  } = account;
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { getProvider, getAccountUpgrades } = useAdapter();

  const [accountLatestUpgrade, setAccountLatestUpgrade] =
    React.useState<AccountUpgradeType>();

  const [isProvider, setIsProvider] = useState(false);
  const fetchProviderDetails = () => {
    if (isContract(address)) {
      getProvider({ address }).then(({ success, data }) => {
        if (ref.current !== null) {
          if (success && data !== undefined) {
            setIsProvider(true);
          }
        }
      });
    }
  };

  const fetchUpgradesDetails = () => {
    if (isContract(address)) {
      getAccountUpgrades({ address, size: 1 }).then(({ success, data }) => {
        if (ref.current !== null) {
          if (success && data !== undefined && data.length > 0) {
            setAccountLatestUpgrade(data[0]);
          }
        }
      });
    }
  };

  useEffect(() => {
    fetchProviderDetails();
    fetchUpgradesDetails();
  }, [activeNetworkId, address]);

  return (
    <div ref={ref} className='application-details-card card card-black mb-3'>
      <div className='card-body'>
        <div className='application-details d-flex gap-spacer mb-5'>
          {assets?.name && assets?.iconSvg && (
            <img
              src={assets.iconSvg}
              className='application-logo border d-none d-md-flex col-md-3'
              alt=' '
            />
          )}
          <div className='application-overview d-flex flex-column flex-fill col-9 gap-3'>
            {assets?.name && (
              <h1 className='application-name mb-0'>
                {assets?.iconSvg && (
                  <img
                    src={assets.iconSvg}
                    className='application-logo border d-md-none'
                    alt=' '
                  />
                )}
                {assets.name} {!scamInfo && <VerifiedBadge />}
              </h1>
            )}
            {scamInfo && (
              <span className='text-warning d-flex align-items-center ms-2'>
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  size='sm'
                  className='text-warning me-2'
                />
                {scamInfo.info}
              </span>
            )}
            {assets?.description && (
              <p className='application-description text-neutral-400'>
                {assets.description}
              </p>
            )}
            <ApplicationDetailItem title='Owner'>
              {ownerAddress !== undefined ? (
                <div className='d-flex align-items-center'>
                  {ownerAddress !== address ? (
                    <AccountLink address={ownerAddress} />
                  ) : (
                    <>
                      <ScAddressIcon initiator={ownerAddress} />
                      <Trim text={ownerAddress} />
                    </>
                  )}
                  <CopyButton text={ownerAddress} />
                </div>
              ) : (
                <span className='text-neutral-400'>N/A</span>
              )}
            </ApplicationDetailItem>
            <ApplicationDetailItem title='Address'>
              <div className='d-flex align-items-center'>
                <ScAddressIcon initiator={address} />
                <Trim text={address} className='text-neutral-400' />
                <CopyButton text={address} />{' '}
                {shard !== undefined && (
                  <span className='ms-2 text-nowrap text-neutral-400'>
                    (
                    <NetworkLink
                      to={urlBuilder.shard(shard)}
                      data-testid='shardLink'
                    >
                      <ShardSpan shard={shard} />
                    </NetworkLink>
                    )
                  </span>
                )}
              </div>
            </ApplicationDetailItem>
            <ApplicationDetailItem title='Properties'>
              <div className='d-flex alig-items-center flex-wrap gap-2'>
                <PropertyPill
                  name={'Upgradeable'}
                  active={Boolean(isUpgradeable)}
                />
                <PropertyPill name={'Readable'} active={Boolean(isReadable)} />
                <PropertyPill name={'Payable'} active={Boolean(isPayable)} />
                <PropertyPill
                  name={'Payable by Smart Contract'}
                  active={Boolean(isPayableBySmartContract)}
                />
              </div>
            </ApplicationDetailItem>
          </div>
        </div>
        <div className='application-cards d-flex flex-wrap gap-3'>
          <StatsCard
            title='Balance'
            value={
              <>
                {balance !== ELLIPSIS ? (
                  <>
                    <Denominate
                      value={balance}
                      decimals={4}
                      data-testid='balance'
                    />
                    <FormatUSD
                      amount={balance}
                      decimals={DECIMALS}
                      digits={2}
                      className='balance-usd'
                    />
                  </>
                ) : (
                  balance
                )}
              </>
            }
            showSymbol={balance !== ELLIPSIS}
          />
          <StatsCard
            title='Rewards'
            value={
              <>
                {developerReward !== undefined ? (
                  <>
                    <Denominate value={developerReward} decimals={4} />
                    <FormatUSD
                      amount={developerReward}
                      decimals={DECIMALS}
                      digits={2}
                      className='balance-usd'
                    />
                  </>
                ) : (
                  <span className='text-neutral-400'>N/A</span>
                )}
              </>
            }
            showSymbol={developerReward !== undefined}
          />
          <StatsCard
            title='Total Transactions'
            value={new BigNumber(txCount).toFormat()}
          />

          <div className='d-flex flex-column gap-3'>
            <SmallStatsCard
              title='First Deployed'
              value={
                <>
                  {deployedAt !== undefined ? (
                    <TimeAgo value={deployedAt} short showAgo tooltip />
                  ) : (
                    <span className='text-neutral-400'>N/A</span>
                  )}
                </>
              }
            />
            <SmallStatsCard
              title='Latest Upgrade'
              value={
                <>
                  {accountLatestUpgrade !== undefined ? (
                    <div className='d-flex align-items-center gap-2'>
                      <TimeAgo
                        value={accountLatestUpgrade.timestamp}
                        short
                        showAgo
                        tooltip
                      />
                      <Overlay
                        title={
                          <>
                            <span className='text-neutral-400'>
                              Upgrade Transaction:
                            </span>
                            {accountLatestUpgrade.txHash && (
                              <NetworkLink
                                to={urlBuilder.transactionDetails(
                                  accountLatestUpgrade.txHash
                                )}
                                data-testid='upgradeTxHashLink'
                                className='trim-wrapper'
                              >
                                <Trim text={accountLatestUpgrade.txHash} />
                              </NetworkLink>
                            )}
                          </>
                        }
                        className='cursor-context'
                        persistent
                      >
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className='text-neutral-500'
                        />
                      </Overlay>
                    </div>
                  ) : (
                    <span className='text-neutral-400'>N/A</span>
                  )}
                </>
              }
            />
          </div>
          {isProvider && (
            <NetworkLink
              to={urlBuilder.providerDetails(address)}
              className='btn btn-sm btn-primary mt-auto'
            >
              Provider Details
            </NetworkLink>
          )}
        </div>
      </div>
    </div>
  );
};
