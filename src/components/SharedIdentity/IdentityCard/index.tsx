import * as React from 'react';
import { faLink } from '@fortawesome/pro-solid-svg-icons/faLink';
import { faMapMarkerAlt } from '@fortawesome/pro-solid-svg-icons/faMapMarkerAlt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ReactComponent as IdentityGear } from 'assets/img/identity-gear.svg';
import { ReactComponent as TwitterLogo } from 'assets/img/logos/twitter.svg';
import {
  Denominate,
  MultilayerPercentageBar,
  SharedIdentity,
  Trim
} from 'components';
import { NodesVersionsType } from 'types';

import { IdentityType } from 'types';

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
  const distribution = prepareStakeDistribution(identity);
  const identityName = identity?.name ?? 'N/A';

  return identity !== undefined ? (
    <div className='identity-card card'>
      <div className='card-body p-3 p-lg-spacer my-lg-2'>
        <div className='row'>
          <div className='col-12 col-lg-5 d-flex flex-column flex-sm-row pe-lg-0'>
            <div className='d-flex align-items-center pe-sm-4 mb-3 mb-sm-0 justify-content-center justify-content-sm-center'>
              <SharedIdentity.Avatar identity={identity} />
            </div>

            <div className='d-flex flex-fill flex-column justify-content-center min-w-0'>
              <div className='d-flex align-items-center justify-content-center justify-content-sm-start'>
                <h5 className='mb-0 identity-name'>
                  {identityName.length > 70 ? (
                    <Trim text={identityName} />
                  ) : (
                    identityName
                  )}
                </h5>
                <div className='d-flex flex-shrink-0 bg-success text-white btn-sm rounded-pill ms-2'>
                  Rank {identity.rank ? identity.rank : 'N/A'}
                </div>
              </div>

              {identity.description && (
                <div className='idenity-description text-neutral-400 mt-3'>
                  {identity.description}
                </div>
              )}

              {(identity.location || identity.twitter || identity.website) && (
                <div className='d-flex mt-3 align-items-center flex-wrap'>
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
                      <TwitterLogo className='identity-social-logo me-1' />
                      <a
                        target='_blank'
                        rel='noreferrer nofollow'
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

          <div className='col-12 col-lg-2 d-none d-lg-flex align-items-center px-0'>
            <IdentityGear className='middle-gear' />
          </div>

          <div className='col-12 col-lg-5 d-flex flex-column flex-sm-row ps-lg-0'>
            <div className='d-flex flex-column flex-fill mt-4 mt-lg-0'>
              <h5 className='mb-3 font-weight-600'>Validator Details</h5>

              <div className='d-flex'>
                <span className='text-neutral-400 text-nowrap pe-2'>
                  Stake Balance:
                </span>
                {identity.locked ? (
                  <Denominate value={identity.locked} />
                ) : (
                  'N/A'
                )}
              </div>
              <div className='d-flex mt-2'>
                <span className='text-neutral-400 pe-2'>Stake percent:</span>
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
              </div>
              <div className='d-flex mt-2'>
                <span className='text-neutral-400 pe-2'>Nodes:</span>
                {identity.validators ? identity.validators : 'N/A'}
              </div>
              <div className='d-flex mt-2'>
                <span className='text-neutral-400 pe-2'>Computed APR:</span>
                {identity.apr ? `${identity.apr}%` : 'N/A'}
              </div>
            </div>
            <div className='d-flex flex-column flex-fill mt-4 mt-lg-0 ms-sm-spacer min-w-0'>
              <h5 className='mb-3 font-weight-600'>Stake Distribution</h5>
              {distribution && distribution.length > 0 ? (
                <MultilayerPercentageBar steps={distribution} trim />
              ) : (
                <span className='text-neutral-400'>N/A</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};
