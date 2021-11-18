import * as React from 'react';
import {
  Loader,
  adapter,
  NetworkLink,
  Trim,
  Pager,
  CollectionBlock,
  NftBadge,
} from 'sharedComponents';
import NoNfts from './NoNfts';
import FailedNfts from './FailedNfts';
import { urlBuilder, useFilters, useURLSearchParams, types } from 'helpers';
import Filters from './Filters';
import { useLocation } from 'react-router-dom';

const Nfts = () => {
  const ref = React.useRef(null);
  const { page } = useURLSearchParams();
  const { search } = useLocation();
  const { getQueryObject, size } = useFilters();
  const { getNfts, getNftsCount } = adapter();

  const [nfts, setNfts] = React.useState<types.NftType[]>([]);
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [totalNfts, setTotalNfts] = React.useState<number | '...'>('...');

  const fetchNfts = () => {
    const queryObject = getQueryObject();
    const type = 'SemiFungibleESDT,NonFungibleESDT';

    Promise.all([
      getNfts({ ...queryObject, size, type }),
      getNftsCount({ ...queryObject, type }),
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

  React.useEffect(fetchNfts, [search]);

  return (
    <>
      {dataReady === undefined && <Loader />}
      {dataReady === false && <FailedNfts />}

      <div ref={ref}>
        {dataReady === true && (
          <div className="container page-content">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <div className="card-header-item d-flex justify-content-between align-items-center">
                      <Filters />
                      {nfts && nfts.length > 0 && (
                        <div className="d-none d-sm-flex">
                          <Pager
                            page={String(page)}
                            total={totalNfts !== '...' ? Math.min(totalNfts, 10000) : totalNfts}
                            itemsPerPage={25}
                            show={nfts.length > 0}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {nfts && nfts.length > 0 ? (
                    <>
                      <div className="card-body border-0 p-0">
                        <div className="table-wrapper">
                          <table className="table">
                            <thead>
                              <tr>
                                <th>Identifier</th>
                                <th>Name</th>
                                <th>Collection</th>
                                <th>Creator Account</th>
                              </tr>
                            </thead>
                            <tbody data-testid="nftsTable">
                              {nfts.map((nft, i) => (
                                <tr key={`${nft.name}-${nft.identifier}`}>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <NetworkLink
                                        to={urlBuilder.nftDetails(nft.identifier)}
                                        data-testid={`nftsLink${i}`}
                                        className={`d-flex ${
                                          nft.assets?.svgUrl ? 'token-link' : ''
                                        }`}
                                      >
                                        <div className="d-flex align-items-center">
                                          {nft.assets && nft.assets.svgUrl && (
                                            <img
                                              src={nft.assets.svgUrl}
                                              alt={nft.name}
                                              className="token-icon mr-1"
                                            />
                                          )}
                                          <div>{nft.identifier}</div>
                                        </div>
                                      </NetworkLink>
                                      <NftBadge type={nft.type} className="ml-2" />
                                    </div>
                                  </td>
                                  <td>{nft.name}</td>
                                  <td>
                                    <CollectionBlock nft={nft} />
                                  </td>
                                  <td>
                                    <div className="d-flex trim-size-xl">
                                      <NetworkLink
                                        to={urlBuilder.accountDetails(nft.creator)}
                                        className="trim-wrapper"
                                      >
                                        <Trim text={nft.creator} dataTestId={`accountLink${i}`} />
                                      </NetworkLink>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="card-footer d-flex justify-content-end">
                        <Pager
                          page={String(page)}
                          total={totalNfts !== '...' ? Math.min(totalNfts, 10000) : totalNfts}
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

export default Nfts;
