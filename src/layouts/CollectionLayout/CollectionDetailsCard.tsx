import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';

import {
  AccountLink,
  RolesBadges,
  NftBadge,
  TimeAgo,
  SocialIcons,
  SpotlightButton,
  HeroDetailsCard,
  Overlay
} from 'components';
import { formatDate } from 'helpers';
import { useActiveRoute } from 'hooks';
import { faExclamationTriangle, faClock } from 'icons/regular';
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

  const titleTypeText = activeRoute(tokensRoutes.tokensMetaEsdtDetails)
    ? 'Meta-ESDT'
    : 'Collection';

  const title = `${
    assets && !scamInfo
      ? `${name} ${ticker !== name ? `(${ticker})` : ''}`
      : ticker
  } ${titleTypeText}`;

  return (
    <HeroDetailsCard
      title={title}
      description={assets?.description}
      icon={assets?.svgUrl || assets?.pngUrl}
      seoDetails={{ text: '' }}
      className='collection-details'
      titleContent={
        <>
          {!scamInfo && type !== NftTypeEnum.MetaESDT && (
            <SpotlightButton path={`/collections/${collection}`} />
          )}
        </>
      }
      descriptionContent={
        <>
          {scamInfo && (
            <span className='text-warning d-flex align-items-center ms-2'>
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                size='sm'
                className='text-warning me-2'
              />
              {scamInfo.info}
            </span>
          )}
        </>
      }
      isVerified={isVerified}
      verifiedComponent={
        <Overlay title='Verified' className='verified-badge-wrapper'>
          <FontAwesomeIcon
            icon={faHexagonCheck}
            size='sm'
            className='text-yellow-spotlight'
          />
        </Overlay>
      }
      detailItems={[
        {
          ...(Object.keys(mergedAssets).length > 0
            ? {
                title: 'Social',
                value: <SocialIcons assets={mergedAssets} />
              }
            : {})
        },
        { title: 'Type', value: <NftBadge type={type} /> },
        { title: 'Collection', value: collection },
        {
          ...(decimals !== undefined
            ? {
                title: 'Decimals',
                value: decimals
              }
            : {})
        },
        {
          ...(timestamp !== undefined
            ? {
                title: 'Created',
                value: (
                  <>
                    <FontAwesomeIcon
                      icon={faClock}
                      className='me-2 text-neutral-400'
                    />
                    <TimeAgo value={timestamp} showAgo />
                    &nbsp;
                    <span className='text-neutral-400'>
                      ({formatDate(timestamp, false, true)})
                    </span>
                  </>
                )
              }
            : {})
        },
        { title: 'Owner', value: <AccountLink address={owner} /> },
        { title: 'Properties', value: <RolesBadges {...collectionState} /> }
      ]}
    />
  );
};
