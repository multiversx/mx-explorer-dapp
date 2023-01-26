import * as React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Loader,
  useAdapter,
  NetworkLink,
  Trim,
  Pager,
  CollectionBlock,
  NftBadge
} from 'components';
import { urlBuilder, useGetFilters, useURLSearchParams } from 'helpers';
import { NftType } from 'types';
import { FailedNfts } from './FailedNfts';
import { Filters } from './Filters';
import { NoNfts } from './NoNfts';

export const Nfts = () => {
  const ref = React.useRef(null);
  const { page } = useURLSearchParams();
  const { search } = useLocation();
  const { getQueryObject, size } = useGetFilters();
  const { getNfts, getNftsCount } = useAdapter();

  const [nfts, setNfts] = React.useState<NftType[]>([]);
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [totalNfts, setTotalNfts] = React.useState<number | '...'>('...');

  const fetchNfts = () => {
    const queryObject = getQueryObject();
    const type = 'SemiFungibleESDT,NonFungibleESDT';

    Promise.all([
      getNfts({ ...queryObject, size, type }),
      getNftsCount({ ...queryObject, type })
    ]).then(([nftsData, count]) => {
      if (ref.current !== null) {
        if (nftsData.success) {
          setNfts(nftsData.data);
          setTotalNfts(Math.min(count.data, 10000));
        }
        setDataReady(nftsData.success && count.success);
      }
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchNfts, [search]);

  return (
    <>
      {dataReady === undefined && <Loader />}
      {dataReady === false && <FailedNfts />}

      <div ref={ref}>
        {dataReady === true && (
          <div className='container page-content'>
            <div className='row'>
              <div className='col-12'>
                <div className='card'>
                  <div className='card-header'>
                    <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap'>
                      <Filters />
                      {nfts && nfts.length > 0 && (
                        <Pager
                          page={String(page)}
                          total={
                            totalNfts !== '...'
                              ? Math.min(totalNfts, 10000)
                              : totalNfts
                          }
                          itemsPerPage={25}
                          show={nfts.length > 0}
                          className='d-flex ms-auto me-auto me-sm-0'
                        />
                      )}
                    </div>
                  </div>

                  {nfts && nfts.length > 0 ? (
                    <>
                      <div className='card-body'>
                        <div className='table-wrapper animated-list'>
                          <table className='table mb-0'>
                            <thead>
                              <tr>
                                <th>Identifier</th>
                                <th>Name</th>
                                <th>Collection</th>
                                <th>Creator Account</th>
                              </tr>
                            </thead>
                            <tbody data-testid='nftsTable'>
                              {nfts.map((nft, i) => (
                                <tr key={`${nft.name}-${nft.identifier}`}>
                                  <td>
                                    <div className='d-flex align-items-center'>
                                      <NetworkLink
                                        to={urlBuilder.nftDetails(
                                          nft.identifier
                                        )}
                                        data-testid={`nftsLink${i}`}
                                        className={`d-flex text-truncate ${
                                          nft.assets?.svgUrl ? 'side-link' : ''
                                        }`}
                                      >
                                        <div className='d-flex align-items-center'>
                                          {nft.assets && nft.assets.svgUrl && (
                                            <img
                                              src={nft.assets.svgUrl}
                                              alt={nft.identifier}
                                              className='side-icon me-1'
                                            />
                                          )}
                                          <div>{nft.identifier}</div>
                                        </div>
                                      </NetworkLink>
                                      <NftBadge
                                        type={nft.type}
                                        className='ms-2'
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    {nft.scamInfo
                                      ? `[Hidden - ${nft.scamInfo.info}]`
                                      : nft.name}
                                  </td>
                                  <td>
                                    <CollectionBlock nft={nft} />
                                  </td>
                                  <td>
                                    <div className='d-flex trim-size-xl'>
                                      <NetworkLink
                                        to={urlBuilder.accountDetails(
                                          nft.creator
                                        )}
                                        className='trim-wrapper'
                                      >
                                        <Trim
                                          text={nft.creator}
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
                            totalNfts !== '...'
                              ? Math.min(totalNfts, 10000)
                              : totalNfts
                          }
                          itemsPerPage={25}
                          show={nfts.length > 0}
                        />
                      </div>
                    </>
                  ) : (
                    <NoNfts />
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
