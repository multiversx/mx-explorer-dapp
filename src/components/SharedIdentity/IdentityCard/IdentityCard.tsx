import { faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';

import {
  FormatAmount,
  FormatNumber,
  MultilayerPercentageRing,
  SharedIdentity,
  Trim
} from 'components';
import { getValidLink } from 'helpers';
import { faLink, faMapMarkerAlt } from 'icons/solid';
import { activeNetworkSelector } from 'redux/selectors';
import { IdentityType, MultilayerPercentageStepType } from 'types';
import { StatsCard } from 'widgets';

import { useGetIdentityNodePercentage } from './useGetIdentityNodePercentage';

const prepareStakeDistribution = (identity: IdentityType) => {
  const distribution: MultilayerPercentageStepType[] = [];

  if (identity.distribution) {
    Object.keys(identity.distribution).forEach((key) => {
      distribution.push({
        name: key === 'direct' ? 'Direct' : key,
        value: Math.floor(identity.distribution[key] * 100)
      });
    });
  }

  return distribution.sort((a, b) => Number(b.value) - Number(a.value));
};

export const IdentityCard = ({ identity }: { identity: IdentityType }) => {
  const { walletAddress } = useSelector(activeNetworkSelector);
  const nodesPercentage = useGetIdentityNodePercentage({ identity });
  const distribution = prepareStakeDistribution(identity);

  const identityName = identity?.name ?? 'N/A';

  const twitterLink = getValidLink({
    link: identity?.twitter,
    baseDomain: 'twitter.com',
    altBaseDomain: 'x.com'
  });
  const websiteLink = getValidLink({
    link: identity?.website
  });

  if (!identity) {
    return null;
  }

  return (
    <div className={`identity-card card card-black ${identity.identity ?? ''}`}>
      <div className='card-body'>
        <div className='row'>
          <div className='col-12 d-flex flex-row gap-3'>
            <div className='d-flex align-items-start align-items-md-center justify-content-center'>
              <SharedIdentity.Avatar identity={identity} className='me-2' />
            </div>

            <div className='d-flex flex-fill flex-column justify-content-center gap-1'>
              <div className='d-flex flex-wrap align-items-center gap-2'>
                <h5 className='mb-0 identity-name'>
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

              {(identity.location || twitterLink || websiteLink) && (
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

                  {twitterLink && (
                    <div className='d-flex align-items-center me-3'>
                      <FontAwesomeIcon
                        icon={faXTwitter}
                        className='identity-social-logo me-1'
                      />
                      <a
                        target='_blank'
                        rel='noreferrer nofollow noopener'
                        className='text-primary-200'
                        href={twitterLink}
                      >
                        {twitterLink.split('/').pop()}
                      </a>
                    </div>
                  )}

                  {websiteLink && (
                    <div className='d-flex align-items-center me-1'>
                      <FontAwesomeIcon
                        icon={faLink}
                        className='text-neutral-400 me-1'
                      />
                      <a
                        target='_blank'
                        rel='noreferrer nofollow noopener'
                        className='text-primary-200'
                        href={websiteLink}
                      >
                        {websiteLink.split('//').pop()}
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
                      <FormatAmount value={identity.locked} />
                    ) : (
                      'N/A'
                    )}
                  </>
                }
                className='detail-card'
              />

              {identity.stakePercent && (
                <StatsCard
                  title='% of Total Stake'
                  value={
                    <FormatNumber
                      value={identity.stakePercent}
                      label='%'
                      maxDigits={2}
                      decimalOpacity={false}
                      hideLessThanOne
                    />
                  }
                  className='detail-card'
                />
              )}

              <StatsCard
                title='Computed Gross APR'
                value={
                  <>
                    {identity.apr ? (
                      <FormatNumber
                        value={identity.apr}
                        label='%'
                        decimalOpacity={false}
                      />
                    ) : (
                      'N/A'
                    )}
                  </>
                }
                className='detail-card'
              />

              {walletAddress && (
                <div className='d-flex flex-fill align-items-end justify-content-end stake-card'>
                  <a
                    className='btn btn-block btn-sm btn-primary'
                    target='_blank'
                    rel='noreferrer nofollow noopener'
                    href={walletAddress}
                  >
                    Stake now
                  </a>
                </div>
              )}
            </div>

            <div className='d-flex flex-row flex-wrap gap-3 mt-3'>
              <div className='card distribution-card'>
                <div className='card-body d-flex flex-row flex-wrap align-items-center justify-content-between'>
                  <div className='distribution-card-title'>
                    Stake Distribution
                  </div>
                  <div className='distribution-card-value'>
                    {distribution && distribution.length > 0 ? (
                      <MultilayerPercentageRing
                        steps={distribution}
                        hasChart={false}
                        hasTrim
                      />
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

              <div className='card nodes-card'>
                <div className='card-body d-flex flex-row flex-wrap align-items-center justify-content-between'>
                  <div className='nodes-card-title'>% of Total Nodes</div>
                  <h2 className='nodes-card-value mb-0'>
                    <FormatNumber
                      value={nodesPercentage}
                      label='%'
                      maxDigits={2}
                      decimalOpacity={false}
                      hideLessThanOne
                    />
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
