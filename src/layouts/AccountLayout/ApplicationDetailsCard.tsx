import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

import { ELLIPSIS } from 'appConstants';
import { ReactComponent as DefaultImage } from 'assets/img/default.svg';
import {
  CopyButton,
  FormatAmount,
  NetworkLink,
  ShardSpan,
  ScAddressIcon,
  Trim,
  TimeAgo,
  PropertyPill,
  FormatUSD,
  AccountLink,
  SocialIcons,
  SocialWebsite,
  HeroDetailsCard,
  InfoTooltip
} from 'components';

import { DECIMALS } from 'config';
import { isContract, urlBuilder } from 'helpers';
import { useAdapter } from 'hooks';
import { faExclamationTriangle } from 'icons/regular';
import { activeNetworkSelector, accountSelector } from 'redux/selectors';
import { AccountUpgradeType } from 'types';

export const ApplicationDetailsCard = () => {
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
    txCount,
    isVerified,
    ownerAssets
  } = account;
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { getProvider, getAccountUpgrades } = useAdapter();

  const [accountLatestUpgrade, setAccountLatestUpgrade] =
    useState<AccountUpgradeType>();
  const [isProvider, setIsProvider] = useState(false);

  const fetchApplicationDetails = () => {
    Promise.all([
      getProvider({ address }),
      getAccountUpgrades({ address, size: 1 })
    ]).then(([providerData, upgradeData]) => {
      if (providerData.success && providerData.data !== undefined) {
        setIsProvider(true);
      }
      if (upgradeData.success && (upgradeData.data ?? []).length > 0) {
        setAccountLatestUpgrade(upgradeData.data[0]);
      }
    });
  };

  const { website: _omit, ...socialIcons } = account.assets?.social ?? {};

  useEffect(() => {
    if (isContract(address)) {
      fetchApplicationDetails();
    }
  }, [activeNetworkId, address]);

  return (
    <HeroDetailsCard
      title={assets?.name ?? <Trim text={address} />}
      icon={assets?.iconSvg || assets?.iconPng}
      iconPlaceholder={<DefaultImage />}
      isVerified={isVerified}
      seoDetails={{
        text: `${assets?.name ? '' : `${address} App`}`,
        description: assets?.description,
        completeDetails: Boolean(assets?.name)
      }}
      data-testid-prefix='applications-'
      className='application-details'
      titleContent={
        isProvider ? (
          <NetworkLink
            to={urlBuilder.providerDetails(address)}
            className='btn btn-sm btn-primary'
          >
            Provider Details
          </NetworkLink>
        ) : null
      }
      descriptionContent={
        scamInfo ? (
          <span className='text-warning d-flex align-items-center ms-2'>
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              size='sm'
              className='text-warning me-2'
            />
            {scamInfo.info}
          </span>
        ) : null
      }
      detailItems={[
        {
          ...(assets?.description
            ? {
                title: 'Description',
                value: (
                  <div
                    className='description line-clamp-2'
                    title={assets.description}
                  >
                    {assets.description}
                  </div>
                )
              }
            : {})
        },
        {
          ...(account.assets?.social?.website
            ? {
                title: 'Website',
                value: <SocialWebsite link={account.assets.social.website} />
              }
            : {})
        },
        {
          ...(socialIcons && Object.keys(socialIcons).length > 0
            ? {
                title: 'Other Links',
                value: <SocialIcons assets={socialIcons} excludeWebsite />
              }
            : {})
        },
        {
          title: 'Address',
          value: (
            <>
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
            </>
          )
        },
        {
          title: 'Owner',
          value: (
            <>
              {ownerAddress !== undefined ? (
                <>
                  {ownerAddress !== address ? (
                    <AccountLink
                      address={ownerAddress}
                      assets={ownerAssets}
                      fetchAssets
                    />
                  ) : (
                    <>
                      <ScAddressIcon initiator={ownerAddress} />
                      <Trim text={ownerAddress} />
                    </>
                  )}
                  <CopyButton text={ownerAddress} />
                </>
              ) : (
                <span className='text-neutral-400'>N/A</span>
              )}
            </>
          )
        },
        {
          title: 'Properties',
          contentClassName: 'flex-wrap gap-2 mt-1 mt-lg-0',
          value: (
            <>
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
            </>
          )
        }
      ]}
      statsCards={[
        {
          title: 'Balance',
          value: (
            <>
              {balance !== ELLIPSIS ? (
                <div className='stats-card-content-container'>
                  <FormatAmount value={balance} data-testid='balance' />
                  <FormatUSD
                    value={balance}
                    decimals={DECIMALS}
                    className='balance-usd'
                  />
                </div>
              ) : (
                balance
              )}
            </>
          )
        },
        {
          title: 'Rewards',
          value: (
            <>
              {developerReward !== undefined ? (
                <div className='stats-card-content-container'>
                  <FormatAmount value={developerReward} />
                  <FormatUSD
                    value={developerReward}
                    decimals={DECIMALS}
                    className='balance-usd'
                  />
                </div>
              ) : (
                <span className='text-neutral-400'>N/A</span>
              )}
            </>
          )
        },
        {
          title: 'Total Transactions',
          value: new BigNumber(txCount).toFormat()
        }
      ]}
      smallStatsCards={[
        {
          title: 'First Deployed',
          value: (
            <>
              {deployedAt !== undefined ? (
                <TimeAgo value={deployedAt} short showAgo tooltip />
              ) : (
                <span className='text-neutral-400'>N/A</span>
              )}
            </>
          )
        },
        {
          title: 'Latest Upgrade',
          value: (
            <>
              {accountLatestUpgrade !== undefined ? (
                <div className='d-flex align-items-center gap-2'>
                  <TimeAgo
                    value={accountLatestUpgrade.timestamp}
                    short
                    showAgo
                    tooltip
                  />

                  <InfoTooltip
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
                    iconClassName='d-inline-flex small'
                    persistent
                  />
                </div>
              ) : (
                <span className='text-neutral-400'>N/A</span>
              )}
            </>
          )
        }
      ]}
    />
  );
};
