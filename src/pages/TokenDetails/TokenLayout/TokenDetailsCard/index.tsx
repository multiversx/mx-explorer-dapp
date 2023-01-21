import * as React from 'react';
import { Helmet } from 'react-helmet';
import BigNumber from 'bignumber.js';
import { urlBuilder, amountWithoutRounding } from 'helpers';
import { Trim, NetworkLink, SocialIcons, PropertyPill, SmallDetailItem } from 'components';
import { useGlobalState } from 'context';

export const TokenDetailsCard = () => {
  const ref = React.useRef(null);
  const { tokenDetails } = useGlobalState();

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
    circulatingSupply,
    accounts,
    transactions,
    price,
    marketCap,
  } = tokenDetails;

  const title = `${assets ? `${name} ${ticker !== name ? `(${ticker})` : ''}` : ticker} Token`;
  const mergedAssets = {
    ...(assets?.website
      ? {
          website: assets.website,
        }
      : {}),
    ...(assets?.social ? assets.social : {}),
  };

  return identifier !== '' ? (
    <>
      <Helmet>
        <title>{`${title} • MultiversX (previously Elrond) Explorer`}</title>
        {assets && assets.description && <meta name="description" content={assets.description} />}

        <meta name="twitter:title" content={`${title} • MultiversX (previously Elrond) Explorer`} />
        <meta name="twitter:card" content="summary" />
        {assets && assets.description && (
          <meta name="twitter:description" content={assets.description} />
        )}
        {assets && assets.pngUrl && <meta name="twitter:image" content={assets.pngUrl} />}

        <meta property="og:title" content={`${title} • MultiversX (previously Elrond) Explorer`} />
        {assets && assets.description && (
          <meta property="og:description" content={assets.description} />
        )}
        {assets && assets.pngUrl && <meta property="og:image" content={assets.pngUrl} />}
      </Helmet>
      <div ref={ref}>
        <div className="token-details-card row mb-spacer">
          <div className="col-12 col-lg-6 mb-spacer mb-lg-0">
            <div className="card">
              <div className="card-header">
                <div className="card-header-item d-flex align-items-center">
                  <h1 className="h6 d-flex align-items-center" data-testid="title">
                    {assets && assets.svgUrl && (
                      <img src={assets.svgUrl} alt={ticker} className="side-icon mr-1" />
                    )}
                    <span>{title}</span>
                  </h1>
                </div>
              </div>
              <div className="card-body p-0">
                <dl className="container-fluid">
                  <SmallDetailItem title="Token">{identifier}</SmallDetailItem>

                  {price && marketCap ? (
                    <>
                      <SmallDetailItem title="Price">
                        ${amountWithoutRounding(price.toString(), 4)}
                      </SmallDetailItem>

                      <SmallDetailItem title="Market Cap">
                        ${new BigNumber(marketCap).toFormat(0)}
                      </SmallDetailItem>
                    </>
                  ) : (
                    <SmallDetailItem title="Supply">
                      {new BigNumber(supply).toFormat()}
                    </SmallDetailItem>
                  )}

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
                </dl>
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
                <dl className="container-fluid">
                  <SmallDetailItem title="Owner">
                    <div className="d-flex">
                      <NetworkLink to={urlBuilder.accountDetails(owner)} className="trim-wrapper">
                        <Trim text={owner} />
                      </NetworkLink>
                    </div>
                  </SmallDetailItem>

                  {supply && (
                    <SmallDetailItem title="Supply">
                      {new BigNumber(supply).toFormat()}
                    </SmallDetailItem>
                  )}

                  {circulatingSupply && (
                    <SmallDetailItem title="Circulating">
                      {new BigNumber(circulatingSupply).toFormat()}
                    </SmallDetailItem>
                  )}

                  <SmallDetailItem title="Decimals">{decimals}</SmallDetailItem>

                  <SmallDetailItem title="Social">
                    {Object.keys(mergedAssets).length > 0 ? (
                      <div className="d-flex h-100">
                        <SocialIcons assets={mergedAssets} />
                      </div>
                    ) : (
                      <span className="text-secondary">N/A</span>
                    )}
                  </SmallDetailItem>

                  <SmallDetailItem title="Description">
                    {assets && assets.description ? (
                      <h2 className="token-description h6 mb-0" title={assets.description}>
                        {assets.description}
                      </h2>
                    ) : (
                      <span className="text-secondary">N/A</span>
                    )}
                  </SmallDetailItem>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : null;
};


