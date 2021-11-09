import * as React from 'react';
import { faClock } from '@fortawesome/pro-regular-svg-icons/faClock';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from 'react-router-dom';
import { types, urlBuilder, dateFormatted, useFilters, useURLSearchParams } from 'helpers';
import {
  Loader,
  adapter,
  DetailItem,
  Trim,
  NetworkLink,
  NftBadge,
  CollectionBlock,
  Denominate,
  TimeAgo,
  ScAddressIcon,
  Pager,
} from 'sharedComponents';
import FailedNftDetails from './FailedNftDetails';
import NftPreview from './NftPreview';

interface NftOwnerType {
  address: string;
  balance: string;
}

const nftText = (type: types.NftType['type']) => {
  switch (type) {
    case 'SemiFungibleESDT':
      return 'SFT';
    case 'NonFungibleESDT':
      return 'NFT';
    case 'MetaESDT':
      return 'Meta-ESDT';
    default:
      return '';
  }
};

const NftDetails = () => {
  const params: any = useParams();
  const { hash: identifier } = params;
  const ref = React.useRef(null);
  const { page } = useURLSearchParams();
  const { getQueryObject, size } = useFilters();
  const { getNft, getNftOwners, getNftOwnersCount } = adapter();
  const [nftDetails, setNftDetails] = React.useState<types.NftType>();
  const [nftOwners, setNftOwners] = React.useState<NftOwnerType[]>([]);
  const [nftOwnersCount, setNftOwnersCount] = React.useState<number | '...'>('...');
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();

  const fetchNftDetails = () => {
    const queryObject = getQueryObject();
    Promise.all([
      getNft(identifier),
      getNftOwners({ ...queryObject, size, identifier }),
      getNftOwnersCount({ ...queryObject, identifier }),
    ]).then(([nftData, nftOwners, nftOwnersCount]) => {
      if (ref.current !== null) {
        if (nftData.success) {
          setNftDetails(nftData.data);
          document.title = `${nftText(nftData.data.type)} Details`;
        }
        if (nftOwners.success && nftOwnersCount.success) {
          setNftOwners(nftOwners.data);
          setNftOwnersCount(Math.min(nftOwnersCount.data, 10000));
        }
        setDataReady(nftData.success);
      }
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchNftDetails, [identifier]); // run the operation only once since the parameter does not change

  return (
    <>
      {dataReady === undefined && <Loader />}
      {dataReady === false && <FailedNftDetails identifier={identifier} />}

      <div ref={ref}>
        {dataReady === true && nftDetails && (
          <div className="container page-content">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <div className="card-header-item d-flex align-items-center">
                      <h6 data-testid="title">{nftText(nftDetails.type)} Details</h6>
                    </div>
                  </div>
                  <div className="card-body p-0">
                    <div className="container-fluid">
                      <DetailItem title="Name">{nftDetails.name}</DetailItem>
                      <DetailItem title="Type">
                        <NftBadge type={nftDetails.type} />
                      </DetailItem>
                      <DetailItem title="Identifier">{nftDetails.identifier}</DetailItem>
                      <DetailItem title="Collection">
                        <CollectionBlock identifier={nftDetails.collection} />
                      </DetailItem>
                      {nftDetails.owner !== undefined && (
                        <DetailItem title="Owner">
                          <div className="d-flex">
                            <NetworkLink
                              to={urlBuilder.accountDetails(nftDetails.owner)}
                              className="trim-wrapper"
                            >
                              <Trim text={nftDetails.owner} />
                            </NetworkLink>
                          </div>
                        </DetailItem>
                      )}
                      <DetailItem title="Creator">
                        <div className="d-flex">
                          <NetworkLink
                            to={urlBuilder.accountDetails(nftDetails.creator)}
                            className="trim-wrapper"
                          >
                            <Trim text={nftDetails.creator} />
                          </NetworkLink>
                        </div>
                      </DetailItem>
                      {nftDetails.timestamp !== undefined && (
                        <DetailItem title="Minted">
                          <FontAwesomeIcon icon={faClock} className="mr-2 text-secondary" />
                          <TimeAgo value={nftDetails.timestamp} />
                          &nbsp;
                          <span className="text-secondary">
                            ({dateFormatted(nftDetails.timestamp)})
                          </span>
                        </DetailItem>
                      )}
                      {nftDetails.royalties !== undefined && nftDetails.royalties !== null && (
                        <DetailItem title="Royalties">{nftDetails.royalties}%</DetailItem>
                      )}
                      {nftDetails.supply !== undefined && (
                        <DetailItem title="Supply">
                          <Denominate
                            value={nftDetails.supply}
                            showLabel={false}
                            denomination={nftDetails.decimals ? nftDetails.decimals : 1}
                          />
                        </DetailItem>
                      )}
                      {nftDetails.decimals !== undefined && (
                        <DetailItem title="Decimals">{nftDetails.decimals}</DetailItem>
                      )}
                      {nftDetails.uris !== undefined && nftDetails.uris[0] && (
                        <DetailItem title="Assets">
                          <NftPreview token={nftDetails} />
                        </DetailItem>
                      )}
                      {nftDetails.tags !== undefined && nftDetails.tags.length > 0 && (
                        <DetailItem title="Tags">
                          {nftDetails.tags.map((tag) => (
                            <div className="badge badge-light p-2 mr-2 font-weight-normal">
                              {tag}
                            </div>
                          ))}
                        </DetailItem>
                      )}
                      {/* {nftDetails.attributes !== undefined && (
                        <DetailItem title="Attributes">
                          <textarea
                            readOnly
                            className="form-control col cursor-text"
                            rows={2}
                            defaultValue={Buffer.from(
                              String(nftDetails.attributes),
                              'base64'
                            ).toString()}
                          />
                        </DetailItem>
                      )} */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {nftOwners && nftOwners.length > 0 && (
              <div className="row mt-spacer">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <div className="card-header-item d-flex justify-content-between align-items-center">
                        <h6>Owners</h6>
                        <div className="d-none d-sm-flex">
                          <Pager
                            page={String(page)}
                            total={nftOwnersCount}
                            itemsPerPage={25}
                            show={nftOwners.length > 0}
                          />
                        </div>
                      </div>
                      <div className="card-body border-0 p-0">
                        <div className="table-wrapper">
                          <table className="table">
                            <thead>
                              <tr>
                                <th>Address</th>
                                <th>Balance</th>
                              </tr>
                            </thead>
                            <tbody data-testid="accountsTable">
                              {nftOwners.map((account, i) => (
                                <tr key={account.address}>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <ScAddressIcon initiator={account.address} />
                                      <NetworkLink
                                        to={urlBuilder.accountDetails(account.address)}
                                        className="trim-only-sm"
                                      >
                                        <Trim
                                          text={account.address}
                                          dataTestId={`accountLink${i}`}
                                        />
                                      </NetworkLink>
                                    </div>
                                  </td>
                                  <td>
                                    <Denominate
                                      value={account.balance}
                                      showLabel={false}
                                      denomination={nftDetails.decimals ? nftDetails.decimals : 1}
                                    />
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
                          total={nftOwnersCount}
                          itemsPerPage={25}
                          show={nftOwners.length > 0}
                        />
                      </div>
                    </div>
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

export default NftDetails;
