import * as React from 'react';
import { useParams } from 'react-router-dom';
import { types, urlBuilder } from 'helpers';
import { Loader, adapter, DetailItem, Trim, Denominate, NetworkLink } from 'sharedComponents';
import FailedTokenDetails from './FailedTokenDetails';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-light-svg-icons/faTimes';
import { faCheck } from '@fortawesome/pro-light-svg-icons/faCheck';

const CreatePill = ({ name, active }: { name: string; active: boolean }) => {
  return (
    <span className={`direction-badge mr-1 ${active ? 'in' : 'out'}`}>
      <FontAwesomeIcon className="mr-1" icon={active ? faCheck : faTimes} /> {name}
    </span>
  );
};

const TokenDetails = () => {
  const params: any = useParams();
  const { hash: tokenId } = params;

  const ref = React.useRef(null);

  const { getTokenDetails } = adapter();

  const [tokenDetails, setTokenDetails] = React.useState<types.TokenType>();
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();

  const fetchTokenDetails = () => {
    getTokenDetails(tokenId).then(({ success, data }) => {
      if (ref.current !== null) {
        setTokenDetails(data);
        setDataReady(success);
      }
    });
  };

  React.useEffect(fetchTokenDetails, [tokenId]); // run the operation only once since the parameter does not change

  return (
    <>
      {dataReady === undefined && <Loader />}
      {dataReady === false && <FailedTokenDetails tokenId={tokenId} />}

      <div ref={ref}>
        {dataReady === true && tokenDetails && (
          <div className="container pt-spacer">
            <div className="row page-header">
              <div className="col-12">
                <h3 className="page-title mb-4" data-testid="title">
                  Token Details
                </h3>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-body p-0">
                    <div className="container-fluid">
                      <DetailItem title="Name">{tokenDetails.tokenName}</DetailItem>
                      <DetailItem title="Identifier">{tokenDetails.tokenIdentifier}</DetailItem>
                      <DetailItem title="Owner">
                        <NetworkLink
                          to={urlBuilder.accountDetails(tokenDetails.ownerAddress)}
                          className="trim-wrapper"
                        >
                          <Trim text={tokenDetails.ownerAddress} />
                        </NetworkLink>
                      </DetailItem>
                      <DetailItem title="Minted">
                        <Denominate
                          value={tokenDetails.mintedValue}
                          showLastNonZeroDecimal={true}
                          showLabel={false}
                        />
                      </DetailItem>
                      <DetailItem title="Burnt">
                        <Denominate
                          value={tokenDetails.burntValue}
                          showLastNonZeroDecimal={true}
                          showLabel={false}
                        />
                      </DetailItem>
                      <DetailItem title="Paused">{tokenDetails.isPaused ? 'Yes' : 'No'}</DetailItem>
                      <DetailItem title="Properties">
                        <div className="d-flex alig-items-center">
                          <CreatePill name={'Can Upgrade'} active={tokenDetails.canUpgrade} />
                          <CreatePill name={'Can Mint'} active={tokenDetails.canMint} />
                          <CreatePill name={'Can Burn'} active={tokenDetails.canBurn} />
                          <CreatePill
                            name={'Can Change Owner'}
                            active={tokenDetails.canChangeOwner}
                          />
                          <CreatePill name={'Can Pause'} active={tokenDetails.canPause} />
                          <CreatePill name={'Can Freeze'} active={tokenDetails.canFreeze} />
                          <CreatePill name={'Can Wipe'} active={tokenDetails.canWipe} />
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

export default TokenDetails;
