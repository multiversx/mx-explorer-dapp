import * as React from 'react';
import { faDiamond } from '@fortawesome/pro-regular-svg-icons/faDiamond';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation } from 'react-router-dom';
import { Loader, useAdapter, NetworkLink, Trim, Pager } from 'components';
import {
  urlBuilder,
  useGetFilters,
  useURLSearchParams,
  useActiveRoute
} from 'helpers';
import { tokensRoutes } from 'routes';
import { CollectionType } from 'types';
import { FailedTokens } from './FailedTokens';
import { Filters } from './Filters';
import { NoTokens } from './NoTokens';

export const TokensMeta = () => {
  const ref = React.useRef(null);
  const activeRoute = useActiveRoute();
  const { page } = useURLSearchParams();
  const { search } = useLocation();
  const { getQueryObject, size } = useGetFilters();
  const { getCollections, getCollectionsCount } = useAdapter();

  const [metaCollections, setMetaCollections] = React.useState<
    CollectionType[]
  >([]);
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [totalMetaCollections, setTotalMetaCollections] = React.useState<
    number | '...'
  >('...');

  const fetchMetaCollections = () => {
    const queryObject = getQueryObject();
    const type = 'MetaESDT';

    Promise.all([
      getCollections({ ...queryObject, size, type }),
      getCollectionsCount({ ...queryObject, type })
    ]).then(([collectionsData, count]) => {
      if (ref.current !== null) {
        if (collectionsData.success) {
          setMetaCollections(collectionsData.data);
          setTotalMetaCollections(Math.min(count.data, 10000));
        }
        setDataReady(collectionsData.success && count.success);
      }
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchMetaCollections, [search]);

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
                    <div className='card-header-item d-flex align-items-center justify-content-between mb-spacer'>
                      <h5
                        data-testid='title'
                        className='table-title d-flex align-items-center'
                      >
                        Meta-ESDT
                      </h5>
                    </div>
                    <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap'>
                      <div className='filters d-flex align-items-start align-items-md-center justify-content-md-between flex-column flex-md-row'>
                        <ul className='list-inline m-0'>
                          <li className='list-inline-item my-1 my-md-0'>
                            <NetworkLink
                              to={tokensRoutes.tokens}
                              className={`badge py-2 px-3 me-2 br-lg ${
                                activeRoute(tokensRoutes.tokens)
                                  ? 'badge-grey'
                                  : 'badge-outline badge-outline-grey'
                              }`}
                            >
                              Tokens
                            </NetworkLink>
                            <NetworkLink
                              to={tokensRoutes.tokensMeta}
                              className={`badge py-2 px-3 me-2 br-lg ${
                                activeRoute(tokensRoutes.tokensMeta)
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
                            page={String(page)}
                            total={
                              totalMetaCollections !== '...'
                                ? Math.min(totalMetaCollections, 10000)
                                : totalMetaCollections
                            }
                            itemsPerPage={25}
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
                                          to={urlBuilder.collectionDetails(
                                            metaCollection.collection
                                          )}
                                          data-testid={`nftsLink${i}`}
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
                                          to={urlBuilder.collectionDetails(
                                            metaCollection.collection
                                          )}
                                          data-testid={`nftsLink${i}`}
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
                          page={String(page)}
                          total={
                            totalMetaCollections !== '...'
                              ? Math.min(totalMetaCollections, 10000)
                              : totalMetaCollections
                          }
                          itemsPerPage={25}
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
