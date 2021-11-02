import * as React from 'react';
import BigNumber from 'bignumber.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-light-svg-icons/faTimes';
import { faCheck } from '@fortawesome/pro-light-svg-icons/faCheck';
import { faExternalLink } from '@fortawesome/pro-light-svg-icons/faExternalLink';
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
    <div className="col-lg-3 text-secondary pl-lg-spacer">{title}</div>
    <div className="col pr-lg-spacer">{children}</div>
  </div>
);

const TokenDetailsCard = () => {
  const social = {
    email: 'web-token@elrond.com',
    blog: 'https://www.elrond.com/web-token-blog',
    twitter: 'https://twitter.com/web-token-twitter',
    whitepaper: 'https://www.elrond.com/web-token-whitepaper.pdf',
    coinmarketcap: 'https://coinmarketcap.com/currencies/web-token',
    coingecko: 'https://www.coingecko.com/en/coins/web-token',
  };
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

                <SmallDetailItem title="Minted">
                  <Denominate
                    value={minted}
                    showLastNonZeroDecimal={true}
                    showLabel={false}
                    denomination={decimals}
                  />
                </SmallDetailItem>
                <SmallDetailItem title="Burnt">
                  <Denominate value={burnt} showLastNonZeroDecimal={true} showLabel={false} />
                </SmallDetailItem>
                <SmallDetailItem title="Supply">
                  <Denominate
                    value={new BigNumber(minted).minus(new BigNumber(burnt)).toString(10)}
                    showLastNonZeroDecimal={true}
                    showLabel={false}
                    denomination={decimals}
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
                <SmallDetailItem title="Paused">{isPaused ? 'Yes' : 'No'}</SmallDetailItem>
                <SmallDetailItem title="Website">
                  {assets && assets.website ? (
                    <a href={assets.website} target={`_blank`} rel={`noreferrer nofollow`}>
                      {assets.website.replace(/^https?:\/\//i, '')}
                    </a>
                  ) : (
                    <>N/A</>
                  )}
                </SmallDetailItem>
                <SmallDetailItem title="Social">
                  {social ? (
                    <div className="d-flex h-100">
                      <SocialIcons assets={social} />
                    </div>
                  ) : (
                    <>N/A</>
                  )}
                </SmallDetailItem>
                <SmallDetailItem title="Description">
                  {assets && assets.description ? assets.description : <>N/A</>}
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
