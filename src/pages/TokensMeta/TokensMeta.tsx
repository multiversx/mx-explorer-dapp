import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { ELLIPSIS } from 'appConstants';
import {
  Loader,
  NetworkLink,
  AccountLink,
  Pager,
  PageSize,
  TableSearch
} from 'components';
import { urlBuilder } from 'helpers';
import {
  useAdapter,
  useGetSearch,
  useActiveRoute,
  useGetPage,
  useHasGrowthWidgets
} from 'hooks';
import { faDiamond } from 'icons/regular';
import { pageHeaderTokensStatsSelector } from 'redux/selectors/pageHeadersTokensStats';
import { tokensRoutes } from 'routes';
import { CollectionType } from 'types';

import { FailedTokens } from './components/FailedTokens';
import { NoTokens } from './components/NoTokens';

export const TokensMeta = () => {
  const activeRoute = useActiveRoute();
  const hasGrowthWidgets = useHasGrowthWidgets();

  const { search: searchLocation } = useLocation();
  const { search } = useGetSearch();
  const { page, size } = useGetPage();
  const { getCollections, getCollectionsCount } = useAdapter();
  const pageHeadersTokens = useSelector(pageHeaderTokensStatsSelector);

  const [metaCollections, setMetaCollections] = useState<CollectionType[]>([]);
  const [dataReady, setDataReady] = useState<boolean | undefined>();
  const [totalMetaCollections, setTotalMetaCollections] = useState<
    number | typeof ELLIPSIS
  >(ELLIPSIS);

  const fetchMetaCollections = () => {
    const type = 'MetaESDT';

    Promise.all([
      getCollections({ search, page, size, type }),
      getCollectionsCount({ search, type })
    ]).then(([collectionsData, count]) => {
      if (collectionsData.success) {
        setMetaCollections(collectionsData.data);
        setTotalMetaCollections(count.data);
      }
      setDataReady(collectionsData.success && count.success);
    });
  };

  useEffect(fetchMetaCollections, [searchLocation]);

  if (
    dataReady === undefined ||
    (hasGrowthWidgets && Object.keys(pageHeadersTokens).length === 0)
  ) {
    return <Loader />;
  }

  return (
    <div className='tokens-meta container page-content'>
      {dataReady === false && <FailedTokens />}
      {dataReady === true && (
        <div className='row'>
          <div className='col-12'>
            <div className='card'>
              <div className='card-header'>
                <div className='card-header-item d-flex align-items-center justify-content-between mb-3'>
                  <h5
                    data-testid='title'
                    className='table-title d-flex align-items-center'
                  >
                    Meta-ESDT
                  </h5>
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
                        >
                          Meta-ESDT
                        </NetworkLink>
                      </li>
                    </menu>
                    <div className='filters tokens-meta-filters'>
                      <TableSearch
                        className='input-group-sm'
                        searchValue={totalMetaCollections}
                        placeholderText='token'
                        name='metaEsdtSearch'
                      />
                    </div>
                  </div>
                  <Pager
                    total={totalMetaCollections}
                    show={metaCollections && metaCollections.length > 0}
                    className='d-flex ms-auto me-auto me-sm-0'
                  />
                </div>
              </div>

              {metaCollections && metaCollections.length > 0 ? (
                <>
                  <div className='card-body'>
                    <div className='table-wrapper animated-list'>
                      <table className='table tokens-table'>
                        <thead>
                          <tr>
                            <th>Token</th>
                            <th>Name</th>
                            <th>Owner</th>
                          </tr>
                        </thead>
                        <tbody data-testid='collectionsTable'>
                          {metaCollections.map((metaCollection, i) => (
                            <tr
                              key={`${metaCollection.name}-${metaCollection.collection}`}
                            >
                              <td>
                                <div className='token-identity d-flex flex-row'>
                                  <div className='d-flex align-items-center me-3'>
                                    <NetworkLink
                                      to={urlBuilder.tokenMetaEsdtDetails(
                                        metaCollection.collection
                                      )}
                                      data-testid={`metaEsdtsLink${i}`}
                                      className='side-link'
                                    >
                                      {metaCollection.assets &&
                                      metaCollection.assets.svgUrl ? (
                                        <img
                                          src={metaCollection.assets.svgUrl}
                                          alt={metaCollection.name}
                                          className='side-icon side-icon-md-large'
                                        />
                                      ) : (
                                        <div className='side-icon side-icon-md-large d-flex align-items-center justify-content-center'>
                                          <FontAwesomeIcon icon={faDiamond} />
                                        </div>
                                      )}
                                    </NetworkLink>
                                  </div>

                                  <div className='d-flex flex-column justify-content-center'>
                                    <NetworkLink
                                      to={urlBuilder.tokenMetaEsdtDetails(
                                        metaCollection.collection
                                      )}
                                      data-testid={`metaEsdtsLink${i}`}
                                      className='d-block token-ticker'
                                    >
                                      {metaCollection.ticker}
                                    </NetworkLink>
                                    {metaCollection.assets &&
                                      metaCollection.assets.description && (
                                        <div
                                          className='token-description text-wrap text-neutral-400 small d-none d-md-block'
                                          title={
                                            metaCollection.assets.description
                                          }
                                        >
                                          {metaCollection.assets.description}
                                        </div>
                                      )}
                                  </div>
                                </div>
                              </td>
                              <td>
                                {metaCollection.scamInfo
                                  ? `[Hidden - ${metaCollection.scamInfo.info}]`
                                  : metaCollection.name}
                              </td>
                              <td>
                                <div className='d-flex trim-size-xl'>
                                  <AccountLink
                                    address={metaCollection.owner}
                                    hasHighlight
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className='card-footer table-footer'>
                    <PageSize />
                    <Pager
                      total={totalMetaCollections}
                      show={metaCollections.length > 0}
                    />
                  </div>
                </>
              ) : (
                <NoTokens />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
