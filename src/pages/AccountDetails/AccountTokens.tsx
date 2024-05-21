import { useEffect, useRef, useState } from 'react';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';

import { ZERO, LOW_LIQUIDITY_DISPLAY_TRESHOLD } from 'appConstants';
import {
  DetailItem,
  Loader,
  Pager,
  PageSize,
  PageState,
  FormatAmount,
  TokenLink,
  FormatUSD,
  LowLiquidityTooltip
} from 'components';
import { useAdapter, useGetPage } from 'hooks';
import { faCoins } from 'icons/solid';
import { AccountTabs } from 'layouts/AccountLayout/AccountTabs';
import { activeNetworkSelector, accountSelector } from 'redux/selectors';
import { TokenType } from 'types';

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
          {dataReady === undefined && <Loader data-testid='tokensLoader' />}
          {dataReady === false && (
            <PageState icon={faCoins} title='Unable to load tokens' isError />
          )}
          {dataReady === true && accountTokens.length === 0 && (
            <PageState icon={faCoins} title='No tokens' />
          )}
          {dataReady === true && accountTokens.length > 0 && (
            <>
              {accountTokens.map((token) => {
                return (
                  <DetailItem
                    title={token.name}
                    key={token.identifier}
                    verticalCenter
                  >
                    <div className='d-flex align-items-center flex-wrap gap-1'>
                      <div className='text-neutral-100'>
                        <FormatAmount
                          showLabel={false}
                          showSymbol={false}
                          value={token.balance ? token.balance : ZERO}
                          decimals={token.decimals}
                          showUsdValue={false}
                          showLastNonZeroDecimal
                        />
                      </div>
                      {token.valueUsd &&
                        (!token.isLowLiquidity ||
                          new BigNumber(token.valueUsd).isLessThan(
                            LOW_LIQUIDITY_DISPLAY_TRESHOLD
                          )) && (
                          <span>
                            (
                            <FormatUSD
                              value={token.valueUsd}
                              usd={1}
                              showPrefix={false}
                              showLastNonZeroDecimal
                              className='text-neutral-400'
                            />
                            )
                          </span>
                        )}
                      <LowLiquidityTooltip token={token} />
                      <TokenLink token={token} />
                    </div>
                  </DetailItem>
                );
              })}
            </>
          )}
        </div>
      </div>

      {dataReady === true && accountTokens.length > 0 && (
        <div className='card-footer table-footer'>
          <PageSize />
          <Pager total={accountTokensCount} show={accountTokens.length > 0} />
        </div>
      )}
    </div>
  );
};
