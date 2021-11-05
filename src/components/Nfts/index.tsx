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

    Promise.all([getNfts({ ...queryObject, size }), getNftsCount(queryObject)]).then(
      ([nftsData, count]) => {
        if (ref.current !== null) {
          if (nftsData.success) {
            setNfts(nftsData.data);
            setTotalNfts(Math.min(count.data, 10000));
          }
          setDataReady(nftsData.success && count.success);
        }
      }
    );
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
                            show={totalNfts > 25}
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
                                <th>Name</th>
                                <th>Identifier</th>
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
                                      >
                                        <div className="d-flex align-items-center">
                                          <div>{nft.ticker ? nft.ticker : nft.name}</div>
                                        </div>
                                      </NetworkLink>
                                      <NftBadge type={nft.type} className="ml-2" />
                                    </div>
                                  </td>
                                  <td>{nft.identifier}</td>
                                  <td>
                                    <CollectionBlock identifier={nft.collection} />
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
