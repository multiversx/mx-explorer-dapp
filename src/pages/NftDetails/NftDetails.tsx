import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { CardItem, Loader } from 'components';
import { urlBuilder, hasNftOverview } from 'helpers';
import { useNetworkRoute } from 'hooks';
import { faTrophy } from 'icons/regular';
import { NftTabs } from 'layouts/NftLayout/NftTabs';
import { nftSelector } from 'redux/selectors';

export const NftDetails = () => {
  const networkRoute = useNetworkRoute();
  const { nftState } = useSelector(nftSelector);
  const { rarities, tags, metadata, identifier } = nftState;

  const showOverview = hasNftOverview(nftState);

  if (!showOverview) {
    return (
      <Navigate
        replace
        to={networkRoute(urlBuilder.nftDetailsTransactions(identifier))}
      />
    );
  }

  return (
    <div className='card nft-details'>
      <div className='card-header'>
        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
          <NftTabs />
        </div>
      </div>
      {nftState ? (
        <>
          <div className='card-body d-flex flex-column gap-spacer'>
            {metadata?.attributes && (
              <div>
                <h5 className='card card-sm bg-table-header p-3 mb-3'>
                  Attributes
                </h5>
                <div className='attributes-holder'>
                  {metadata.attributes.map(({ value, trait_type }) => (
                    <div className='attribute' key={`${trait_type}-${value}`}>
                      <p className='trait' title={trait_type}>
                        {trait_type}
                      </p>
                      <p className='value' title={value}>
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {rarities && Object.keys(rarities).length > 0 && (
              <div>
                <h5 className='card card-sm bg-table-header p-3 mb-3'>
                  Rarities
                </h5>
                <div className='card-item-container my-n2'>
                  {rarities?.openRarity?.rank && (
                    <CardItem
                      title='Open Rarity Rank'
                      icon={faTrophy}
                      className='nft-card-item'
                    >
                      {rarities.openRarity.rank}
                    </CardItem>
                  )}
                  {rarities?.statistical?.rank && (
                    <CardItem
                      title='Statistical Rank'
                      icon={faTrophy}
                      className='nft-card-item'
                    >
                      {rarities.statistical.rank}
                    </CardItem>
                  )}
                  {rarities?.jaccardDistances?.rank && (
                    <CardItem
                      title='Jaccard Distances Rank'
                      icon={faTrophy}
                      className='nft-card-item'
                    >
                      {rarities.jaccardDistances.rank}
                    </CardItem>
                  )}
                  {rarities?.trait?.rank && (
                    <CardItem
                      title='Trait Rank'
                      icon={faTrophy}
                      className='nft-card-item'
                    >
                      {rarities.trait.rank}
                    </CardItem>
                  )}
                </div>
              </div>
            )}
            {tags !== undefined && tags.length > 0 && (
              <div>
                <h5 className='card card-sm bg-table-header p-3 mb-3'>Tags</h5>
                <div className='d-flex flex-wrap gap-2'>
                  {tags.map((tag) => (
                    <div
                      key={tag}
                      className='badge badge-outline badge-outline-grey gap-2'
                    >
                      #{tag}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <Loader data-testid='nftDetailsLoader' />
      )}
    </div>
  );
};
