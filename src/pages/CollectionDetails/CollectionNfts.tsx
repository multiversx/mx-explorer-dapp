import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router';

import {
  Loader,
  Pager,
  PageSize,
  PageState,
  NftTable,
  NftList
} from 'components';
import { getNftText } from 'helpers';
import { useAdapter, useGetPage, useGetSearch } from 'hooks';
import { faUser } from 'icons/regular';
import { CollectionTabs } from 'layouts/CollectionLayout/CollectionTabs';
import { activeNetworkSelector, collectionSelector } from 'redux/selectors';
import { NftType, NftTypeEnum } from 'types';

export const CollectionNfts = () => {
  const ref = useRef(null);
  const [searchParams] = useSearchParams();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { collectionState } = useSelector(collectionSelector);
  const { type } = collectionState;
  const { getCollectionNfts, getCollectionNftsCount } = useAdapter();
  const { page, size, searchAfter } = useGetPage();
  const { search } = useGetSearch();

  const { hash: collection } = useParams() as any;

  const [collectionNfts, setCollectionNfts] = useState<NftType[]>([]);
  const [totalCollectionNfts, setTotalCollectionNfts] = useState<number>(0);
  const [dataReady, setDataReady] = useState<boolean | undefined>();

  const fetchCollectionNfts = () => {
    if (ref.current !== null) {
      Promise.all([
        getCollectionNfts({
          search,
          page,
          size,
          searchAfter,
          collection,
          ...(type === NftTypeEnum.NonFungibleESDT ? { withOwner: true } : {}),
          ...(type === NftTypeEnum.SemiFungibleESDT ? { withSupply: true } : {})
        }),
        getCollectionNftsCount({ search, collection })
      ]).then(([nftsData, count]) => {
        if (nftsData.success && count.success) {
          setCollectionNfts(nftsData.data);
          setTotalCollectionNfts(count.data);
        }
        setDataReady(nftsData.success && count.success);
      });
    }
  };

  useEffect(() => {
    fetchCollectionNfts();
  }, [activeNetworkId, searchParams]);

  const showCollectionNfts = dataReady === true && collectionNfts.length > 0;

  return (
    <div ref={ref}>
      <div className='card'>
        <div className='card-header'>
          <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
            <CollectionTabs />
            <Pager
              total={totalCollectionNfts}
              show={collectionNfts.length > 0}
              className='d-flex ms-auto me-auto me-sm-0'
              items={collectionNfts}
            />
          </div>
        </div>
        {showCollectionNfts ? (
          <>
            <div className='card-body'>
              <NftList nfts={collectionNfts} />
            </div>
            <div className='card-footer table-footer'>
              <PageSize />
              <Pager
                total={totalCollectionNfts}
                show={collectionNfts.length > 0}
                items={collectionNfts}
              />
            </div>
          </>
        ) : (
          <>
            {dataReady === undefined && (
              <Loader data-testid='collectionCollectionNftsLoader' />
            )}
            {dataReady === false && (
              <PageState
                icon={faUser}
                title={`Unable to load ${getNftText(type)}`}
                isError
              />
            )}
            {dataReady === true && collectionNfts.length === 0 && (
              <PageState icon={faUser} title={`No ${getNftText(type)}s`} />
            )}
          </>
        )}
      </div>
    </div>
  );
};
