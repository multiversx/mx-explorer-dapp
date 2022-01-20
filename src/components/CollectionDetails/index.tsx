import * as React from 'react';
import { useParams } from 'react-router-dom';
import { urlBuilder, dateFormatted, useFilters, useURLSearchParams } from 'helpers';
import { NftType, NftEnumType, CollectionType } from 'helpers/types';
import {
  Loader,
  adapter,
  DetailItem,
  Trim,
  NetworkLink,
  NftBadge,
  TimeAgo,
  Pager,
  PageState,
  PropertyPill,
} from 'sharedComponents';
import FailedCollectionDetails from './FailedCollectionDetails';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faPalette } from '@fortawesome/pro-regular-svg-icons';
import { faCoins } from '@fortawesome/pro-solid-svg-icons';

const nftText = (type: NftType['type']) => {
  switch (type) {
    case NftEnumType.SemiFungibleESDT:
      return 'SFT';
    case NftEnumType.NonFungibleESDT:
      return 'NFT';
    case NftEnumType.MetaESDT:
      return 'Meta-ESDT';
    default:
      return '';
  }
};

const CollectionDetails = () => {
  const params: any = useParams();
  const { hash: identifier } = params;
  const ref = React.useRef(null);
  const { page } = useURLSearchParams();
  const { getQueryObject, size } = useFilters();
  const { getCollection, getNfts, getNftsCount } = adapter();
  const [collectionDetails, setCollectionDetails] = React.useState<CollectionType>();
  const [nfts, setNfts] = React.useState<NftType[]>([]);
  const [totalNfts, setTotalNfts] = React.useState<number | '...'>('...');
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();

  const fetchCollectionDetails = () => {
    const queryObject = getQueryObject();
    const collection = identifier;
    Promise.all([
      getCollection(identifier),
      getNfts({ ...queryObject, size, collection }),
      getNftsCount({ ...queryObject, collection }),
    ]).then(([collectionData, nftsData, count]) => {
      if (ref.current !== null) {
        if (collectionData.success && nftsData.success && count.success) {
          setCollectionDetails(collectionData.data);
          setNfts(nftsData.data);
          setTotalNfts(Math.min(count.data, 10000));
        }
        setDataReady(collectionData.success && nftsData.success && count.success);
      }
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchCollectionDetails, [identifier]); // run the operation only once since the parameter does not change

  return (
    <>
      {dataReady === undefined && <Loader />}
      {dataReady === false && <FailedCollectionDetails identifier={identifier} />}

      <div ref={ref}>
        {dataReady === true && collectionDetails && (
          <div className="container page-content">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <div className="card-header-item d-flex align-items-center">
                      <h6 data-testid="title">Collection Details</h6>
                    </div>
                  </div>
                  <div className="card-body p-0">
                    <div className="container-fluid">
                      <DetailItem title="Name">
                        <div className="d-flex align-items-center">
                          {collectionDetails.assets && collectionDetails.assets.svgUrl && (
                            <img
                              src={collectionDetails.assets.svgUrl}
                              alt={collectionDetails.name}
                              className="token-icon mr-1"
                            />
                          )}
                          <div>{collectionDetails.name}</div>
                        </div>
                      </DetailItem>
                      <DetailItem title="Collection">{collectionDetails.collection}</DetailItem>
                      {collectionDetails.ticker !== undefined &&
                        collectionDetails.ticker !== collectionDetails.collection && (
                          <DetailItem title="Ticker">{collectionDetails.ticker}</DetailItem>
                        )}
                      <DetailItem title="Type">
                        <NftBadge type={collectionDetails.type} />
                      </DetailItem>
                      <DetailItem title="Owner">
                        <div className="d-flex">
                          <NetworkLink
                            to={urlBuilder.accountDetails(collectionDetails.owner)}
                            className="trim-wrapper"
                          >
                            <Trim text={collectionDetails.owner} />
                          </NetworkLink>
                        </div>
                      </DetailItem>
                      {collectionDetails.timestamp !== undefined && (
                        <DetailItem title="Created">
                          <FontAwesomeIcon icon={faClock} className="mr-2 text-secondary" />
                          <TimeAgo value={collectionDetails.timestamp} />
                          &nbsp;
                          <span className="text-secondary">
                            ({dateFormatted(collectionDetails.timestamp, false, true)})
                          </span>
                        </DetailItem>
                      )}
                      {collectionDetails.decimals !== undefined && (
                        <DetailItem title="Decimals">{collectionDetails.decimals}</DetailItem>
                      )}
                      <DetailItem title="Properties">
                        <div className="d-flex alig-items-center flex-wrap col-lg-7 ml-n3">
                          <PropertyPill
                            name={'Can Transfer Role'}
                            active={collectionDetails.canTransferRole}
                          />
                          <PropertyPill name={'Can Pause'} active={collectionDetails.canPause} />
                          <PropertyPill name={'Can Freeze'} active={collectionDetails.canFreeze} />
                          <PropertyPill name={'Can Wipe'} active={collectionDetails.canWipe} />
                        </div>
                      </DetailItem>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {nfts && (
              <div className="row mt-spacer">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <div className="card-header-item d-flex justify-content-between align-items-center">
                        <h6 data-testid="title">{`${nftText(collectionDetails.type)}`}s</h6>
                        <div className="d-none d-sm-flex">
                          <Pager
                            page={String(page)}
                            total={totalNfts !== '...' ? Math.min(totalNfts, 10000) : totalNfts}
                            itemsPerPage={25}
                            show={nfts.length > 0}
                          />
                        </div>
                      </div>
                    </div>

                    {nfts.length > 0 ? (
                      <>
                        <div className="card-body border-0 p-0">
                          <div className="table-wrapper">
                            <table className="table">
                              <thead>
                                <tr>
                                  <th>Identifier</th>
                                  <th>Name</th>
                                  <th>Creator</th>
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
                                        {collectionDetails.type !== 'MetaESDT' && (
                                          <NftBadge type={nft.type} className="ml-2" />
                                        )}
                                      </div>
                                    </td>
                                    <td>
                                      {nft.scamInfo ? `[Hidden - ${nft.scamInfo.info}]` : nft.name}
                                    </td>
                                    <td>
                                      <div className="d-flex trim-size-xl">
                                        <NetworkLink
                                          to={urlBuilder.accountDetails(
                                            nft.owner ? nft.owner : nft.creator
                                          )}
                                          className="trim-wrapper"
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
                      <PageState
                        icon={collectionDetails.type === 'MetaESDT' ? faCoins : faPalette}
                        title={`No ${nftText(collectionDetails.type)}`}
                        className="py-spacer my-auto"
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CollectionDetails;
