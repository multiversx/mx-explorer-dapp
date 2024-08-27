import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';

import { ZERO, LOW_LIQUIDITY_DISPLAY_TRESHOLD } from 'appConstants';
import {
  Pager,
  PageSize,
  PageState,
  FormatAmount,
  TokenLink,
  FormatUSD,
  LowLiquidityTooltip,
  TableWrapper,
  FormatNumber
} from 'components';
import { useAdapter, useGetPage, useGetSearch } from 'hooks';
import { faCoins } from 'icons/solid';
import { AccountTabs } from 'layouts/AccountLayout/AccountTabs';
import {
  activeNetworkSelector,
  accountSelector,
  accountExtraSelector
} from 'redux/selectors';
import { TokenType, TokenTypeEnum } from 'types';

import { AccountTokensTableHeader } from './components';

export const AccountTokensTable = () => {
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const [searchParams] = useSearchParams();
  const { account } = useSelector(accountSelector);
  const { accountExtra, isFetched: isAccountExtraFetched } =
    useSelector(accountExtraSelector);
  const { txCount } = account;
  const { tokenBalance, address: extraAddress } = accountExtra;
  const { page, size } = useGetPage();
  const { search } = useGetSearch();
  const { getAccountTokens, getAccountTokensCount } = useAdapter();

  const { hash: address } = useParams() as any;
  const { type } = Object.fromEntries(searchParams);

  const [dataReady, setDataReady] = useState<boolean | undefined>();
  const [accountTokens, setAccountTokens] = useState<TokenType[]>([]);
  const [dataChanged, setDataChanged] = useState<boolean>(false);
  const [accountTokensCount, setAccountTokensCount] = useState(0);

  const fetchAccountTokens = () => {
    setDataChanged(true);
    Promise.all([
      getAccountTokens({
        page,
        size,
        address,
        search,
        type,
        includeMetaESDT: type !== TokenTypeEnum.FungibleESDT
      }),
      getAccountTokensCount({
        address,
        search,
        type,
        includeMetaESDT: type !== TokenTypeEnum.FungibleESDT
      })
    ])
      .then(([accountTokensData, accountTokensCountData]) => {
        if (accountTokensData.success && accountTokensCountData.success) {
          setAccountTokens(accountTokensData.data);
          setAccountTokensCount(accountTokensCountData.data);
        }
        setDataReady(
          accountTokensData.success && accountTokensCountData.success
        );
      })
      .finally(() => {
        setDataChanged(false);
      });
  };

  useEffect(() => {
    fetchAccountTokens();
  }, [txCount, activeNetworkId, address, searchParams]);

  return (
    <div className='container page-content'>
      {dataReady === false && (
        <PageState icon={faCoins} title='Unable to load tokens' isError />
      )}
      {dataReady === true && (
        <div className='row'>
          <div className='col-12'>
            <div className='card'>
              {accountTokens && accountTokens.length > 0 ? (
                <>
                  <div className='card-header'>
                    <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
                      <AccountTabs />
                    </div>
                    <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3 mt-4'>
                      <AccountTokensTableHeader
                        accountTokens={accountTokens}
                        accountTokensCount={accountTokensCount}
                      />
                    </div>
                  </div>

                  <div className='card-body'>
                    <TableWrapper
                      dataChanged={dataChanged || !isAccountExtraFetched}
                    >
                      <table className='table account-tokens-table mb-0'>
                        <thead>
                          <tr>
                            <th>Token</th>
                            <th>Balance</th>
                            <th>Price</th>
                            <th>Value</th>
                            <th>Portofolio %</th>
                          </tr>
                        </thead>
                        <tbody data-testid='accountTokensTable'>
                          {accountTokens.map((token) => {
                            const isValidValue =
                              token.valueUsd &&
                              (!token.isLowLiquidity ||
                                new BigNumber(token.valueUsd).isLessThan(
                                  LOW_LIQUIDITY_DISPLAY_TRESHOLD
                                ));
                            const portofolioPercent =
                              token.valueUsd &&
                              tokenBalance &&
                              address === extraAddress
                                ? new BigNumber(token.valueUsd)
                                    .dividedBy(tokenBalance)
                                    .times(100)
                                : new BigNumber(0);

                            return (
                              <tr key={token.identifier}>
                                <td>
                                  <div className='d-flex align-items-center flex-wrap gap-1'>
                                    <TokenLink token={token} />
                                    <span className='text-neutral-500'>
                                      ({token.assets?.name ?? token.name})
                                    </span>
                                  </div>
                                </td>
                                <td className='text-neutral-100'>
                                  <FormatAmount
                                    showLabel={false}
                                    showSymbol={false}
                                    value={token.balance ? token.balance : ZERO}
                                    decimals={token.decimals}
                                    showUsdValue={false}
                                    showLastNonZeroDecimal
                                  />
                                </td>
                                <td>
                                  {token.price ? (
                                    <FormatUSD
                                      value={token.price}
                                      usd={1}
                                      showPrefix={false}
                                    />
                                  ) : (
                                    <span className='text-neutral-500'>-</span>
                                  )}
                                </td>
                                <td>
                                  {isValidValue ? (
                                    <div className='d-flex align-items-center flex-wrap gap-1'>
                                      <FormatUSD
                                        value={token.valueUsd ?? ZERO}
                                        usd={1}
                                        showPrefix={false}
                                        showLastNonZeroDecimal
                                        className='text-neutral-400'
                                      />
                                      <LowLiquidityTooltip token={token} />
                                    </div>
                                  ) : (
                                    <span className='text-neutral-500'>-</span>
                                  )}
                                </td>
                                <td>
                                  {portofolioPercent.isGreaterThan(0) ? (
                                    <FormatNumber
                                      value={portofolioPercent}
                                      label='%'
                                      decimalOpacity={false}
                                      decimals={2}
                                      hideLessThanOne
                                    />
                                  ) : (
                                    <span className='text-neutral-500'>-</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </TableWrapper>
                  </div>

                  <div className='card-footer table-footer'>
                    <PageSize />
                    <Pager
                      total={accountTokensCount}
                      show={accountTokens.length > 0}
                    />
                  </div>
                </>
              ) : (
                <PageState icon={faCoins} title='No tokens' />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
