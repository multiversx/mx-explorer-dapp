import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';

import {
  NftBadge,
  CollectionBlock,
  FormatAmount,
  TimeAgo,
  AccountLink,
  NftPreview,
  SpotlightButton,
  HeroDetailsCard,
  Overlay,
  SocialIcons,
  SocialWebsite
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
  const [showData, setShowData] = useState(!Boolean(scamInfo));

  const showPreviewDetails = (!scamInfo || showData) && assets;
  const titleTickerText =
    ticker !== undefined &&
    ticker !== collection &&
    type === NftTypeEnum.MetaESDT
      ? ticker
      : '';
  const title = `${
    !scamInfo || showData
      ? `${name} ${
          titleTickerText && titleTickerText !== name
            ? `(${titleTickerText})`
            : ''
        }`
      : titleTickerText
  } ${getNftText(type)}`;
  const nftPreview = media?.[0]?.thumbnailUrl ?? media?.[0]?.url;
  const description = metadata?.description ?? assets?.description;
  const hasExtraDescription =
    metadata?.description &&
    assets?.description &&
    metadata.description !== assets.description &&
    !assets.description.includes(metadata.description);

  const show = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowData((existing) => !existing);
  };

  return (
    <HeroDetailsCard
      title={!scamInfo || showData ? title : `[Hidden - ${scamInfo.info}]`}
      icon={
        showPreviewDetails ? nftPreview || assets?.svgUrl || assets?.pngUrl : ''
      }
      seoDetails={{
        text: '',
        description,
        icon: nftPreview,
        completeDetails: Boolean(!scamInfo && showPreviewDetails)
      }}
      className='nft-details'
      titleContent={
        !scamInfo && type !== NftTypeEnum.MetaESDT ? (
          <SpotlightButton path={`/nfts/${identifier}`} />
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
          ...(description
            ? {
                title: 'Description',
                value: (
                  <div className='description line-clamp-2' title={description}>
                    {description}
                  </div>
                )
              }
            : {})
        },
        {
          ...(hasExtraDescription
            ? {
                title: 'Collection',
                value: (
                  <div
                    className='description line-clamp-2'
                    title={assets.description}
                  >
                    {assets.description}
                  </div>
                )
              }
            : {})
        },
        {
          ...(assets?.website
            ? {
                title: 'Website',
                value: <SocialWebsite link={assets.website} />
              }
            : {})
        },
        {
          ...(assets?.social && Object.keys(assets.social).length > 0
            ? {
                title: 'Other Links',
                value: <SocialIcons assets={assets.social} excludeWebsite />
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
        },
        {
          ...(scamInfo
            ? {
                title: '',
                value: (
                  <a
                    href='/#'
                    onClick={show}
                    className='small-font text-neutral-400'
                  >
                    {!showData ? 'Show' : 'Hide'} original content
                  </a>
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
                      <FormatAmount
                        value={supply}
                        showLabel={false}
                        showSymbol={false}
                        decimals={decimals}
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
