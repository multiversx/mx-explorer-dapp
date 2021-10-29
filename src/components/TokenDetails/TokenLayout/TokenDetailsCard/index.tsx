import * as React from 'react';
import BigNumber from 'bignumber.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-light-svg-icons/faTimes';
import { faCheck } from '@fortawesome/pro-light-svg-icons/faCheck';
import { urlBuilder } from 'helpers';
import { DetailItem, Trim, Denominate, NetworkLink } from 'sharedComponents';
import { useGlobalState } from 'context';

const CreatePill = ({ name, active }: { name: string; active: boolean }) => {
  return (
    <span className={`direction-badge m-1 ${active ? 'in' : 'out'}`}>
      <FontAwesomeIcon className="mr-1" icon={active ? faCheck : faTimes} /> {name}
    </span>
  );
};

const TokenDetailsCard = () => {
  const ref = React.useRef(null);
  const { tokenDetails } = useGlobalState();

  const {
    identifier,
    name,
    decimals,
    owner,
    minted,
    burnt,
    canBurn,
    canChangeOwner,
    canFreeze,
    canMint,
    canPause,
    canUpgrade,
    canWipe,
    isPaused,
    assets,
  } = tokenDetails;

  return identifier !== '' ? (
    <div ref={ref}>
      <div className="card mb-spacer">
        <div className="card-header">
          <div className="card-header-item d-flex align-items-center">
            <h6 data-testid="title">Token Details</h6>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="container-fluid">
            <DetailItem title="Name">
              <div className="d-flex align-items-center">
                {assets && assets.svgUrl && (
                  <img src={assets.svgUrl} alt={name} className="token-icon mr-1" />
                )}
                <div>{name}</div>
              </div>
            </DetailItem>
            <DetailItem title="Token">{identifier}</DetailItem>
            <DetailItem title="Owner">
              <div className="d-flex">
                <NetworkLink to={urlBuilder.accountDetails(owner)} className="trim-wrapper">
                  <Trim text={owner} />
                </NetworkLink>
              </div>
            </DetailItem>
            <DetailItem title="Minted">
              <Denominate
                value={minted}
                showLastNonZeroDecimal={true}
                showLabel={false}
                denomination={decimals}
              />
            </DetailItem>
            <DetailItem title="Burnt">
              <Denominate value={burnt} showLastNonZeroDecimal={true} showLabel={false} />
            </DetailItem>
            <DetailItem title="Supply">
              <Denominate
                value={new BigNumber(minted).minus(new BigNumber(burnt)).toString(10)}
                showLastNonZeroDecimal={true}
                showLabel={false}
                denomination={decimals}
              />
            </DetailItem>
            <DetailItem title="Decimals">{decimals}</DetailItem>
            <DetailItem title="Paused">{isPaused ? 'Yes' : 'No'}</DetailItem>
            {assets && (
              <>
                {assets.website && (
                  <DetailItem title="Website">
                    <a href={assets.website} target={`_blank`} rel={`noreferrer nofollow`}>
                      {assets.website.replace(/^https?:\/\//i, '')}
                    </a>
                  </DetailItem>
                )}
                {assets.description && (
                  <DetailItem title="Description">{assets.description}</DetailItem>
                )}
              </>
            )}

            <DetailItem title="Properties">
              <div className="d-flex alig-items-center flex-wrap">
                <CreatePill name={'Can Upgrade'} active={canUpgrade} />
                <CreatePill name={'Can Mint'} active={canMint} />
                <CreatePill name={'Can Burn'} active={canBurn} />
                <CreatePill name={'Can Change Owner'} active={canChangeOwner} />
                <CreatePill name={'Can Pause'} active={canPause} />
                <CreatePill name={'Can Freeze'} active={canFreeze} />
                <CreatePill name={'Can Wipe'} active={canWipe} />
              </div>
            </DetailItem>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default TokenDetailsCard;
