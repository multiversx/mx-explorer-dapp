import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';

import {
  NftBadge,
  CollectionBlock,
  Denominate,
  TimeAgo,
  AccountLink,
  NftPreview,
  SpotlightButton,
  HeroDetailsCard,
  Overlay,
  SocialIcons
} from 'components';
import { formatDate, getNftText } from 'helpers';
import { faClock, faExclamationTriangle } from 'icons/regular';
import { faHexagonCheck } from 'icons/solid';
import { nftSelector } from 'redux/selectors';
import { NftTypeEnum } from 'types';

export const NftDetailsCard = () => {
  const { nftState } = useSelector(nftSelector);
  const {
    identifier,
    collection,
    timestamp,
    nonce,
    type,
    name,
    creator,
    royalties,
    ticker,
    uris,
    decimals,
    owner,
    supply,
    scamInfo,
    media,
    assets,
    metadata,
    isVerified
  } = nftState;
  const [showData, setShowData] = useState(true);

  const show = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowData((existing) => !existing);
  };

  const mergedAssets = {
    ...(assets?.website
      ? {
          website: assets.website
        }
      : {}),
    ...(assets?.social ? assets.social : {})
  };

  const showPreviewDetails = !scamInfo && assets;
  const titleTickerText =
    ticker !== undefined &&
    ticker !== collection &&
    type === NftTypeEnum.MetaESDT
      ? ticker
      : '';
  const title = `${
    !scamInfo
      ? `${name} ${
          titleTickerText && titleTickerText !== name
            ? `(${titleTickerText})`
            : ''
        }`
      : titleTickerText
  } ${getNftText(type)}`;
  const nftPreview = media?.[0]?.thumbnailUrl ?? media?.[0]?.url;
  const description = metadata?.description ?? assets?.description;

  return (
    <HeroDetailsCard
      title={
        scamInfo ? (showData ? title : `[Hidden - ${scamInfo.info}]`) : title
      }
      description={description}
      icon={
        showPreviewDetails ? nftPreview || assets?.svgUrl || assets?.pngUrl : ''
      }
      seoDetails={
        showPreviewDetails
          ? { text: '', description, icon: nftPreview }
          : undefined
      }
      className='nft-details'
      titleContent={
        <>
          {!scamInfo && type !== NftTypeEnum.MetaESDT && (
            <SpotlightButton path={`/nfts/${identifier}`} />
          )}
        </>
      }
      descriptionContent={
        <>
          {scamInfo && (
            <div className='d-flex align-items-center flex-wrap gap-3'>
              <span className='text-warning d-flex align-items-center ms-2'>
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  size='sm'
                  className='text-warning me-2'
                />
                {scamInfo.info}
              </span>
              <a
                href='/#'
                onClick={show}
                className='small-font text-neutral-400'
              >
                {!showData ? 'Show' : 'Hide'} original content
              </a>
            </div>
          )}
          {metadata?.description &&
            assets?.description &&
            metadata?.description !== assets?.description && (
              <p className='hero-details-card-description text-neutral-400 mb-1'>
                {assets.description}
              </p>
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
        { title: 'Collection', value: <CollectionBlock nft={nftState} /> },
        { title: 'Identifier', value: identifier },

        {
          ...(decimals !== undefined
            ? {
                title: 'Decimals',
                value: decimals
              }
            : {})
        },
        {
          ...(owner !== undefined
            ? {
                title: 'Owner',
                value: <AccountLink address={owner} fetchAssets />
              }
            : {})
        },
        { title: 'Creator', value: <AccountLink address={creator} /> },
        {
          ...(timestamp !== undefined
            ? {
                title: 'Minted',
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
        {
          ...(uris !== undefined && uris[0]
            ? {
                title: 'Assets',
                value: (
                  <>
                    {scamInfo ? (
                      showData ? (
                        <NftPreview token={nftState} />
                      ) : (
                        `[Hidden - ${scamInfo.info}]`
                      )
                    ) : (
                      <NftPreview token={nftState} />
                    )}
                  </>
                )
              }
            : {})
        }
      ]}
      statsCards={[
        {
          ...(royalties !== undefined && royalties !== null
            ? {
                title: 'Royalties',
                value: <>{royalties}%</>
              }
            : {})
        },
        {
          ...(supply !== undefined && type !== NftTypeEnum.NonFungibleESDT
            ? {
                title: 'Supply',
                value: (
                  <>
                    {decimals ? (
                      <Denominate
                        value={supply}
                        showLabel={false}
                        denomination={decimals}
                      />
                    ) : (
                      Number(supply).toLocaleString('en')
                    )}
                  </>
                )
              }
            : {})
        },
        { title: 'Nonce', value: nonce }
      ]}
    />
  );
};
