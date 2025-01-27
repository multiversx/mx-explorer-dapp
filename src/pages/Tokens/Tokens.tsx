import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { ELLIPSIS } from 'appConstants';
import { Loader, NetworkLink, Pager, PageSize, TableSearch } from 'components';
import { getStringPlural } from 'helpers';
import {
  useAdapter,
  useGetSearch,
  useGetSort,
  useActiveRoute,
  useGetPage,
  useHasGrowthWidgets
} from 'hooks';
import { economicsSelector } from 'redux/selectors';
import { pageHeaderTokensStatsSelector } from 'redux/selectors/pageHeadersTokensStats';
import { tokensRoutes } from 'routes';
import { TokenType } from 'types';

import { FailedTokens } from './components/FailedTokens';
import { TokensTable } from './components/TokensTable';

export const Tokens = () => {
  const activeRoute = useActiveRoute();
  const hasGrowthWidgets = useHasGrowthWidgets();
  const { search: searchLocation } = useLocation();
  const { search } = useGetSearch();
  const { page, size } = useGetPage();
  const { sort, order } = useGetSort();
  const { getTokens, getTokensCount } = useAdapter();

  const { ecosystemMarketCap, unprocessed } = useSelector(economicsSelector);
  const pageHeadersTokens = useSelector(pageHeaderTokensStatsSelector);

  const [tokens, setTokens] = useState<TokenType[]>([]);
  const [dataReady, setDataReady] = useState<boolean | undefined>();
  const [totalTokens, setTotalTokens] = useState<number | undefined>();

  const { totalTokens: growthTotalTokens } = pageHeadersTokens;
  const displayTotalTokens =
    growthTotalTokens ?? new BigNumber(totalTokens || 1).toFormat();

  const fetchTokens = () => {
    Promise.all([
      getTokens({ search, page, size, sort, order, includeMetaESDT: false }),
      getTokensCount({ search, includeMetaESDT: false })
    ]).then(([tokensData, count]) => {
      if (tokensData.success) {
        setTokens(tokensData.data);
        setTotalTokens(count.data);
      }
      setDataReady(tokensData.success && count.success);
    });
  };

  useEffect(fetchTokens, [searchLocation]);

  if (
    dataReady === undefined ||
    (hasGrowthWidgets && Object.keys(pageHeadersTokens).length === 0)
  ) {
    return <Loader />;
  }

  return (
    <div className='tokens container page-content'>
      {dataReady === false && <FailedTokens />}
      {dataReady === true && (
        <div className='row'>
          <div className='col-12'>
            <div className='card'>
              <div className='card-header'>
                <div className='card-header-item d-flex align-items-center justify-content-between mb-3'>
                  <div className='d-flex flex-wrap w-100 align-items-center justify-content-between'>
                    <h5
                      data-testid='title'
                      className='mb-0 d-flex align-items-center'
                    >
                      Tokens
                    </h5>
                    <span>
                      {totalTokens !== undefined
                        ? displayTotalTokens
                        : ELLIPSIS}{' '}
                      <span className='text-neutral-400'>
                        {getStringPlural(displayTotalTokens ?? 0, {
                          string: 'Token'
                        })}
                      </span>
                      {Boolean(
                        unprocessed.tokenMarketCap && unprocessed.marketCap
                      ) && (
                        <>
                          <span className='ps-2 border-start ms-2 text-neutral-400'>
                            Ecosystem Market Cap:
                          </span>{' '}
                          {ecosystemMarketCap}
                        </>
                      )}
                    </span>
                  </div>
                </div>
                <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
                  <div className='filters d-flex align-items-start align-items-md-center justify-content-md-between flex-column flex-md-row gap-3'>
                    <menu className='list-inline m-0 d-flex flex-wrap gap-2'>
                      <li className='list-inline-item me-0'>
                        <NetworkLink
                          to={tokensRoutes.tokens}
                          className={`badge py-2 px-3 br-lg ${
                            activeRoute(tokensRoutes.tokens)
                              ? 'badge-grey'
                              : 'badge-outline badge-outline-grey'
                          }`}
                          preventScrollReset={true}
                        >
                          Tokens
                        </NetworkLink>
                      </li>
                      <li className='list-inline-item me-0'>
                        <NetworkLink
                          to={tokensRoutes.tokensMetaEsdt}
                          className={`badge py-2 px-3 br-lg ${
                            activeRoute(tokensRoutes.tokensMetaEsdt)
                              ? 'badge-grey'
                              : 'badge-outline badge-outline-grey'
                          }`}
                          preventScrollReset={true}
                        >
                          Meta-ESDT
                        </NetworkLink>
                      </li>
                    </menu>
                    <div className='filters tokens-filters'>
                      <TableSearch
                        className='input-group-sm'
                        searchValue={totalTokens}
                        placeholderText='token'
                        name='tokensSearch'
                      />
                    </div>
                  </div>
                  {tokens.length > 0 && (
                    <div className='d-none d-sm-flex'>
                      <Pager total={totalTokens} show={tokens.length > 0} />
                    </div>
                  )}
                </div>
              </div>

              <div className='card-body'>
                <TokensTable tokens={tokens} totalTokens={totalTokens} />
              </div>

              <div className='card-footer table-footer'>
                <PageSize />
                <Pager total={totalTokens} show={tokens.length > 0} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
