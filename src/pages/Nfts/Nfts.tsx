import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  Loader,
  NetworkLink,
  AccountLink,
  Pager,
  PageSize,
  CollectionBlock,
  NftBadge,
  TableSearch
} from 'components';
import { urlBuilder } from 'helpers';
import { useAdapter, useGetSearch, useGetPage } from 'hooks';
import { NftType } from 'types';

import { FailedNfts } from './components/FailedNfts';
import { NoNfts } from './components/NoNfts';

export const Nfts = () => {
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
      if (nftsData.success) {
        setNfts(nftsData.data);
        setTotalNfts(count.data);
      }
      setDataReady(nftsData.success && count.success);
    });
  };

  useEffect(fetchNfts, [searchParams]);

  if (dataReady === undefined) {
    return <Loader />;
  }

  return (
    <div className='nfts container page-content'>
      {dataReady === false && <FailedNfts />}
      {dataReady === true && (
        <div className='row'>
          <div className='col-12'>
            <div className='card'>
              <div className='card-header'>
                <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
                  <div className='filters nfts-filters'>
                    <TableSearch
                      className='input-group-sm'
                      searchValue={totalNfts}
                      placeholderText='NFT'
                      name='nftsSearch'
                    />
                  </div>
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
                                  <NftBadge
                                    type={nft.type}
                                    subType={nft.subType}
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
      )}
    </div>
  );
};
