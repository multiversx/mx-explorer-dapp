import * as React from 'react';
import { useLocation } from 'react-router-dom';

import {
  Loader,
  useAdapter,
  NetworkLink,
  Trim,
  Pager,
  NftBadge,
  TimeAgo
} from 'components';
import {
  urlBuilder,
  useGetFilters,
  useURLSearchParams,
  useActiveRoute
} from 'helpers';
import { collectionRoutes } from 'routes';
import { NftEnumType, CollectionType } from 'types';
import { FailedCollections } from './FailedCollections';
import { Filters } from './Filters';
import { NoCollections } from './NoCollections';

export const Collections = () => {
  const ref = React.useRef(null);
  const activeRoute = useActiveRoute();
  const { page } = useURLSearchParams();
  const { search } = useLocation();
  const { getQueryObject, size } = useGetFilters();
  const { getCollections, getCollectionsCount } = useAdapter();

  const [collections, setCollections] = React.useState<CollectionType[]>([]);
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [totalCollections, setTotalCollections] = React.useState<
    number | '...'
  >('...');

  const getCollectionType = () => {
    if (activeRoute(collectionRoutes.collectionsNft)) {
      return NftEnumType.NonFungibleESDT;
    }
    if (activeRoute(collectionRoutes.collectionsSft)) {
      return NftEnumType.SemiFungibleESDT;
    }

    return [NftEnumType.NonFungibleESDT, NftEnumType.SemiFungibleESDT].join();
  };

  const fetchCollections = () => {
    const queryObject = getQueryObject();
    const type = getCollectionType();

    Promise.all([
      getCollections({ ...queryObject, size, type }),
      getCollectionsCount({ ...queryObject, type })
    ]).then(([collectionsData, count]) => {
      if (ref.current !== null) {
        if (collectionsData.success) {
          setCollections(collectionsData.data);
          setTotalCollections(Math.min(count.data, 10000));
        }
        setDataReady(collectionsData.success && count.success);
      }
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchCollections, [search]);

  return (
    <>
      {dataReady === undefined && <Loader />}
      {dataReady === false && <FailedCollections />}

      <div ref={ref}>
        {dataReady === true && (
          <div className='container page-content'>
            <div className='row'>
              <div className='col-12'>
                <div className='card'>
                  <div className='card-header'>
                    <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap'>
                      <div className='filters d-flex align-items-start align-items-md-center justify-content-md-between flex-column flex-md-row'>
                        <ul className='list-inline m-0'>
                          <li className='list-inline-item my-1 my-md-0'>
                            <NetworkLink
                              to={collectionRoutes.collections}
                              className={`badge py-2 px-3 me-2 br-lg ${
                                activeRoute(collectionRoutes.collections)
                                  ? 'badge-grey'
                                  : 'badge-outline badge-outline-grey'
                              }`}
                            >
                              All
                            </NetworkLink>
                            <NetworkLink
                              to={collectionRoutes.collectionsNft}
                              className={`badge py-2 px-3 me-2 br-lg ${
                                activeRoute(collectionRoutes.collectionsNft)
                                  ? 'badge-yellow'
                                  : 'badge-outline badge-outline-yellow'
                              }`}
                            >
                              NFT
                            </NetworkLink>
                            <NetworkLink
                              to={collectionRoutes.collectionsSft}
                              className={`badge py-2 px-3 me-2 br-lg ${
                                activeRoute(collectionRoutes.collectionsSft)
                                  ? 'badge-orange'
                                  : 'badge-outline badge-outline-orange'
                              }`}
                            >
                              SFT
                            </NetworkLink>
                          </li>
                        </ul>
                        <Filters />
                      </div>
                      <div className='d-none d-sm-flex'>
                        {collections && collections.length > 0 && (
                          <Pager
                            page={String(page)}
                            total={
                              totalCollections !== '...'
                                ? Math.min(totalCollections, 10000)
                                : totalCollections
                            }
                            itemsPerPage={25}
                            show={collections.length > 0}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {collections && collections.length > 0 ? (
                    <>
                      <div className='card-body'>
                        <div className='table-wrapper animated-list'>
                          <table className='table mb-0'>
                            <thead>
                              <tr>
                                <th>Collection</th>
                                <th>Name</th>
                                <th>Age</th>
                                <th>Owner</th>
                              </tr>
                            </thead>
                            <tbody data-testid='collectionsTable'>
                              {collections.map((collection, i) => (
                                <tr
                                  key={`${collection.name}-${collection.collection}`}
                                >
                                  <td>
                                    <div className='d-flex align-items-center'>
                                      <NetworkLink
                                        to={urlBuilder.collectionDetails(
                                          collection.collection
                                        )}
                                        data-testid={`collectionsLink${i}`}
                                      >
                                        <div className='d-flex align-items-center'>
                                          {collection.assets &&
                                            collection.assets.svgUrl && (
                                              <img
                                                src={collection.assets.svgUrl}
                                                alt={collection.name}
                                                className='side-icon me-1'
                                              />
                                            )}
                                          <div>{collection.collection}</div>
                                        </div>
                                      </NetworkLink>
                                      <NftBadge
                                        type={collection.type}
                                        className='ms-2'
                                      />
                                    </div>
                                  </td>
                                  <td>{collection.name}</td>
                                  <td>
                                    <TimeAgo
                                      value={collection.timestamp}
                                      tooltip
                                    />
                                  </td>
                                  <td>
                                    <div className='d-flex trim-size-xl'>
                                      <NetworkLink
                                        to={urlBuilder.accountDetails(
                                          collection.owner
                                        )}
                                        className='trim-wrapper'
                                      >
                                        <Trim
                                          text={collection.owner}
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

                      <div className='card-footer px-1 px-sm-spacer d-flex justify-content-center justify-content-sm-end'>
                        <Pager
                          page={String(page)}
                          total={
                            totalCollections !== '...'
                              ? Math.min(totalCollections, 10000)
                              : totalCollections
                          }
                          itemsPerPage={25}
                          show={collections.length > 0}
                        />
                      </div>
                    </>
                  ) : (
                    <NoCollections />
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
