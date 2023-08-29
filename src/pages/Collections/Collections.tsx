import { useEffect, useRef, useState } from 'react';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import {
  Loader,
  NetworkLink,
  Trim,
  Pager,
  CollectionLink,
  TimeAgo
} from 'components';
import { urlBuilder } from 'helpers';
import {
  useAdapter,
  useGetSearch,
  useGetPage,
  useActiveRoute,
  useIsMainnet
} from 'hooks';
import { pageHeadersCollectionsStatsSelector } from 'redux/selectors/pageHeadersCollectionsStats';
import { collectionRoutes } from 'routes';
import { NftTypeEnum, CollectionType } from 'types';

import { FailedCollections } from './components/FailedCollections';
import { Filters } from './components/Filters';
import { NoCollections } from './components/NoCollections';

export const Collections = () => {
  const ref = useRef(null);
  const isMainnet = useIsMainnet();
  const activeRoute = useActiveRoute();
  const { page, size } = useGetPage();
  const { search } = useGetSearch();
  const { search: searchLocation, pathname } = useLocation();
  const { getCollections, getCollectionsCount } = useAdapter();
  const pageHeadersCollections = useSelector(
    pageHeadersCollectionsStatsSelector
  );

  const [collections, setCollections] = useState<CollectionType[]>([]);
  const [dataReady, setDataReady] = useState<boolean | undefined>();
  const [totalCollections, setTotalCollections] = useState<number | '...'>(
    '...'
  );

  const getCollectionType = () => {
    if (activeRoute(collectionRoutes.collectionsNft)) {
      return NftTypeEnum.NonFungibleESDT;
    }
    if (activeRoute(collectionRoutes.collectionsSft)) {
      return NftTypeEnum.SemiFungibleESDT;
    }

    return [NftTypeEnum.NonFungibleESDT, NftTypeEnum.SemiFungibleESDT].join();
  };

  const fetchCollections = () => {
    const type = getCollectionType();

    Promise.all([
      getCollections({
        search,
        page,
        size,
        type,
        sort: 'verifiedAndHolderCount'
      }),
      getCollectionsCount({ search, type })
    ]).then(([collectionsData, count]) => {
      if (ref.current !== null) {
        if (collectionsData.success) {
          setCollections(collectionsData.data);
          setTotalCollections(count.data);
        }
        setDataReady(collectionsData.success && count.success);
      }
    });
  };

  useEffect(fetchCollections, [searchLocation, pathname]);

  return (
    <>
      {(dataReady === undefined ||
        (isMainnet && Object.keys(pageHeadersCollections).length === 0)) && (
        <Loader />
      )}
      {dataReady === false && <FailedCollections />}

      <div ref={ref}>
        {dataReady === true && (
          <div className='container page-content'>
            <div className='row'>
              <div className='col-12'>
                <div className='card'>
                  <div className='card-header'>
                    <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
                      <div className='filters d-flex align-items-start align-items-md-center justify-content-md-between flex-column flex-md-row gap-3'>
                        <ul className='list-inline m-0 d-flex flex-wrap gap-2'>
                          <li className='list-inline-item me-0'>
                            <NetworkLink
                              to={collectionRoutes.collections}
                              className={`badge py-2 px-3 br-lg ${
                                activeRoute(collectionRoutes.collections)
                                  ? 'badge-grey'
                                  : 'badge-outline badge-outline-grey'
                              }`}
                            >
                              All
                            </NetworkLink>
                          </li>
                          <li className='list-inline-item me-0'>
                            <NetworkLink
                              to={`${collectionRoutes.collections}/nft`}
                              className={`badge py-2 px-3 br-lg ${
                                activeRoute(
                                  `${collectionRoutes.collections}/nft`
                                )
                                  ? 'badge-yellow'
                                  : 'badge-outline badge-outline-yellow'
                              }`}
                            >
                              NFT
                            </NetworkLink>
                          </li>
                          <li className='list-inline-item me-0'>
                            <NetworkLink
                              to={`${collectionRoutes.collections}/sft`}
                              className={`badge py-2 px-3 br-lg ${
                                activeRoute(
                                  `${collectionRoutes.collections}/sft`
                                )
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
                            total={totalCollections}
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
                                <th className='table-width-xl-helper'>Items</th>
                                <th className='table-width-xl-helper'>
                                  Holders
                                </th>
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
                                      <CollectionLink collection={collection} />
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
                                    {collection?.nftCount
                                      ? new BigNumber(
                                          collection.nftCount
                                        ).toFormat(0)
                                      : ''}
                                  </td>
                                  <td>
                                    {collection?.holderCount
                                      ? new BigNumber(
                                          collection.holderCount
                                        ).toFormat(0)
                                      : ''}
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

                      <div className='card-footer d-flex justify-content-center justify-content-sm-end'>
                        <Pager
                          total={totalCollections}
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
