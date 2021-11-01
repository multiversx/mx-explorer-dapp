import * as React from 'react';
import { useParams } from 'react-router-dom';
import { types, urlBuilder } from 'helpers';
import {
  Loader,
  adapter,
  DetailItem,
  Trim,
  NetworkLink,
  NftBadge,
  CollectionBlock,
} from 'sharedComponents';
import FailedNftDetails from './FailedNftDetails';
import NftPreview from './NftPreview';

const nftText = (type: types.NftType['type']) => {
  switch (type) {
    case 'SemiFungibleESDT':
      return 'SFT';
    case 'NonFungibleESDT':
      return 'NFT';
    case 'MetaESDT':
      return 'META';
    default:
      return '';
  }
};

const NftDetails = () => {
  const params: any = useParams();
  const { hash: identifier } = params;
  const ref = React.useRef(null);
  const { getNft } = adapter();
  const [nftDetails, setNftDetails] = React.useState<types.NftType>();
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();

  const fetchNftDetails = () => {
    getNft(identifier).then(({ success, data }) => {
      if (ref.current !== null) {
        setNftDetails(data);
        setDataReady(success);
        if (success && data && data.type) {
          document.title = `${nftText(data.type)} Details`;
        }
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
                      {nftDetails.royalties !== null && (
                        <DetailItem title="Royalties">{nftDetails.royalties}%</DetailItem>
                      )}
                      {nftDetails.supply !== undefined && Number(nftDetails.supply) > 0 && (
                        <DetailItem title="Supply">{nftDetails.supply}</DetailItem>
                      )}
                      {nftDetails.decimals !== undefined && (
                        <DetailItem title="Decimals">{nftDetails.decimals}</DetailItem>
                      )}
                      {nftDetails.uris !== undefined && nftDetails.uris[0] && (
                        <DetailItem title="Assets">
                          <NftPreview token={nftDetails} />
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
          </div>
        )}
      </div>
    </>
  );
};

export default NftDetails;
