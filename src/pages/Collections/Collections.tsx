import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { ELLIPSIS } from 'appConstants';
import {
  Loader,
  NetworkLink,
  AccountLink,
  Pager,
  PageSize,
  CollectionLink,
  TimeAgo,
  TableSearch
} from 'components';
import {
  useAdapter,
  useGetSearch,
  useGetPage,
  useActiveRoute,
  useHasGrowthWidgets,
  useIsMainnet
} from 'hooks';
import { pageHeadersCollectionsStatsSelector } from 'redux/selectors/pageHeadersCollectionsStats';
import { collectionRoutes } from 'routes';
import { NftTypeEnum, CollectionType, CollectionSortEnum } from 'types';

import { FailedCollections } from './components/FailedCollections';
import { NoCollections } from './components/NoCollections';

export const Collections = () => {
  const hasGrowthWidgets = useHasGrowthWidgets();
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
  const [totalCollections, setTotalCollections] = useState<
    number | typeof ELLIPSIS
  >(ELLIPSIS);

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
        ...(isMainnet
          ? { sort: CollectionSortEnum.verifiedAndHolderCount }
          : {})
      }),
      getCollectionsCount({ search, type })
    ]).then(([collectionsData, count]) => {
      if (collectionsData.success) {
        setCollections(collectionsData.data);
        setTotalCollections(count.data);
      }
      setDataReady(collectionsData.success && count.success);
    });
  };

  useEffect(fetchCollections, [searchLocation, pathname]);

  if (
    dataReady === undefined ||
    (hasGrowthWidgets && Object.keys(pageHeadersCollections).length === 0)
  ) {
    return <Loader />;
  }

  return (
    <div className='collections container page-content'>
      {dataReady === false && <FailedCollections />}
      {dataReady === true && (
        <div className='row'>
          <div className='col-12'>
            <div className='card'>
              <div className='card-header'>
                <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
                  <div className='filters d-flex align-items-start align-items-md-center justify-content-md-between flex-column flex-md-row gap-3'>
                    <menu className='list-inline m-0 d-flex flex-wrap gap-2'>
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
                            activeRoute(`${collectionRoutes.collections}/nft`)
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
                            activeRoute(`${collectionRoutes.collections}/sft`)
                              ? 'badge-orange'
                              : 'badge-outline badge-outline-orange'
                          }`}
                        >
                          SFT
                        </NetworkLink>
                      </li>
                    </menu>
                    <div className='filters collections-filters'>
                      <TableSearch
                        className='input-group-sm'
                        searchValue={totalCollections}
                        placeholderText='collection'
                        name='collectionsSearch'
                      />
                    </div>
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
                            <th className='table-width-xl-helper'>Holders</th>
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
                                  <CollectionLink
                                    collection={collection}
                                    data-testid={`collectionLink${i}`}
                                  />
                                </div>
                              </td>
                              <td>{collection.name}</td>
                              <td>
                                <TimeAgo value={collection.timestamp} tooltip />
                              </td>
                              <td>
                                {collection?.nftCount
                                  ? new BigNumber(collection.nftCount).toFormat(
                                      0
                                    )
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
                                  <AccountLink
                                    address={collection.owner}
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
      )}
    </div>
  );
};
