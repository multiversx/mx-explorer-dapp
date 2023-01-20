import * as React from 'react';

import { urlBuilder, dateFormatted } from 'helpers';
import {
  Trim,
  NetworkLink,
  PropertyPill,
  DetailItem,
  NftBadge,
  TimeAgo,
  SocialIcons,
} from 'components';
import { useGlobalState } from 'context';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/pro-regular-svg-icons';

const CollectionDetailsCard = () => {
  const ref = React.useRef(null);
  const { collectionDetails } = useGlobalState();

  const mergedAssets = {
    ...(collectionDetails?.assets?.website
      ? {
          website: collectionDetails.assets.website,
        }
      : {}),
    ...(collectionDetails?.assets?.social ? collectionDetails.assets.social : {}),
  };

  return collectionDetails ? (
    <>
      <div ref={ref}>
        <div className="token-details-card row mb-spacer">
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
                          className="side-icon mr-1"
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
                    <div className="d-flex alig-items-center flex-wrap">
                      <PropertyPill name={'Can Pause'} active={collectionDetails.canPause} />
                      <PropertyPill name={'Can Freeze'} active={collectionDetails.canFreeze} />
                      <PropertyPill name={'Can Wipe'} active={collectionDetails.canWipe} />
                      <PropertyPill
                        name={'Can Transfer NFT Create Role'}
                        active={collectionDetails.canTransferNftCreateRole}
                      />
                      <PropertyPill
                        name={'Can Change Owner'}
                        active={collectionDetails.canChangeOwner}
                      />
                      <PropertyPill name={'Can Upgrade'} active={collectionDetails.canUpgrade} />
                      <PropertyPill
                        name={'Can Add Special Roles'}
                        active={collectionDetails.canAddSpecialRoles}
                      />
                      <PropertyPill
                        name={'Can Transfer'}
                        active={Boolean(collectionDetails?.canTransfer)}
                      />
                    </div>
                  </DetailItem>
                  <DetailItem title="Social">
                    {Object.keys(mergedAssets).length > 0 ? (
                      <div className="d-flex h-100">
                        <SocialIcons assets={mergedAssets} />
                      </div>
                    ) : (
                      <span className="text-secondary">N/A</span>
                    )}
                  </DetailItem>
                  <DetailItem title="Description">
                    {collectionDetails?.assets?.description ? (
                      <h2
                        className="token-description h6 mb-0"
                        title={collectionDetails.assets.description}
                      >
                        {collectionDetails.assets.description}
                      </h2>
                    ) : (
                      <span className="text-secondary">N/A</span>
                    )}
                  </DetailItem>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : null;
};

export default CollectionDetailsCard;
