import * as React from 'react';
import { useParams } from 'react-router-dom';
import { types, urlBuilder } from 'helpers';
import { Loader, adapter, DetailItem, Trim, NetworkLink, NftBadge } from 'sharedComponents';
import FailedCollectionDetails from './FailedCollectionDetails';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-light-svg-icons/faTimes';
import { faCheck } from '@fortawesome/pro-light-svg-icons/faCheck';

const CreatePill = ({ name, active }: { name: string; active: boolean }) => {
  return (
    <span className={`direction-badge m-1 ${active ? 'in' : 'out'}`}>
      <FontAwesomeIcon className="mr-1" icon={active ? faCheck : faTimes} /> {name}
    </span>
  );
};

const CollectionDetails = () => {
  const params: any = useParams();
  const { hash: identifier } = params;

  const ref = React.useRef(null);

  const { getCollection } = adapter();

  const [collectionDetails, setCollectionDetails] = React.useState<types.CollectionType>();
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();

  const fetchCollectionDetails = () => {
    getCollection(identifier).then(({ success, data }) => {
      if (ref.current !== null) {
        setCollectionDetails(data);
        setDataReady(success);
      }
    });
  };

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
                      <DetailItem title="Ticker">{collectionDetails.ticker}</DetailItem>
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
                      {collectionDetails.decimals !== undefined && (
                        <DetailItem title="Decimals">{collectionDetails.decimals}</DetailItem>
                      )}
                      <DetailItem title="Properties">
                        <div className="d-flex alig-items-center flex-wrap col-lg-7 ml-n3">
                          <CreatePill
                            name={'Can Transfer Role'}
                            active={collectionDetails.canTransferRole}
                          />
                          <CreatePill name={'Can Pause'} active={collectionDetails.canPause} />
                          <CreatePill name={'Can Freeze'} active={collectionDetails.canFreeze} />
                          <CreatePill name={'Can Wipe'} active={collectionDetails.canWipe} />
                        </div>
                      </DetailItem>
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

export default CollectionDetails;
