import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';

import {
  DetailItem,
  NftBadge,
  CollectionBlock,
  Denominate,
  TimeAgo,
  CardItem,
  AccountLink,
  SocialDetailItem,
  DescriptionDetailItem,
  NftPreview,
  SpotlightButton,
  AssetsHelmet
} from 'components';
import { formatDate, getNftText } from 'helpers';
import { faClock, faTrophy } from 'icons/regular';
import { nftSelector } from 'redux/selectors';
import { NftTypeEnum } from 'types';

export const NftDetailsCard = () => {
  const ref = useRef(null);

  const { nftState } = useSelector(nftSelector);
  const [showData, setShowData] = useState(false);

  const show = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowData((existing) => !existing);
  };

  return nftState ? (
    <>
      <AssetsHelmet
        text={`${getNftText(nftState.type)} Details`}
        assets={nftState?.assets}
        ticker={nftState?.ticker}
        name={nftState?.name}
      />
      <div ref={ref}>
        <div className='token-details-card row mb-3'>
          <div className='col-12'>
            <div className='card'>
              <div className='card-header'>
                <div className='card-header-item d-flex align-items-center justify-content-between gap-3 flex-wrap'>
                  <h5
                    data-testid='title'
                    className='mb-0 d-flex align-items-center'
                  >
                    {getNftText(nftState.type)} Details
                  </h5>
                  {!nftState.scamInfo && (
                    <SpotlightButton path={`/nfts/${nftState.identifier}`} />
                  )}
                </div>
              </div>
              <div className='card-body'>
                <DetailItem title='Name'>
                  {nftState.scamInfo ? (
                    showData ? (
                      nftState.name
                    ) : (
                      `[Hidden - ${nftState.scamInfo.info}]`
                    )
                  ) : (
                    <span className='text-neutral-100'>{nftState.name}</span>
                  )}
                </DetailItem>
                <DetailItem title='Identifier'>
                  {nftState.identifier}
                </DetailItem>
                {nftState.ticker !== undefined &&
                  nftState.ticker !== nftState.collection &&
                  nftState.type === NftTypeEnum.MetaESDT && (
                    <DetailItem title='Ticker'>{nftState.ticker}</DetailItem>
                  )}
                {nftState.nonce && (
                  <DetailItem title='Nonce'>{nftState.nonce}</DetailItem>
                )}
                <DetailItem title='Type'>
                  <NftBadge type={nftState.type} />
                </DetailItem>
                <DetailItem title='Collection'>
                  <CollectionBlock nft={nftState} />
                </DetailItem>
                {nftState.owner !== undefined && (
                  <DetailItem title='Owner'>
                    <AccountLink address={nftState.owner} />
                  </DetailItem>
                )}
                <DetailItem title='Creator'>
                  <AccountLink address={nftState.creator} />
                </DetailItem>
                {nftState.timestamp !== undefined && (
                  <DetailItem title='Minted'>
                    <FontAwesomeIcon
                      icon={faClock}
                      className='me-2 text-neutral-400'
                    />
                    <TimeAgo value={nftState.timestamp} />
                    &nbsp;
                    <span className='text-neutral-400'>
                      ({formatDate(nftState.timestamp, false, true)})
                    </span>
                  </DetailItem>
                )}
                {nftState.royalties !== undefined &&
                  nftState.royalties !== null && (
                    <DetailItem title='Royalties'>
                      {nftState.royalties}%
                    </DetailItem>
                  )}
                {nftState.supply !== undefined &&
                  nftState.type !== NftTypeEnum.NonFungibleESDT && (
                    <DetailItem title='Supply'>
                      {nftState.decimals ? (
                        <Denominate
                          value={nftState.supply}
                          showLabel={false}
                          denomination={nftState.decimals}
                        />
                      ) : (
                        Number(nftState.supply).toLocaleString('en')
                      )}
                    </DetailItem>
                  )}
                {nftState.decimals !== undefined && (
                  <DetailItem title='Decimals'>{nftState.decimals}</DetailItem>
                )}
                {nftState?.assets && (
                  <SocialDetailItem assets={nftState.assets} />
                )}
                {nftState?.assets?.description && (
                  <DescriptionDetailItem
                    description={nftState.assets.description}
                  />
                )}
                {nftState.uris !== undefined && nftState.uris[0] && (
                  <DetailItem title='Assets'>
                    {nftState.scamInfo ? (
                      showData ? (
                        <NftPreview token={nftState} />
                      ) : (
                        `[Hidden - ${nftState.scamInfo.info}]`
                      )
                    ) : (
                      <NftPreview token={nftState} />
                    )}
                  </DetailItem>
                )}
                {showData &&
                  nftState.tags !== undefined &&
                  nftState.tags.length > 0 && (
                    <DetailItem title='Tags'>
                      <div className='d-flex flex-wrap gap-2'>
                        {nftState.tags.map((tag) => (
                          <div
                            key={tag}
                            className='badge badge-outline badge-outline-grey gap-2'
                          >
                            #{tag}
                          </div>
                        ))}
                      </div>
                    </DetailItem>
                  )}
                {showData &&
                  nftState?.rarities &&
                  Object.keys(nftState.rarities).length > 0 && (
                    <DetailItem title='Rarities'>
                      <div className='card-item-container my-n2'>
                        {nftState?.rarities?.openRarity?.rank && (
                          <CardItem
                            title='Open Rarity Rank'
                            icon={faTrophy}
                            className='nft-card-item'
                          >
                            {nftState.rarities.openRarity.rank}
                          </CardItem>
                        )}
                        {nftState?.rarities?.statistical?.rank && (
                          <CardItem
                            title='Statistical Rank'
                            icon={faTrophy}
                            className='nft-card-item'
                          >
                            {nftState.rarities.statistical.rank}
                          </CardItem>
                        )}
                        {nftState?.rarities?.jaccardDistances?.rank && (
                          <CardItem
                            title='Jaccard Distances Rank'
                            icon={faTrophy}
                            className='nft-card-item'
                          >
                            {nftState.rarities.jaccardDistances.rank}
                          </CardItem>
                        )}
                        {nftState?.rarities?.trait?.rank && (
                          <CardItem
                            title='Trait Rank'
                            icon={faTrophy}
                            className='nft-card-item'
                          >
                            {nftState.rarities.trait.rank}
                          </CardItem>
                        )}
                      </div>
                    </DetailItem>
                  )}
                {showData && nftState?.metadata?.attributes && (
                  <DetailItem title='Attributes'>
                    <div className='attributes-holder'>
                      {nftState.metadata.attributes.map(
                        ({ value, trait_type }) => (
                          <div
                            className='attribute'
                            key={`${trait_type}-${value}`}
                          >
                            <p className='trait' title={trait_type}>
                              {trait_type}
                            </p>
                            <p className='value' title={value}>
                              {value}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </DetailItem>
                )}
                {nftState.scamInfo && (
                  <DetailItem title=''>
                    <a
                      href='/#'
                      onClick={show}
                      className='small-font text-neutral-400'
                    >
                      {!showData ? 'Show' : 'Hide'} original content
                    </a>
                  </DetailItem>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : null;
};
