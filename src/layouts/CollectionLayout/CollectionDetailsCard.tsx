import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import {
  AccountLink,
  RolesBadges,
  DetailItem,
  NftBadge,
  TimeAgo,
  SocialIcons,
  SpotlightButton,
  AssetsHelmet
} from 'components';
import { formatDate } from 'helpers';
import { useActiveRoute } from 'hooks';
import { faClock } from 'icons/regular';
import { faHexagonCheck } from 'icons/solid';
import { collectionSelector } from 'redux/selectors';
import { tokensRoutes } from 'routes';
import { NftTypeEnum } from 'types';

export const CollectionDetailsCard = () => {
  const activeRoute = useActiveRoute();
  const { collectionState } = useSelector(collectionSelector);
  const {
    collection,
    assets,
    name,
    ticker,
    type,
    timestamp,
    decimals,
    owner,
    isVerified,
    scamInfo
  } = collectionState;

  const mergedAssets = {
    ...(assets?.website
      ? {
          website: assets.website
        }
      : {}),
    ...(assets?.social ? assets.social : {})
  };

  const title = activeRoute(tokensRoutes.tokensMetaEsdtDetails)
    ? 'Meta-ESDT'
    : 'Collection';

  return collection ? (
    <>
      <AssetsHelmet
        text={`${title} Details`}
        assets={assets}
        ticker={ticker}
        name={name}
      />
      <div className='token-details-card row mb-3'>
        <div className='col-12'>
          <div className='card'>
            <div className='card-header'>
              <div className='card-header-item d-flex align-items-center justify-content-between gap-3 flex-wrap'>
                <h5
                  data-testid='title'
                  className='mb-0 d-flex align-items-center'
                >
                  {title} Details
                </h5>
                {!scamInfo && type !== NftTypeEnum.MetaESDT && (
                  <SpotlightButton path={`/collections/${collection}`} />
                )}
              </div>
            </div>
            <div className='card-body'>
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
                  {isVerified && (
                    <OverlayTrigger
                      placement='top'
                      delay={{ show: 0, hide: 400 }}
                      overlay={(props: any) => (
                        <Tooltip {...props} show={props.show.toString()}>
                          Verified
                        </Tooltip>
                      )}
                    >
                      <FontAwesomeIcon
                        icon={faHexagonCheck}
                        size='sm'
                        className='ms-2 text-yellow-spotlight'
                      />
                    </OverlayTrigger>
                  )}
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
                <AccountLink address={owner} />
              </DetailItem>
              {timestamp !== undefined && (
                <DetailItem title='Created'>
                  <FontAwesomeIcon
                    icon={faClock}
                    className='me-2 text-neutral-400'
                  />
                  <TimeAgo value={timestamp} />
                  &nbsp;
                  <span className='text-neutral-400'>
                    ({formatDate(timestamp, false, true)})
                  </span>
                </DetailItem>
              )}
              {decimals !== undefined && (
                <DetailItem title='Decimals'>{decimals}</DetailItem>
              )}
              <DetailItem title='Properties'>
                <RolesBadges {...collectionState} />
              </DetailItem>
              <DetailItem title='Social'>
                {Object.keys(mergedAssets).length > 0 ? (
                  <div className='d-flex h-100'>
                    <SocialIcons assets={mergedAssets} />
                  </div>
                ) : (
                  <span className='text-neutral-400'>N/A</span>
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
                  <span className='text-neutral-400'>N/A</span>
                )}
              </DetailItem>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : null;
};
