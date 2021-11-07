import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-light-svg-icons/faTimes';
import { faCheck } from '@fortawesome/pro-light-svg-icons/faCheck';
import { urlBuilder } from 'helpers';
import { Trim, Denominate, NetworkLink, SocialIcons } from 'sharedComponents';
import { useGlobalState } from 'context';

const CreatePill = ({ name, active }: { name: string; active: boolean }) => {
  return (
    <span className={`direction-badge m-1 ${active ? 'in' : 'out'}`}>
      <FontAwesomeIcon className="mr-1" icon={active ? faCheck : faTimes} /> {name}
    </span>
  );
};

const SmallDetailItem = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string | React.ReactNode;
}) => (
  <div className="row py-3 border-bottom detail-item">
    <div className="col-lg-3 text-secondary pl-lg-spacer pr-lg-0">{title}</div>
    <div className="col pr-lg-spacer pl-lg-0">{children}</div>
  </div>
);

const TokenDetailsCard = () => {
  const ref = React.useRef(null);
  const { tokenDetails } = useGlobalState();

  const {
    identifier,
    name,
    decimals,
    owner,
    canBurn,
    canChangeOwner,
    canFreeze,
    canMint,
    canPause,
    canUpgrade,
    canWipe,
    isPaused,
    assets,
    supply,
  } = tokenDetails;

  return identifier !== '' ? (
    <div ref={ref}>
      <div className="row mb-spacer">
        <div className="col-12 col-lg-6 mb-spacer mb-lg-0">
          <div className="card">
            <div className="card-header">
              <div className="card-header-item d-flex align-items-center">
                <h6 data-testid="title">Overview</h6>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="container-fluid">
                <SmallDetailItem title="Name">
                  <div className="d-flex align-items-center">
                    {assets && assets.svgUrl && (
                      <img src={assets.svgUrl} alt={name} className="token-icon mr-1" />
                    )}
                    <div>{name}</div>
                  </div>
                </SmallDetailItem>
                <SmallDetailItem title="Token">{identifier}</SmallDetailItem>

                <SmallDetailItem title="Supply">
                  <Denominate
                    value={supply}
                    denomination={decimals}
                    showLastNonZeroDecimal={true}
                    showLabel={false}
                  />
                </SmallDetailItem>

                <SmallDetailItem title="Properties">
                  <div className="d-flex alig-items-center flex-wrap">
                    <CreatePill name={'Can Upgrade'} active={canUpgrade} />
                    <CreatePill name={'Can Mint'} active={canMint} />
                    <CreatePill name={'Can Burn'} active={canBurn} />
                    <CreatePill name={'Can Change Owner'} active={canChangeOwner} />
                    <CreatePill name={'Can Pause'} active={canPause} />
                    <CreatePill name={'Can Freeze'} active={canFreeze} />
                    <CreatePill name={'Can Wipe'} active={canWipe} />
                    <CreatePill name={'Not Paused'} active={!isPaused} />
                  </div>
                </SmallDetailItem>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="card">
            <div className="card-header">
              <div className="card-header-item d-flex align-items-center">
                <h6 data-testid="title">Summary</h6>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="container-fluid">
                <SmallDetailItem title="Owner">
                  <div className="d-flex">
                    <NetworkLink to={urlBuilder.accountDetails(owner)} className="trim-wrapper">
                      <Trim text={owner} />
                    </NetworkLink>
                  </div>
                </SmallDetailItem>
                <SmallDetailItem title="Decimals">{decimals}</SmallDetailItem>
                <SmallDetailItem title="Website">
                  {assets && assets.website ? (
                    <a href={assets.website} target={`_blank`} rel={`noreferrer nofollow`}>
                      {assets.website.replace(/^https?:\/\//i, '')}
                    </a>
                  ) : (
                    <span className="text-secondary">N/A</span>
                  )}
                </SmallDetailItem>
                <SmallDetailItem title="Description">
                  <div className="text-truncate">
                    {assets && assets.description ? (
                      assets.description
                    ) : (
                      <span className="text-secondary">N/A</span>
                    )}
                  </div>
                </SmallDetailItem>
                <SmallDetailItem title="Social">
                  {assets && assets.social ? (
                    <div className="d-flex h-100">
                      <SocialIcons assets={assets.social} />
                    </div>
                  ) : (
                    <span className="text-secondary">N/A</span>
                  )}
                </SmallDetailItem>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default TokenDetailsCard;
