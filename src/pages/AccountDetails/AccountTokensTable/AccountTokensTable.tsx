import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { ZERO, MAX_RESULTS } from 'appConstants';
import {
  Pager,
  PageSize,
  PageState,
  FormatAmount,
  TokenLink,
  FormatUSD,
  LowLiquidityTooltip,
  FormatNumber,
  Sort,
  Loader,
  Overlay
} from 'components';
import { getItemsPage, isValidTokenValue } from 'helpers';
import { useAdapter, useGetPage } from 'hooks';
import { faCoins } from 'icons/solid';
import { AccountTabs } from 'layouts/AccountLayout/AccountTabs';
import { activeNetworkSelector, accountSelector } from 'redux/selectors';
import { TokenType, SortOrderEnum } from 'types';

import { AccountTokensTableHeader } from './components';
import { SortTokenFieldEnum } from './helpers';
import { useProcessTokens } from './hooks';

const ColSpanWrapper = ({ children }: { children: React.ReactNode }) => (
  <tr>
    <td colSpan={5}>{children}</td>
  </tr>
);

export const AccountTokensTable = () => {
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { account } = useSelector(accountSelector);
  const { txCount } = account;
  const { getAccountTokens } = useAdapter();
  const { page, size } = useGetPage();
  const { hash: address } = useParams() as any;

  const [isDataReady, setIsDataReady] = useState<boolean | undefined>();
  const [accountTokens, setAccountTokens] = useState<TokenType[]>([]);

  const fetchAccountTokens = async () => {
    const { data, success } = await getAccountTokens({
      address,
      includeMetaESDT: true,
      size: MAX_RESULTS
    });
    if (success && data) {
      setAccountTokens(data);
    }
    setIsDataReady(success);
  };

  const hasValidValues = accountTokens.some((token) =>
    isValidTokenValue(token)
  );
  const processedAccountTokens = useProcessTokens(accountTokens);
  const pagedTokens = getItemsPage({
    items: processedAccountTokens,
    currentPage: page,
    itemsPerPage: size
  });

  useEffect(() => {
    fetchAccountTokens();
  }, [txCount, activeNetworkId, address]);

  return (
    <div className='card'>
      <div className='card-header'>
        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
          <AccountTabs />
        </div>
        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3 mt-4'>
          <AccountTokensTableHeader
            tokenCount={processedAccountTokens.length}
          />
        </div>
      </div>

      <div className='card-body'>
        <table className='table account-tokens-table mb-0'>
          <thead>
            <tr>
              <th>
                <Sort
                  id={SortTokenFieldEnum.name}
                  text='Token'
                  {...(!hasValidValues
                    ? {
                        defaultOrder: SortOrderEnum.asc,
                        defaultActive: true
                      }
                    : {})}
                />
              </th>
              <th>
                <Sort id={SortTokenFieldEnum.balance} text='Balance' />
              </th>
              <th>
                <Sort id={SortTokenFieldEnum.price} text='Price' />
              </th>
              <th>
                <Sort
                  id={SortTokenFieldEnum.value}
                  text='Value'
                  {...(hasValidValues
                    ? {
                        defaultOrder: SortOrderEnum.desc,
                        defaultActive: true
                      }
                    : {})}
                />
              </th>
              <th>
                <Sort
                  id={SortTokenFieldEnum.portofolioPercent}
                  text={<Overlay title='USD Value'>Portofolio %</Overlay>}
                />
              </th>
            </tr>
          </thead>
          <tbody data-testid='accountTokensTable'>
            {isDataReady === undefined && (
              <ColSpanWrapper>
                <Loader />
              </ColSpanWrapper>
            )}
            {isDataReady === false && (
              <ColSpanWrapper>
                <PageState
                  icon={faCoins}
                  title='Unable to load tokens'
                  isError
                />
              </ColSpanWrapper>
            )}
            {isDataReady === true && (
              <>
                {pagedTokens.length > 0 ? (
                  <>
                    {pagedTokens.map((token) => {
                      const isValidDisplayValue = isValidTokenValue(token);

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
                              value={token.balance ?? ZERO}
                              decimals={token.decimals}
                              showUsdValue={false}
                              showLastNonZeroDecimal
                            />
                          </td>
                          <td>
                            {token.price ? (
                              <div className='d-flex align-items-center flex-wrap gap-1'>
                                <FormatUSD
                                  value={token.price}
                                  usd={1}
                                  showPrefix={false}
                                />
                                <LowLiquidityTooltip token={token} />
                              </div>
                            ) : (
                              <span className='text-neutral-500'>-</span>
                            )}
                          </td>
                          <td>
                            {isValidDisplayValue ? (
                              <FormatUSD
                                value={token.valueUsd ?? ZERO}
                                usd={1}
                                showPrefix={false}
                                showLastNonZeroDecimal
                                className='text-neutral-400'
                              />
                            ) : (
                              <span className='text-neutral-500'>-</span>
                            )}
                          </td>
                          <td>
                            {token.portofolioPercentage &&
                            token.portofolioPercentage.isGreaterThan(0) ? (
                              <FormatNumber
                                value={token.portofolioPercentage}
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
                  </>
                ) : (
                  <>
                    <ColSpanWrapper>
                      <PageState icon={faCoins} title='No tokens' />
                    </ColSpanWrapper>
                  </>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>

      <div className='card-footer table-footer'>
        <PageSize />
        <Pager
          total={processedAccountTokens.length}
          show={processedAccountTokens.length > 0}
        />
      </div>
    </div>
  );
};
