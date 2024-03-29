import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';

import { ELLIPSIS } from 'appConstants';
import { ReactComponent as MultiversXSymbol } from 'assets/img/symbol.svg';
import {
  CardItem,
  CopyButton,
  FormatAmount,
  NetworkLink,
  ShardSpan,
  TimeAgo,
  InfoTooltip
} from 'components';
import { urlBuilder, formatHerotag } from 'helpers';
import { useAdapter } from 'hooks';
import { faClock, faExclamationTriangle } from 'icons/regular';
import {
  faUser,
  faCoins,
  faLayerGroup,
  faHexagonVerticalNft,
  faShieldCheck
} from 'icons/solid';
import {
  activeNetworkSelector,
  accountSelector,
  accountExtraSelector
} from 'redux/selectors';

import { AccountUsdValueCardItem } from './components/AccountUsdValueCardItem';
import { LockedAmountCardItem } from './components/LockedAmountCardItem';

export const AccountDetailsCard = () => {
  const ref = useRef(null);

  const { account } = useSelector(accountSelector);
  const { accountExtra } = useSelector(accountExtraSelector);
  const {
    address,
    balance,
    nonce,
    shard,
    scamInfo,
    assets,
    username,
    txCount,
    isGuarded,
    activeGuardianAddress,
    activeGuardianServiceUid
  } = account;
  const { firstTransactionDate } = accountExtra;
  const { id: activeNetworkId, adapter } = useSelector(activeNetworkSelector);
  const { getAccountTokensCount, getAccountNftsCount } = useAdapter();

  const [accountTokensCount, setAccountTokensCount] = React.useState<number>();
  const [accountNftsCount, setAccountNftsCount] = React.useState<number>();

  const tokensActive = adapter === 'api';
  const cardItemClass = tokensActive ? 'n4' : '';

  const fetchAccountTokensCount = () => {
    if (tokensActive) {
      getAccountTokensCount({ address, includeMetaESDT: true }).then(
        (accountTokensCountData) => {
          if (ref.current !== null) {
            if (accountTokensCountData.success) {
              const accountTokens =
                typeof accountTokensCountData.data === 'number'
                  ? accountTokensCountData.data
                  : 0;

              setAccountTokensCount(accountTokens);
            }
          }
        }
      );
    }
  };
  const fetchAccountNftsCount = () => {
    if (tokensActive) {
      getAccountNftsCount({ address, excludeMetaESDT: true }).then(
        (accountNftsCountData) => {
          if (ref.current !== null) {
            if (accountNftsCountData.success) {
              const accountNfts =
                typeof accountNftsCountData.data === 'number'
                  ? accountNftsCountData.data
                  : 0;

              setAccountNftsCount(accountNfts);
            }
          }
        }
      );
    }
  };

  useEffect(() => {
    fetchAccountNftsCount();
    fetchAccountTokensCount();
  }, [txCount, activeNetworkId, address]);

  return address !== '' ? (
    <div ref={ref} className='row account-details-card mb-3'>
      <div className='col'>
        <div className='card'>
          <div
            className={`card-header ${scamInfo ? 'status-text-warning' : ''}`}
          >
            <div className='card-header-item'>
              <div className='d-flex align-items-center justify-content-between'>
                <div className='d-flex align-items-center w-100'>
                  <h5 className='me-2 mb-0' data-testid='title'>
                    <div className='d-flex align-items-center'>
                      {assets?.iconSvg && (
                        <div className='side-icon me-1'>
                          <img src={assets?.iconSvg} alt=' ' />
                        </div>
                      )}
                      <div>{assets?.name ?? 'Address Details'}</div>
                    </div>
                  </h5>
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
                </div>
              </div>
            </div>
            <div className='card-header-item compact card card-sm bg-table-header p-3 d-flex flex-column mt-3'>
              <div className='d-flex flex-row'>
                <span className='text-neutral-400'>Address:</span>
                <div className='d-flex align-items-center text-break-all ms-2'>
                  <span data-testid='address'>{address}</span>
                  <CopyButton text={address} />
                </div>
              </div>
              {username && (
                <div className='d-flex flex-row mt-2'>
                  <span className='text-neutral-400'>Herotag:</span>
                  <div className='d-flex align-items-center text-break-all ms-2'>
                    <span data-testid='address' title={username}>
                      {formatHerotag(username)}
                    </span>
                    <CopyButton text={formatHerotag(username)} />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className='card-body card-item-container my-n2 mx-spacing'>
            <CardItem
              className={cardItemClass}
              title='Balance'
              customIcon={<MultiversXSymbol />}
            >
              <div className='d-flex align-items-center'>
                {balance !== ELLIPSIS ? (
                  <FormatAmount
                    value={balance}
                    digits={4}
                    data-testid='balance'
                  />
                ) : (
                  balance
                )}
              </div>
            </CardItem>
            <LockedAmountCardItem cardItemClass={cardItemClass} />
            <AccountUsdValueCardItem cardItemClass={cardItemClass} />
            {isGuarded && (
              <CardItem className={cardItemClass} title='' icon={faShieldCheck}>
                Guarded
                <InfoTooltip
                  title={
                    <>
                      {activeGuardianServiceUid && (
                        <p className='mb-0'>{activeGuardianServiceUid}</p>
                      )}
                      {activeGuardianAddress && (
                        <NetworkLink
                          to={urlBuilder.accountDetails(activeGuardianAddress)}
                        >
                          ({activeGuardianAddress})
                        </NetworkLink>
                      )}
                    </>
                  }
                  persistent
                />
              </CardItem>
            )}
            <CardItem className={cardItemClass} title='Nonce' icon={faUser}>
              {nonce !== undefined ? nonce.toLocaleString('en') : ELLIPSIS}
            </CardItem>
            {tokensActive && (
              <CardItem className={cardItemClass} title='Tokens' icon={faCoins}>
                {accountTokensCount !== undefined
                  ? accountTokensCount
                  : ELLIPSIS}
              </CardItem>
            )}
            {tokensActive && (
              <CardItem
                className={cardItemClass}
                title='NFTs'
                icon={faHexagonVerticalNft}
              >
                {accountNftsCount !== undefined ? accountNftsCount : ELLIPSIS}
              </CardItem>
            )}
            <CardItem
              className={cardItemClass}
              title='Shard'
              icon={faLayerGroup}
            >
              {shard !== undefined ? (
                <NetworkLink
                  to={urlBuilder.shard(shard)}
                  data-testid='shardLink'
                >
                  <ShardSpan shard={shard} />
                </NetworkLink>
              ) : (
                <>N/A</>
              )}
            </CardItem>
            {firstTransactionDate && (
              <CardItem
                className={cardItemClass}
                title='Active Since'
                icon={faClock}
              >
                <TimeAgo value={firstTransactionDate} tooltip showAgo />
              </CardItem>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : null;
};
