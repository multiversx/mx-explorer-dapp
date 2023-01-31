import React from 'react';
import BigNumber from 'bignumber.js';

import { NetworkLink } from 'components';
import { urlBuilder } from 'helpers';
import { MostUsedCollectionsType } from 'types/growthWidgets';

export const MostUsedCollections = ({
  data
}: {
  data: MostUsedCollectionsType[];
}) => {
  return (
    <div className='card card-black h-100'>
      <div className='card-header'>
        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap'>
          <h5 className='table-title d-flex align-items-center'>
            Daily most transacted NFTs
          </h5>
        </div>
      </div>

      <div className='card-body'>
        <div className='table-wrapper animated-list'>
          <table className='table mb-0'>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Token</th>
                <th>Total Txn</th>
              </tr>
            </thead>
            <tbody data-testid='collectionsTable'>
              {data.map((collection, i) => (
                <tr key={collection.rank} className='text-lh-24'>
                  <td>{collection.rank}</td>
                  <td>
                    <NetworkLink
                      to={urlBuilder.collectionDetails(collection.key)}
                      className={`d-flex text-truncate text-primary-200 ${
                        collection?.extraInfo?.assets?.svgUrl ? 'side-link' : ''
                      }`}
                    >
                      <div className='d-flex align-items-center symbol trim text-truncate'>
                        {collection?.extraInfo?.assets ? (
                          <>
                            {collection.extraInfo.assets?.svgUrl && (
                              <img
                                src={collection.extraInfo.assets.svgUrl}
                                alt={
                                  collection?.extraInfo?.name ?? collection.key
                                }
                                className='side-icon me-1'
                              />
                            )}
                            <div className='text-truncate'>
                              {collection?.extraInfo?.name ? (
                                <>
                                  {collection.extraInfo.name} (
                                  {collection.extraInfo.ticker})
                                </>
                              ) : (
                                <>{collection.key}</>
                              )}
                            </div>
                          </>
                        ) : (
                          <div className='text-truncate'>{collection.key}</div>
                        )}
                      </div>
                    </NetworkLink>
                  </td>
                  <td className='text-center'>
                    {new BigNumber(collection.value).toFormat()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
