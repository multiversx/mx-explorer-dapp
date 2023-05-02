import React from 'react';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faLink } from '@fortawesome/pro-solid-svg-icons/faLink';
import { faMapMarkerAlt } from '@fortawesome/pro-solid-svg-icons/faMapMarkerAlt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';

import {
  Denominate,
  MultilayerPercentageRing,
  SharedIdentity,
  Trim
} from 'components';
import { activeNetworkSelector } from 'redux/selectors';
import { NodesVersionsType, IdentityType } from 'types';
import { StatsCard } from 'widgets';

const prepareStakeDistribution = (identity: IdentityType) => {
  const distribution: NodesVersionsType[] = [];

  if (identity.distribution) {
    Object.keys(identity.distribution).forEach((key) => {
      distribution.push({
        name: key === 'direct' ? 'Direct' : key,
        percent: Math.floor(identity.distribution[key] * 100)
      });
    });
  }

  return distribution.sort((a, b) => b.percent - a.percent);
};

export const IdentityCard = ({ identity }: { identity: IdentityType }) => {
  const { walletAddress } = useSelector(activeNetworkSelector);
  const distribution = prepareStakeDistribution(identity);
  const identityName = identity?.name ?? 'N/A';

  return identity !== undefined ? (
    <div
      className={`identity-card card card-black ${identity?.identity ?? ''}`}
    >
      <div className='card-body'>
        <div className='row'>
          <div className='col-12 d-flex flex-row gap-3'>
            <div className='d-flex align-items-center justify-content-center'>
              <SharedIdentity.Avatar identity={identity} />
            </div>

            <div className='d-flex flex-fill flex-column justify-content-center gap-1'>
              <div className='d-flex flex-wrap align-items-center'>
                <h5 className='mb-0 identity-name me-2'>
                  {identityName.length > 70 ? (
                    <Trim text={identityName} />
                  ) : (
                    identityName
                  )}
                </h5>
                <div className='identity-badge my-2'>
                  Rank{' '}
                  <div className='badge-side'>
                    {identity.rank ? identity.rank : 'N/A'}
                  </div>
                </div>
              </div>

              {identity.description && (
                <div className='idenity-description text-neutral-400'>
                  {identity.description}
                </div>
              )}

              {(identity.location || identity.twitter || identity.website) && (
                <div className='d-flex align-items-center flex-wrap'>
                  {identity.location && (
                    <div className='d-flex align-items-center me-3'>
                      <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        className='text-neutral-400 me-1'
                      />
                      <span className='text-neutral-400'>
                        {identity.location}
                      </span>
                    </div>
                  )}

                  {identity.twitter && (
                    <div className='d-flex align-items-center me-3'>
                      <FontAwesomeIcon
                        icon={faTwitter}
                        className='identity-social-logo me-1'
                      />
                      <a
                        target='_blank'
                        rel='noreferrer nofollow'
                        className='text-primary-200'
                        href={identity.twitter}
                      >
                        {identity.twitter.split('/').pop()}
                      </a>
                    </div>
                  )}

                  {identity.website && (
                    <div className='d-flex align-items-center me-1'>
                      <FontAwesomeIcon
                        icon={faLink}
                        className='text-neutral-400 me-1'
                      />
                      <a
                        target='_blank'
                        rel='noreferrer nofollow'
                        className='text-primary-200'
                        href={identity.website}
                      >
                        {identity.website.split('//').pop()}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='row mt-spacer'>
          <div className='col-12 d-flex flex-column'>
            <div className='d-flex flex-row flex-wrap gap-3'>
              <StatsCard
                title='Stake Balance'
                value={
                  <>
                    {identity.locked ? (
                      <Denominate value={identity.locked} />
                    ) : (
                      'N/A'
                    )}
                  </>
                }
                className='detail-card'
              />

              <StatsCard
                title='Stake Percentage'
                value={
                  <>
                    {identity.stakePercent ? (
                      <>
                        {Math.round(identity.stakePercent) > 0
                          ? Math.round(identity.stakePercent)
                          : '< 1'}
                        %
                      </>
                    ) : (
                      'N/A'
                    )}
                  </>
                }
                className='detail-card'
                neutralColors
              />

              <StatsCard
                title='Computed APR'
                value={<>{identity.apr ? `${identity.apr}%` : 'N/A'}</>}
                className='detail-card'
                neutralColors
              />

              <div className='d-flex flex-fill align-items-end justify-content-end stake-card'>
                <a
                  className='btn btn-block btn-sm btn-primary'
                  target='_blank'
                  rel='noreferrer nofollow'
                  href={walletAddress}
                >
                  Stake now
                </a>
              </div>
            </div>

            <div className='d-flex flex-row flex-wrap gap-3 mt-3'>
              <div className='card distribution-card'>
                <div className='card-body d-flex flex-row flex-wrap align-items-center justify-content-between'>
                  <div className='distribution-card-title'>
                    Stake Distribution
                  </div>
                  <div className='distribution-card-value'>
                    {distribution && distribution.length > 0 ? (
                      <MultilayerPercentageRing steps={distribution} trim />
                    ) : (
                      <span className='text-neutral-400'>N/A</span>
                    )}
                  </div>
                </div>
              </div>

              <div className='card nodes-card'>
                <div className='card-body d-flex flex-row flex-wrap align-items-center justify-content-between'>
                  <div className='nodes-card-title'>Nodes</div>
                  <h2 className='nodes-card-value mb-0'>
                    {identity.validators ? identity.validators : 'N/A'}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};
