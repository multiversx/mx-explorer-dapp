import * as React from 'react';
import { Helmet } from 'react-helmet';
import BigNumber from 'bignumber.js';
import { urlBuilder, useIsMainnet } from 'helpers';
import { Trim, NetworkLink, SocialIcons, PropertyPill } from 'sharedComponents';
import { useGlobalState } from 'context';

const SmallDetailItem = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string | React.ReactNode;
}) => (
  <div className="row py-3 border-bottom detail-item">
    <div className="col-lg-3 text-secondary pl-lg-spacer pr-lg-0">{title}</div>
    <div className="col-lg-9 pr-lg-spacer pl-lg-0">{children}</div>
  </div>
);

const TokenDetailsCard = () => {
  const ref = React.useRef(null);
  const { tokenDetails } = useGlobalState();
  const isMainnet = useIsMainnet();

  const {
    identifier,
    ticker,
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
    accounts,
    transactions,
  } = tokenDetails;

  const title = `${name} ${ticker !== name ? `(${ticker})` : ''} Token • Elrond Explorer`;

  return identifier !== '' ? (
    <>
      {!isMainnet && (
        <Helmet>
          <title>{title}</title>
          {assets && assets.description && <meta name="description" content={assets.description} />}

          <meta name="twitter:title" content={title} />
          {assets && assets.description && (
            <meta name="twitter:description" content={assets.description} />
          )}
          {assets && assets.pngUrl && <meta name="twitter:image" content={assets.pngUrl} />}

          <meta property="og:title" content={title} />
          {assets && assets.description && (
            <meta property="og:description" content={assets.description} />
          )}
          {assets && assets.pngUrl && <meta property="og:image" content={assets.pngUrl} />}
        </Helmet>
      )}
      <div ref={ref}>
        <div className="token-details-card row mb-spacer">
          <div className="col-12 col-lg-6 mb-spacer mb-lg-0">
            <div className="card">
              <div className="card-header">
                <div className="card-header-item d-flex align-items-center">
                  <h6 className="d-flex align-items-center" data-testid="title">
                    {assets ? (
                      <>
                        {assets.svgUrl && (
                          <img src={assets.svgUrl} alt={ticker} className="token-icon mr-1" />
                        )}
                        <div>{ticker ? ticker : name}</div>
                      </>
                    ) : (
                      <div>{name}</div>
                    )}
                  </h6>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="container-fluid">
                  <SmallDetailItem title="Token">{identifier}</SmallDetailItem>

                  <SmallDetailItem title="Supply">
                    {new BigNumber(supply).toFormat()}
                  </SmallDetailItem>

                  <SmallDetailItem title="Holders">
                    {new BigNumber(accounts).toFormat()}
                  </SmallDetailItem>

                  <SmallDetailItem title="Transactions">
                    {new BigNumber(transactions).toFormat()}
                  </SmallDetailItem>

                  <SmallDetailItem title="Properties">
                    <div className="d-flex alig-items-center flex-wrap">
                      <PropertyPill name={'Can Upgrade'} active={canUpgrade} />
                      <PropertyPill name={'Can Mint'} active={canMint} />
                      <PropertyPill name={'Can Burn'} active={canBurn} />
                      <PropertyPill name={'Can Change Owner'} active={canChangeOwner} />
                      <PropertyPill name={'Can Pause'} active={canPause} />
                      <PropertyPill name={'Can Freeze'} active={canFreeze} />
                      <PropertyPill name={'Can Wipe'} active={canWipe} />
                      <PropertyPill name={'Not Paused'} active={!isPaused} />
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
                  <SmallDetailItem title="Social">
                    {assets && assets.social ? (
                      <div className="d-flex h-100">
                        <SocialIcons assets={assets.social} />
                      </div>
                    ) : (
                      <span className="text-secondary">N/A</span>
                    )}
                  </SmallDetailItem>
                  <SmallDetailItem title="Description">
                    {assets && assets.description ? (
                      <div className="token-description" title={assets.description}>
                        {assets.description}
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
    </>
  ) : null;
};

export default TokenDetailsCard;
