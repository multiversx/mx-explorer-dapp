import * as React from 'react';
import { faMapMarkerAlt } from '@fortawesome/pro-solid-svg-icons/faMapMarkerAlt';
import { faLink } from '@fortawesome/pro-solid-svg-icons/faLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IdentityType } from 'helpers/types';
import { Denominate, MultilayerPercentageBar, SharedIdentity, Trim } from 'components';
import { PercentageStepType } from 'components/MultilayerPercentageBar';

import { ReactComponent as IdentityGear } from 'assets/img/identity-gear.svg';
import { ReactComponent as TwitterLogo } from 'assets/img/logos/twitter.svg';

const prepareStakeDistribution = (identity: IdentityType) => {
  const distribution: PercentageStepType[] = [];

  if (identity.distribution) {
    Object.keys(identity.distribution).forEach((key) => {
      distribution.push({
        name: key === 'direct' ? 'Direct' : key,
        percent: Math.floor(identity.distribution[key] * 100),
      });
    });
  }

  return distribution.sort((a, b) => b.percent - a.percent);
};

const IdentityCard = ({ identity }: { identity: IdentityType }) => {
  const distribution = prepareStakeDistribution(identity);
  const identityName = identity?.name ?? 'N/A';

  return identity !== undefined ? (
    <div className="identity-card card">
      <div className="card-body p-3 p-lg-spacer my-lg-2">
        <div className="row">
          <div className="col-12 col-lg-5 d-flex flex-column flex-sm-row pr-lg-0">
            <div className="d-flex align-items-center pr-sm-4 mb-3 mb-sm-0 justify-content-center justify-content-sm-center">
              <SharedIdentity.Avatar identity={identity} />
            </div>

            <div className="d-flex flex-fill flex-column justify-content-center min-w-0">
              <div className="d-flex align-items-center justify-content-center justify-content-sm-start">
                <h5 className="mb-0 identity-name">
                  {identityName.length > 70 ? <Trim text={identityName} /> : identityName}
                </h5>
                <div className="d-flex flex-shrink-0 bg-success text-white btn-sm rounded-pill ml-2">
                  Rank {identity.rank ? identity.rank : 'N/A'}
                </div>
              </div>

              {identity.description && (
                <div className="idenity-description text-secondary mt-3">
                  {identity.description}
                </div>
              )}

              {(identity.location || identity.twitter || identity.website) && (
                <div className="d-flex mt-3 align-items-center flex-wrap">
                  {identity.location && (
                    <div className="d-flex align-items-center mr-3">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-secondary mr-1" />
                      <span className="text-secondary">{identity.location}</span>
                    </div>
                  )}

                  {identity.twitter && (
                    <div className="d-flex align-items-center mr-3">
                      <TwitterLogo className="identity-social-logo mr-1" />
                      <a target={`_blank`} rel={`noreferrer nofollow`} href={identity.twitter}>
                        {identity.twitter.split('/').pop()}
                      </a>
                    </div>
                  )}

                  {identity.website && (
                    <div className="d-flex align-items-center mr-1">
                      <FontAwesomeIcon icon={faLink} className="text-secondary mr-1" />
                      <a target={`_blank`} rel={`noreferrer nofollow`} href={identity.website}>
                        {identity.website.split('//').pop()}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="col-12 col-lg-2 d-none d-lg-flex align-items-center px-0">
            <IdentityGear className="middle-gear" />
          </div>

          <div className="col-12 col-lg-5 d-flex flex-column flex-sm-row pl-lg-0">
            <div className="d-flex flex-column flex-fill mt-4 mt-lg-0">
              <h6 className="mb-3 font-weight-600">Validator Details</h6>

              <div className="d-flex">
                <span className="text-secondary text-nowrap pr-2">Stake Balance:</span>
                {identity.locked ? <Denominate value={identity.locked} /> : 'N/A'}
              </div>
              <div className="d-flex mt-2">
                <span className="text-secondary pr-2">Stake percent:</span>
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
              <div className="d-flex mt-2">
                <span className="text-secondary pr-2">Nodes:</span>
                {identity.validators ? identity.validators : 'N/A'}
              </div>
              <div className="d-flex mt-2">
                <span className="text-secondary pr-2">Computed APR:</span>
                {identity.apr ? `${identity.apr}%` : 'N/A'}
              </div>
            </div>
            <div className="d-flex flex-column flex-fill mt-4 mt-lg-0 ml-sm-spacer min-w-0">
              <h6 className="mb-3 font-weight-600">Stake Distribution</h6>
              {distribution && distribution.length > 0 ? (
                <MultilayerPercentageBar steps={distribution} trim />
              ) : (
                <span className="text-secondary">N/A</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default IdentityCard;
