import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';

import {
  Loader,
  Pager,
  PageSize,
  NetworkLink,
  AccountLink,
  PageState,
  NftBadge
} from 'components';
import { urlBuilder, getNftText, formatBigNumber } from 'helpers';
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
  const { page, size } = useGetPage();
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
            />
          </div>
        </div>
        {showCollectionNfts ? (
          <>
            <div className='card-body'>
              <div className='table-wrapper animated-list'>
                <table className='table mb-0'>
                  <thead>
                    <tr>
                      <th>Identifier</th>
                      <th>Name</th>
                      <th>Creator</th>
                      <th>
                        {type === NftTypeEnum.NonFungibleESDT && <>Owner</>}
                        {type === NftTypeEnum.SemiFungibleESDT && <>Supply</>}
                      </th>
                    </tr>
                  </thead>
                  <tbody data-testid='nftsTable'>
                    {collectionNfts.map((nft, i) => (
                      <tr key={`${nft.name}-${nft.identifier}`}>
                        <td>
                          <div className='d-flex align-items-center'>
                            <NetworkLink
                              to={urlBuilder.nftDetails(nft.identifier)}
                              data-testid={`nftsLink${i}`}
                              className={`d-flex text-truncate ${
                                nft.assets?.svgUrl ? 'side-link' : ''
                              }`}
                            >
                              <div className='d-flex align-items-center'>
                                {nft.assets && nft.assets.svgUrl && (
                                  <img
                                    src={nft.assets.svgUrl}
                                    className='side-icon me-1'
                                    alt=''
                                    role='presentation'
                                  />
                                )}
                                <div>{nft.identifier}</div>
                              </div>
                            </NetworkLink>
                            {type !== NftTypeEnum.MetaESDT && (
                              <NftBadge type={nft.type} className='ms-2' />
                            )}
                          </div>
                        </td>
                        <td>
                          {nft.scamInfo
                            ? `[Hidden - ${nft.scamInfo.info}]`
                            : nft.name}
                        </td>
                        <td>
                          <div className='d-flex trim-size-xl'>
                            <AccountLink address={nft.creator} />
                          </div>
                        </td>
                        <td>
                          {type === NftTypeEnum.NonFungibleESDT &&
                            nft?.owner && (
                              <div className='d-flex trim-size-xl'>
                                <AccountLink address={nft.owner} />
                              </div>
                            )}
                          {type === NftTypeEnum.SemiFungibleESDT &&
                            nft?.supply && (
                              <>{formatBigNumber({ value: nft.supply })}</>
                            )}
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
                total={totalCollectionNfts}
                show={collectionNfts.length > 0}
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
