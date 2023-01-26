import * as React from 'react';
import { faUser } from '@fortawesome/pro-regular-svg-icons/faUser';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import {
  Loader,
  useAdapter,
  Pager,
  NetworkLink,
  Trim,
  PageState,
  NftBadge
} from 'components';
import {
  urlBuilder,
  useURLSearchParams,
  useGetFilters,
  nftText
} from 'helpers';
import { activeNetworkSelector, collectionSelector } from 'redux/selectors';
import { NftType } from 'types';
import { CollectionTabs } from './CollectionLayout/CollectionTabs';

export const CollectionNfts = () => {
  const ref = React.useRef(null);

  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { type } = useSelector(collectionSelector);
  const { getNfts, getNftsCount } = useAdapter();
  const { page } = useURLSearchParams();

  const { getQueryObject, size } = useGetFilters();

  const { hash: collection } = useParams() as any;

  const [collectionNfts, setCollectionNfts] = React.useState<NftType[]>([]);
  const [totalCollectionNfts, setTotalCollectionNfts] =
    React.useState<number>(0);
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();

  const fetchCollectionNfts = () => {
    if (ref.current !== null) {
      const queryObject = getQueryObject();
      Promise.all([
        getNfts({ ...queryObject, size, collection }),
        getNftsCount({ ...queryObject, collection })
      ]).then(([nftsData, count]) => {
        if (nftsData.success && count.success) {
          setCollectionNfts(nftsData.data);
          setTotalCollectionNfts(Math.min(count.data, 10000));
        }
        setDataReady(nftsData.success && count.success);
      });
    }
  };

  React.useEffect(() => {
    fetchCollectionNfts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNetworkId, size]);

  const showCollectionNfts = dataReady === true && collectionNfts.length > 0;

  return (
    <div ref={ref}>
      <div className='card'>
        <div className='card-header'>
          <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap'>
            <CollectionTabs />

            <Pager
              page={String(page)}
              total={
                totalCollectionNfts ? Math.min(totalCollectionNfts, 10000) : 0
              }
              itemsPerPage={25}
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
                                    alt={nft.name}
                                    className='side-icon me-1'
                                  />
                                )}
                                <div>{nft.identifier}</div>
                              </div>
                            </NetworkLink>
                            {type !== 'MetaESDT' && (
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
                            <NetworkLink
                              to={urlBuilder.accountDetails(
                                nft.owner ? nft.owner : nft.creator
                              )}
                              className='trim-wrapper'
                            >
                              <Trim
                                text={nft.owner ? nft.owner : nft.creator}
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
                  totalCollectionNfts ? Math.min(totalCollectionNfts, 10000) : 0
                }
                itemsPerPage={25}
                show={collectionNfts.length > 0}
              />
            </div>
          </>
        ) : (
          <>
            {dataReady === undefined && (
              <Loader dataTestId='collectionCollectionNftsLoader' />
            )}
            {dataReady === false && (
              <PageState
                icon={faUser}
                title={`Unable to load ${nftText(type)}`}
                className='py-spacer my-auto'
                dataTestId='errorScreen'
              />
            )}
            {dataReady === true && collectionNfts.length === 0 && (
              <PageState
                icon={faUser}
                title={`No ${nftText(type)}s`}
                className='py-spacer my-auto'
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
