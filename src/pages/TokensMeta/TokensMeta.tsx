import React, { useEffect, useRef, useState } from 'react';
import { faDiamond } from 'icons/regular';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation } from 'react-router-dom';

import { Loader, NetworkLink, Trim, Pager } from 'components';
import { urlBuilder } from 'helpers';
import { useAdapter, useGetSearch, useActiveRoute, useGetPage } from 'hooks';
import { tokensRoutes } from 'routes';
import { CollectionType } from 'types';

import { FailedTokens } from './components/FailedTokens';
import { Filters } from './components/Filters';
import { NoTokens } from './components/NoTokens';

export const TokensMeta = () => {
  const ref = useRef(null);
  const activeRoute = useActiveRoute();

  const { search: searchLocation } = useLocation();
  const { search } = useGetSearch();
  const { page, size } = useGetPage();
  const { getCollections, getCollectionsCount } = useAdapter();

  const [metaCollections, setMetaCollections] = useState<CollectionType[]>([]);
  const [dataReady, setDataReady] = useState<boolean | undefined>();
  const [totalMetaCollections, setTotalMetaCollections] = useState<
    number | '...'
  >('...');

  const fetchMetaCollections = () => {
    const type = 'MetaESDT';

    Promise.all([
      getCollections({ search, page, size, type }),
      getCollectionsCount({ search, type })
    ]).then(([collectionsData, count]) => {
      if (ref.current !== null) {
        if (collectionsData.success) {
          setMetaCollections(collectionsData.data);
          setTotalMetaCollections(count.data);
        }
        setDataReady(collectionsData.success && count.success);
      }
    });
  };

  useEffect(fetchMetaCollections, [searchLocation]);

  return (
    <>
      {dataReady === undefined && <Loader />}
      {dataReady === false && <FailedTokens />}

      <div ref={ref}>
        {dataReady === true && (
          <div className='tokens-meta container page-content'>
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
                        <ul className='list-inline m-0 d-flex flex-wrap gap-2'>
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
                        </ul>
                        <Filters />
                      </div>
                      {metaCollections && metaCollections.length > 0 && (
                        <div className='d-none d-sm-flex'>
                          <Pager
                            total={totalMetaCollections}
                            show={metaCollections.length > 0}
                          />
                        </div>
                      )}
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
                                              className='side-icon'
                                            />
                                          ) : (
                                            <div className=' side-icon d-flex align-items-center justify-content-center'>
                                              <FontAwesomeIcon
                                                icon={faDiamond}
                                              />
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
                                                metaCollection.assets
                                                  .description
                                              }
                                            >
                                              {
                                                metaCollection.assets
                                                  .description
                                              }
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
                                      <NetworkLink
                                        to={urlBuilder.accountDetails(
                                          metaCollection.owner
                                        )}
                                        className='trim-wrapper'
                                      >
                                        <Trim
                                          text={metaCollection.owner}
                                          dataTestId={`accountLink${i}`}
                                        />
                                      </NetworkLink>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className='card-footer d-flex justify-content-center justify-content-sm-end'>
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
          </div>
        )}
      </div>
    </>
  );
};
