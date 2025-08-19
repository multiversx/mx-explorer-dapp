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
  SocialWebsite,
  NftSubTypeBadge,
  CopyButton,
  NftProofBadge
} from 'components';
import {
  formatDate,
  getNftText,
  getProofHash,
  hasNftOverview,
  isProof
} from 'helpers';
import { faClock, faExclamationTriangle } from 'icons/regular';
import { faHexagonCheck } from 'icons/solid';
import { nftSelector } from 'redux/selectors';
import { NftTypeEnum } from 'types';

export const NftDetailsCard = () => {
  const { nftState } = useSelector(nftSelector);
  const {
    identifier,
    hash,
    collection,
    timestamp,
    nonce,
    type,
    subType,
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
    isVerified,
    tags
  } = nftState;
  const isNftProof = isProof(nftState);

  const [showData, setShowData] = useState(!Boolean(scamInfo));

  const showTags =
    !hasNftOverview(nftState) &&
    tags !== undefined &&
    tags.length > 0 &&
    (!scamInfo || showData);
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
  } ${isNftProof ? 'Proof' : getNftText(type)}`;
  const seoTitle =
    !scamInfo && assets
      ? `${name}${
          titleTickerText && titleTickerText !== name
            ? ` (${titleTickerText})`
            : ''
        }`
      : '';

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
        title: seoTitle,
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
        Boolean(description && (!scamInfo || showData))
          ? {
              title: 'Description',
              value: (
                <div className='description line-clamp-2' title={description}>
                  {description}
                </div>
              )
            }
          : {},
        hasExtraDescription && (!scamInfo || showData)
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
          : {},
        assets?.website && (!scamInfo || showData)
          ? {
              title: 'Website',
              value: <SocialWebsite link={assets.website} />
            }
          : {},
        assets?.social &&
        Object.keys(assets.social).length > 0 &&
        (!scamInfo || showData)
          ? {
              title: 'Other Links',
              value: <SocialIcons assets={assets.social} excludeWebsite />
            }
          : {},
        { title: 'Type', value: <NftBadge type={type} /> },
        subType && (subType as string) !== type
          ? {
              title: 'Subtype',
              value: <NftSubTypeBadge subType={subType} />
            }
          : {},
        isNftProof && hash
          ? {
              title: 'Subtype',
              value: <NftProofBadge />
            }
          : {},
        !assets && ticker !== name && (!scamInfo || showData)
          ? { title: 'Name', value: name }
          : {},
        isNftProof && hash
          ? {
              title: 'Proof hash',
              value: (
                <div className='d-flex align-items-center'>
                  <div className='small py-1 px-2 bg-neutral-800 text-break-all rounded'>
                    {getProofHash(hash)}
                  </div>
                  <CopyButton text={getProofHash(hash)} />
                </div>
              )
            }
          : {},
        { title: 'Collection', value: <CollectionBlock nft={nftState} /> },
        { title: 'Identifier', value: identifier },
        decimals !== undefined
          ? {
              title: 'Decimals',
              value: decimals
            }
          : {},
        owner !== undefined
          ? {
              title: 'Owner',
              value: <AccountLink address={owner} fetchAssets={!scamInfo} />
            }
          : {},
        {
          title: 'Creator',
          value: <AccountLink address={creator} fetchAssets={!scamInfo} />
        },
        timestamp !== undefined
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
          : {},
        uris !== undefined && uris[0]
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
          : {},
        showTags
          ? {
              title: 'Tags',
              value: (
                <div className='d-flex flex-wrap gap-2'>
                  {tags.map((tag) => (
                    <div
                      key={tag}
                      className='badge badge-outline badge-outline-grey gap-2 text-wrap text-break-all text-start'
                    >
                      #{tag}
                    </div>
                  ))}
                </div>
              )
            }
          : {},
        scamInfo
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
          : {}
      ]}
      statsCards={[
        royalties !== undefined && royalties !== null
          ? {
              title: 'Royalties',
              value: <>{royalties}%</>
            }
          : {},
        supply !== undefined && type !== NftTypeEnum.NonFungibleESDT
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
          : {},
        { title: 'Nonce', value: nonce }
      ]}
    />
  );
};
