import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import { useDispatch, useSelector } from 'react-redux';

import {
  ELLIPSIS,
  MAX_ACOUNT_TOKENS_BALANCE,
  LOW_LIQUIDITY_DISPLAY_TRESHOLD
} from 'appConstants';
import { ReactComponent as MultiversXSymbol } from 'assets/img/symbol.svg';
import {
  CardItem,
  CopyButton,
  FormatAmount,
  NetworkLink,
  TimeAgo,
  InfoTooltip,
  ShardLink
} from 'components';
import {
  urlBuilder,
  formatHerotag,
  formatBigNumber,
  getTotalTokenUsdValue
} from 'helpers';
import { useAdapter, useIsSovereign } from 'hooks';
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
import { setAccountExtra, getInitialAccountExtraState } from 'redux/slices';
import { SortOrderEnum, TokenType } from 'types';

import { AccountUsdValueCardItem } from './components/AccountUsdValueCardItem';
import { LockedAmountCardItem } from './components/LockedAmountCardItem';

export const AccountDetailsCard = () => {
  const dispatch = useDispatch();
  const isSovereign = useIsSovereign();
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
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const {
    getAccountTokensCount,
    getAccountNftsCount,
    getAccountTokens,
    getAccountTransfers
  } = useAdapter();

  const [accountTokensCount, setAccountTokensCount] = React.useState<
    number | typeof ELLIPSIS
  >(ELLIPSIS);
  const [accountNftsCount, setAccountNftsCount] = React.useState<
    number | typeof ELLIPSIS
  >(ELLIPSIS);

  const fetchAccountDetails = () => {
    Promise.all([
      getAccountTokens({
        address,
        size: MAX_ACOUNT_TOKENS_BALANCE,
        fields: ['valueUsd', 'isLowLiquidity'].join(','),
        includeMetaESDT: false
      }),
      getAccountTransfers({
        address,
        size: 1,
        order: SortOrderEnum.asc,
        fields: 'timestamp'
      }),
      getAccountTokensCount({ address, includeMetaESDT: true }),
      getAccountNftsCount({ address, excludeMetaESDT: true })
    ]).then(
      ([
        accountTokensValueData,
        accountTransfersData,
        accountTokensCountData,
        accountNftsCountData
      ]) => {
        const isFetched =
          accountTransfersData.success || accountTokensValueData.success;
        const accountExtraDetails = getInitialAccountExtraState().accountExtra;

        if (accountTransfersData.success) {
          if (
            accountTransfersData?.data &&
            accountTransfersData.data.length > 0
          ) {
            const firstTransactionDate =
              accountTransfersData.data[0]?.['timestamp'];
            accountExtraDetails.firstTransactionDate = firstTransactionDate;
          }
        }
        if (accountTokensValueData.success) {
          const validTokenValues = accountTokensValueData.data.filter(
            (token: TokenType) =>
              token.valueUsd &&
              (!token.isLowLiquidity ||
                new BigNumber(token.valueUsd).isLessThan(
                  LOW_LIQUIDITY_DISPLAY_TRESHOLD
                ))
          );
          const tokenBalance = getTotalTokenUsdValue(validTokenValues);
          accountExtraDetails.tokenBalance = tokenBalance;
        }
        dispatch(
          setAccountExtra({
            accountExtra: { ...accountExtraDetails, address },
            isFetched
          })
        );
        if (accountTokensCountData.success) {
          setAccountTokensCount(accountTokensCountData.data);
        }
        if (accountNftsCountData.success) {
          setAccountNftsCount(accountNftsCountData.data);
        }
      }
    );
  };

  useEffect(() => {
    fetchAccountDetails();
  }, [txCount, activeNetworkId, address]);

  return (
    <div className='row account-details-card mb-3'>
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
                          <img
                            src={assets?.iconSvg}
                            alt=''
                            role='presentation'
                          />
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
            <CardItem title='Balance' customIcon={<MultiversXSymbol />}>
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
            <LockedAmountCardItem />
            <AccountUsdValueCardItem />
            {isGuarded && (
              <CardItem title='' icon={faShieldCheck}>
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
            <CardItem title='Nonce' icon={faUser}>
              {formatBigNumber({ value: nonce })}
            </CardItem>
            <CardItem title='Tokens' icon={faCoins}>
              {formatBigNumber({ value: accountTokensCount })}
            </CardItem>
            <CardItem title='NFTs' icon={faHexagonVerticalNft}>
              {formatBigNumber({ value: accountNftsCount })}
            </CardItem>
            <CardItem
              title={isSovereign ? 'Chain' : 'Shard'}
              icon={faLayerGroup}
            >
              <ShardLink shard={shard} data-testid='shardLink' />
            </CardItem>
            <CardItem title='Active Since' icon={faClock}>
              {firstTransactionDate ? (
                <TimeAgo value={firstTransactionDate} tooltip showAgo />
              ) : (
                ELLIPSIS
              )}
            </CardItem>
          </div>
        </div>
      </div>
    </div>
  );
};
