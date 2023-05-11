import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { PAGE_SIZE } from 'appConstants';
import { Loader, NetworkLink, Pager } from 'components';
import {
  useAdapter,
  useGetSearch,
  useGetSort,
  useActiveRoute,
  useGetPage,
  useIsMainnet
} from 'hooks';
import { economicsSelector } from 'redux/selectors';
import { pageHeaderTokensStatsSelector } from 'redux/selectors/pageHeadersTokensStats';
import { tokensRoutes } from 'routes';
import { TokenType } from 'types';

import { FailedTokens } from './components/FailedTokens';
import { Filters } from './components/Filters';
import { NoTokens } from './components/NoTokens';
import { TokensTable } from './components/TokensTable';

export const Tokens = () => {
  const ref = useRef(null);

  const activeRoute = useActiveRoute();
  const isMainnet = useIsMainnet();
  const { search: searchLocation } = useLocation();
  const { search } = useGetSearch();
  const { page } = useGetPage();
  const { sort, order } = useGetSort();
  const { getTokens, getTokensCount } = useAdapter();

  const { ecosystemMarketCap } = useSelector(economicsSelector);
  const pageHeadersTokens = useSelector(pageHeaderTokensStatsSelector);

  const [tokens, setTokens] = useState<TokenType[]>([]);
  const [dataReady, setDataReady] = useState<boolean | undefined>();
  const [totalTokens, setTotalTokens] = useState<number | '...'>('...');

  const fetchTokens = () => {
    Promise.all([
      getTokens({ search, page, sort, order }),
      getTokensCount({ search })
    ]).then(([tokensData, count]) => {
      if (ref.current !== null) {
        if (tokensData.success) {
          setTokens(tokensData.data);
          setTotalTokens(count.data);
        }
        setDataReady(tokensData.success && count.success);
      }
    });
  };

  useEffect(fetchTokens, [searchLocation]);

  return (
    <>
      {(dataReady === undefined ||
        (isMainnet && Object.keys(pageHeadersTokens).length === 0)) && (
        <Loader />
      )}
      {dataReady === false && <FailedTokens />}

      <div ref={ref}>
        {dataReady === true && (
          <div className='tokens container page-content'>
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
                          {totalTokens}{' '}
                          <span className='text-neutral-400 pe-2 border-end me-2'>
                            Tokens
                          </span>{' '}
                          <span className='text-neutral-400'>
                            Ecosystem Market Cap:
                          </span>{' '}
                          {ecosystemMarketCap}
                        </span>
                      </div>
                    </div>
                    <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
                      <div className='filters d-flex align-items-start align-items-md-center justify-content-md-between flex-column flex-md-row gap-3'>
                        <ul className='list-inline m-0 d-flex flex-wrap gap-2'>
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
                        </ul>
                        <Filters />
                      </div>
                      {tokens && tokens.length > 0 && (
                        <div className='d-none d-sm-flex'>
                          <Pager
                            total={totalTokens}
                            itemsPerPage={PAGE_SIZE}
                            show={tokens.length > 0}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {tokens && tokens.length > 0 ? (
                    <>
                      <div className='card-body'>
                        <TokensTable
                          tokens={tokens}
                          totalTokens={totalTokens}
                        />
                      </div>

                      <div className='card-footer d-flex justify-content-center justify-content-sm-end'>
                        <Pager
                          total={totalTokens}
                          itemsPerPage={PAGE_SIZE}
                          show={tokens.length > 0}
                        />
                      </div>
                    </>
                  ) : (
                    <NoTokens />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
