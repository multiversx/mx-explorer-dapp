import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';

import { NetworkLink, Overlay } from 'components';
import { urlBuilder } from 'helpers';
import { faHexagonCheck } from 'icons/solid';
import { collectionRoutes } from 'routes';
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
          <p className='h5 table-title text-capitalize'>
            Most transacted NFTs{'  '}
            <span className='text-neutral-500 ms-1'>(daily)</span>
          </p>
          <NetworkLink
            to={collectionRoutes.collections}
            className='btn btn-sm btn-dark'
          >
            View Dashboard
          </NetworkLink>
        </div>
      </div>

      <div className='card-body'>
        <div className='table-wrapper animated-list'>
          <table className='table trim-size mb-0'>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Token</th>
                <th className='text-end'>Items</th>
                <th className='text-end'>Holders</th>
                <th className='text-end'>Total Txn</th>
              </tr>
            </thead>
            <tbody data-testid='collectionsTable'>
              {data.map((collection) => (
                <tr key={collection.rank} className='text-lh-24'>
                  <td>{collection.rank}</td>
                  <td>
                    <NetworkLink
                      to={urlBuilder.collectionDetails(collection.key)}
                      className={`d-flex align-items-center symbol trim text-truncate text-primary-200 w-min-content ${
                        collection.extraInfo?.assets?.svgUrl ? 'side-link' : ''
                      }`}
                    >
                      {collection.extraInfo?.assets ? (
                        <>
                          {collection.extraInfo.assets?.svgUrl && (
                            <img
                              src={collection.extraInfo.assets.svgUrl}
                              className='side-icon me-1'
                              alt=''
                              role='presentation'
                            />
                          )}
                          <div className='text-truncate'>
                            {collection.extraInfo?.name ? (
                              <>{collection.extraInfo.name}</>
                            ) : (
                              <>{collection.key}</>
                            )}
                          </div>
                          {collection.extraInfo?.isVerified && (
                            <Overlay
                              title='Verified'
                              className='verified-badge-wrapper'
                            >
                              <FontAwesomeIcon
                                icon={faHexagonCheck}
                                size='sm'
                                className='text-yellow-spotlight ms-2'
                              />
                            </Overlay>
                          )}
                        </>
                      ) : (
                        <div className='text-truncate'>{collection.key}</div>
                      )}
                    </NetworkLink>
                  </td>
                  <td className='text-end'>
                    {collection.extraInfo?.nftCount &&
                      new BigNumber(collection.extraInfo.nftCount).toFormat()}
                  </td>
                  <td className='text-end'>
                    {collection.extraInfo?.holderCount &&
                      new BigNumber(
                        collection.extraInfo.holderCount
                      ).toFormat()}
                  </td>
                  <td className='text-neutral-300 text-end fw-600 pe-2'>
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
