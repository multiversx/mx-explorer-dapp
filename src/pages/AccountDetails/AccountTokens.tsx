import { useEffect, useRef, useState } from 'react';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';

import { LOW_LIQUIDITY_DISPLAY_TRESHOLD } from 'appConstants';
import {
  DetailItem,
  Loader,
  Pager,
  PageState,
  Denominate,
  NetworkLink,
  Overlay,
  LowLiquidityTooltip
} from 'components';
import { urlBuilder, amountWithoutRounding } from 'helpers';
import { useAdapter, useGetPage } from 'hooks';
import { faCoins } from 'icons/solid';
import { AccountTabs } from 'layouts/AccountLayout/AccountTabs';
import { activeNetworkSelector, accountSelector } from 'redux/selectors';
import { TokenType, TokenTypeEnum } from 'types';

export const AccountTokens = () => {
  const ref = useRef(null);

  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const [searchParams] = useSearchParams();
  const { account } = useSelector(accountSelector);
  const { txCount } = account;
  const { page, size } = useGetPage();

  const { getAccountTokens, getAccountTokensCount } = useAdapter();

  const { hash: address } = useParams() as any;

  const [dataReady, setDataReady] = useState<boolean | undefined>();
  const [accountTokens, setAccountTokens] = useState<TokenType[]>([]);
  const [accountTokensCount, setAccountTokensCount] = useState(0);

  const fetchAccountTokens = () => {
    Promise.all([
      getAccountTokens({
        page,
        size,
        address,
        includeMetaESDT: true
      }),
      getAccountTokensCount({ address, includeMetaESDT: true })
    ]).then(([accountTokensData, accountTokensCountData]) => {
      if (ref.current !== null) {
        if (accountTokensData.success && accountTokensCountData.success) {
          setAccountTokens(accountTokensData.data);
          setAccountTokensCount(accountTokensCountData.data);
        }
        setDataReady(
          accountTokensData.success && accountTokensCountData.success
        );
      }
    });
  };

  useEffect(() => {
    fetchAccountTokens();
  }, [txCount, activeNetworkId, address, searchParams]);

  return (
    <div className='card' ref={ref}>
      <div className='card-header'>
        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
          <AccountTabs />
          {dataReady === true && accountTokens.length > 0 && (
            <Pager
              total={accountTokensCount}
              show={accountTokens.length > 0}
              className='d-flex ms-auto me-auto me-sm-0'
            />
          )}
        </div>
      </div>
      <div className='card-body pt-0 px-lg-spacer py-lg-4'>
        <div className='px-0'>
          {dataReady === undefined && <Loader dataTestId='tokensLoader' />}
          {dataReady === false && (
            <PageState
              icon={faCoins}
              title='Unable to load tokens'
              className='py-spacer my-auto'
              dataTestId='errorScreen'
            />
          )}
          {dataReady === true && accountTokens.length === 0 && (
            <PageState
              icon={faCoins}
              title='No tokens'
              className='py-spacer my-auto'
            />
          )}
          {dataReady === true && accountTokens.length > 0 && (
            <>
              {accountTokens.map(
                ({
                  type,
                  identifier,
                  name,
                  balance,
                  decimals,
                  assets,
                  ticker,
                  valueUsd,
                  isLowLiquidity,
                  totalLiquidity
                }) => {
                  const identifierArray = identifier.split('-');
                  if (identifierArray.length > 2) {
                    identifierArray.pop();
                  }

                  const networkLink =
                    type === TokenTypeEnum.MetaESDT
                      ? urlBuilder.tokenMetaEsdtDetails(
                          identifierArray.join('-')
                        )
                      : urlBuilder.tokenDetails(identifier);

                  const TokenInfo = () => (
                    <div className='d-flex align-items-center symbol text-truncate'>
                      {assets ? (
                        <>
                          {assets?.svgUrl && (
                            <img
                              src={assets.svgUrl}
                              alt={name}
                              className='side-icon me-1'
                            />
                          )}
                          <div className='text-truncate'>
                            {ticker ? ticker : name}{' '}
                          </div>
                        </>
                      ) : (
                        <div className='text-truncate'>{identifier}</div>
                      )}
                    </div>
                  );

                  return (
                    <DetailItem title={name} key={identifier}>
                      <div className='d-flex flex-wrap gap-1 align-items-center text-break'>
                        <Denominate
                          showLabel={false}
                          value={balance ? balance : '0'}
                          denomination={decimals}
                          showLastNonZeroDecimal
                        />

                        {valueUsd && (
                          <>
                            {(!isLowLiquidity ||
                              new BigNumber(valueUsd).isLessThan(
                                LOW_LIQUIDITY_DISPLAY_TRESHOLD
                              )) && (
                              <span className='text-neutral-400'>
                                (${amountWithoutRounding(valueUsd)})
                              </span>
                            )}
                            {isLowLiquidity && (
                              <LowLiquidityTooltip
                                {...(totalLiquidity
                                  ? {
                                      details: (
                                        <>
                                          ($
                                          {new BigNumber(
                                            totalLiquidity
                                          ).toFormat(2)}
                                          )
                                        </>
                                      )
                                    }
                                  : {})}
                              />
                            )}
                          </>
                        )}

                        <NetworkLink
                          to={networkLink}
                          className={`d-flex text-truncate ${
                            assets?.svgUrl ? 'side-link' : ''
                          }`}
                        >
                          <div className='d-flex align-items-center symbol text-truncate'>
                            {type === TokenTypeEnum.MetaESDT &&
                            assets?.svgUrl ? (
                              <Overlay title={identifier}>
                                <TokenInfo />
                              </Overlay>
                            ) : (
                              <TokenInfo />
                            )}
                          </div>
                        </NetworkLink>
                      </div>
                    </DetailItem>
                  );
                }
              )}
            </>
          )}
        </div>
      </div>

      {dataReady === true && accountTokens.length > 0 && (
        <div className='card-footer d-flex justify-content-center justify-content-sm-end'>
          <Pager total={accountTokensCount} show={accountTokens.length > 0} />
        </div>
      )}
    </div>
  );
};
