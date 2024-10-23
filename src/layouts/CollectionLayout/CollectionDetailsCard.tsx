import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

import {
  AccountLink,
  RolesBadges,
  NftBadge,
  TimeAgo,
  SocialIcons,
  SocialWebsite,
  SpotlightButton,
  HeroDetailsCard,
  Overlay,
  NftSubTypeBadge
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
    subType,
    timestamp,
    decimals,
    owner,
    isVerified,
    nftCount,
    holderCount,
    scamInfo
  } = collectionState;

  const titleTypeText =
    activeRoute(tokensRoutes.tokensMetaEsdtDetails) ||
    activeRoute(tokensRoutes.tokensMetaEsdtDetailsRoles)
      ? 'Meta-ESDT'
      : 'Collection';

  const title = `${
    assets && !scamInfo
      ? `${name}${ticker !== name ? ` (${ticker})` : ''}`
      : ticker
  } ${titleTypeText}`;
  const seoTitle =
    assets && !scamInfo
      ? `${name}${ticker !== name ? ` (${ticker})` : ''}`
      : '';

  return (
    <HeroDetailsCard
      title={title}
      icon={assets?.pngUrl || assets?.svgUrl}
      seoDetails={{
        title: seoTitle,
        description: assets?.description,
        completeDetails: Boolean(!scamInfo && assets)
      }}
      className='collection-details'
      titleContent={
        !scamInfo && type !== NftTypeEnum.MetaESDT ? (
          <SpotlightButton path={`/collections/${collection}`} />
        ) : null
      }
      descriptionContent={
        scamInfo ? (
          <div className='d-flex align-items-center flex-wrap gap-2 my-3 text-warning'>
            <FontAwesomeIcon icon={faExclamationTriangle} size='sm' />
            {scamInfo.info}
          </div>
        ) : null
      }
      isVerified={isVerified}
      verifiedComponent={
        <Overlay title='Verified' className='d-inline-block'>
          <FontAwesomeIcon
            icon={faHexagonCheck}
            size='sm'
            className='text-yellow-spotlight'
          />
        </Overlay>
      }
      detailItems={[
        assets?.description && !scamInfo
          ? {
              title: 'Description',
              value: (
                <div
                  className='description line-clamp-2'
                  title={assets.description}
                >
                  {assets.description}
                </div>
              )
            }
          : {},
        assets?.website && !scamInfo
          ? {
              title: 'Website',
              value: <SocialWebsite link={assets.website} />
            }
          : {},
        assets?.social && Object.keys(assets.social).length > 0 && !scamInfo
          ? {
              title: 'Other Links',
              value: <SocialIcons assets={assets.social} excludeWebsite />
            }
          : {},
        !scamInfo ? { title: 'Type', value: <NftBadge type={type} /> } : {},
        !scamInfo && subType && (subType as string) !== type
          ? { title: 'Subtype', value: <NftSubTypeBadge subType={subType} /> }
          : {},
        !assets && ticker !== name && !scamInfo
          ? { title: 'Name', value: name }
          : {},
        { title: 'Collection', value: collection },
        decimals !== undefined
          ? {
              title: 'Decimals',
              value: decimals
            }
          : {},
        timestamp !== undefined
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
          : {},
        { title: 'Owner', value: <AccountLink address={owner} fetchAssets /> },
        { title: 'Properties', value: <RolesBadges {...collectionState} /> }
      ]}
      statsCards={[
        holderCount !== undefined
          ? {
              title: 'Holders',
              value: new BigNumber(holderCount).toFormat()
            }
          : {},
        nftCount !== undefined
          ? {
              title: 'Items',
              value: new BigNumber(nftCount).toFormat()
            }
          : {}
      ]}
    />
  );
};
