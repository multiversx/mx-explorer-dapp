import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  Loader,
  NetworkLink,
  AccountLink,
  Pager,
  PageSize,
  CollectionBlock,
  NftBadge
} from 'components';
import { urlBuilder } from 'helpers';
import { useAdapter, useGetSearch, useGetPage } from 'hooks';
import { NftType } from 'types';

import { FailedNfts } from './components/FailedNfts';
import { Filters } from './components/Filters';
import { NoNfts } from './components/NoNfts';

export const Nfts = () => {
  const ref = useRef(null);
  const [searchParams] = useSearchParams();
  const { search } = useGetSearch();
  const { page, size } = useGetPage();
  const { getNfts, getNftsCount } = useAdapter();

  const [nfts, setNfts] = useState<NftType[]>([]);
  const [dataReady, setDataReady] = useState<boolean | undefined>();
  const [totalNfts, setTotalNfts] = useState<number | '...'>('...');

  const fetchNfts = () => {
    const type = 'SemiFungibleESDT,NonFungibleESDT';

    Promise.all([
      getNfts({ search, page, size, type }),
      getNftsCount({ search, type })
    ]).then(([nftsData, count]) => {
      if (ref.current !== null) {
        if (nftsData.success) {
          setNfts(nftsData.data);
          setTotalNfts(count.data);
        }
        setDataReady(nftsData.success && count.success);
      }
    });
  };

  useEffect(fetchNfts, [searchParams]);

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
                    <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
                      <Filters />
                      {nfts && nfts.length > 0 && (
                        <Pager
                          total={totalNfts}
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
                                              className='side-icon me-1'
                                              alt=''
                                              role='presentation'
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
                                      <AccountLink
                                        address={nft.creator}
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
                        <Pager total={totalNfts} show={nfts.length > 0} />
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
