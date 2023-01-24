import * as React from 'react';

import { faClock } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useSelector } from 'react-redux';
import {
  Trim,
  NetworkLink,
  PropertyPill,
  DetailItem,
  NftBadge,
  TimeAgo,
  SocialIcons
} from 'components';
import { urlBuilder, dateFormatted } from 'helpers';
import { collectionSelector } from 'redux/selectors';

export const CollectionDetailsCard = () => {
  const ref = React.useRef(null);

  const {
    collection,
    assets,
    name,
    ticker,
    type,
    timestamp,
    decimals,
    owner,
    canPause,
    canFreeze,
    canWipe,
    canTransferNftCreateRole,
    canChangeOwner,
    canUpgrade,
    canAddSpecialRoles,
    canTransfer
  } = useSelector(collectionSelector);

  const mergedAssets = {
    ...(assets?.website
      ? {
          website: assets.website
        }
      : {}),
    ...(assets?.social ? assets.social : {})
  };

  return collection ? (
    <div ref={ref}>
      <div className='token-details-card row mb-spacer'>
        <div className='col-12'>
          <div className='card'>
            <div className='card-header'>
              <div className='card-header-item d-flex align-items-center'>
                <h6 data-testid='title'>Collection Details</h6>
              </div>
            </div>
            <div className='card-body'>
              <div className='container-fluid'>
                <DetailItem title='Name'>
                  <div className='d-flex align-items-center'>
                    {assets?.svgUrl && (
                      <img
                        src={assets.svgUrl}
                        alt={name}
                        className='side-icon me-1'
                      />
                    )}
                    <div>{name}</div>
                  </div>
                </DetailItem>
                <DetailItem title='Collection'>{collection}</DetailItem>
                {ticker !== undefined && ticker !== collection && (
                  <DetailItem title='Ticker'>{ticker}</DetailItem>
                )}
                <DetailItem title='Type'>
                  <NftBadge type={type} />
                </DetailItem>
                <DetailItem title='Owner'>
                  <div className='d-flex'>
                    <NetworkLink
                      to={urlBuilder.accountDetails(owner)}
                      className='trim-wrapper'
                    >
                      <Trim text={owner} />
                    </NetworkLink>
                  </div>
                </DetailItem>
                {timestamp !== undefined && (
                  <DetailItem title='Created'>
                    <FontAwesomeIcon
                      icon={faClock}
                      className='me-2 text-secondary'
                    />
                    <TimeAgo value={timestamp} />
                    &nbsp;
                    <span className='text-secondary'>
                      ({dateFormatted(timestamp, false, true)})
                    </span>
                  </DetailItem>
                )}
                {decimals !== undefined && (
                  <DetailItem title='Decimals'>{decimals}</DetailItem>
                )}
                <DetailItem title='Properties'>
                  <div className='d-flex alig-items-center flex-wrap'>
                    <PropertyPill name={'Can Pause'} active={canPause} />
                    <PropertyPill name={'Can Freeze'} active={canFreeze} />
                    <PropertyPill name={'Can Wipe'} active={canWipe} />
                    <PropertyPill
                      name={'Can Transfer NFT Create Role'}
                      active={canTransferNftCreateRole}
                    />
                    <PropertyPill
                      name={'Can Change Owner'}
                      active={canChangeOwner}
                    />
                    <PropertyPill name={'Can Upgrade'} active={canUpgrade} />
                    <PropertyPill
                      name={'Can Add Special Roles'}
                      active={canAddSpecialRoles}
                    />
                    <PropertyPill
                      name={'Can Transfer'}
                      active={Boolean(canTransfer)}
                    />
                  </div>
                </DetailItem>
                <DetailItem title='Social'>
                  {Object.keys(mergedAssets).length > 0 ? (
                    <div className='d-flex h-100'>
                      <SocialIcons assets={mergedAssets} />
                    </div>
                  ) : (
                    <span className='text-secondary'>N/A</span>
                  )}
                </DetailItem>
                <DetailItem title='Description'>
                  {assets?.description ? (
                    <h2
                      className='token-description h6 mb-0'
                      title={assets.description}
                    >
                      {assets.description}
                    </h2>
                  ) : (
                    <span className='text-secondary'>N/A</span>
                  )}
                </DetailItem>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};
