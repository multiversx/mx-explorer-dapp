import * as React from 'react';
import { ReactComponent as IdentityGear } from 'assets/images/identity-gear.svg';
import { IdentityType } from 'context/state';
import { Denominate, MultilayerPercentageBar, SharedIdentity } from 'sharedComponents';
import { ReactComponent as TwitterLogo } from 'assets/images/logos/twitter.svg';
import { faMapMarkerAlt } from '@fortawesome/pro-solid-svg-icons/faMapMarkerAlt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PercentageStepType } from 'sharedComponents/MultilayerPercentageBar';

const prepareStakeDistribution = (identity: IdentityType) => {
  const distribution: PercentageStepType[] = [];

  if (identity.distribution) {
    Object.keys(identity.distribution).forEach((key) => {
      distribution.push({
        name: key === 'direct' ? 'Direct-staked' : key,
        percent: identity.distribution[key] * 100,
      });
    });
  }

  return distribution.sort((a, b) => b.percent - a.percent);
};

const IdentityCard = ({ identity }: { identity: IdentityType }) => {
  const distribution = prepareStakeDistribution(identity);

  return identity !== undefined ? (
    <div className="identity-card card">
      <div className="card-body p-3 p-lg-4">
        <div className="row">
          <div className="col-12 col-lg-5 d-flex flex-column flex-sm-row">
            <div className="d-flex align-items-center pr-sm-4 mb-3 mb-sm-0 justify-content-center justify-content-sm-center">
              <SharedIdentity.Avatar identity={identity} />
            </div>

            <div className="d-flex flex-fill flex-column justify-content-center min-w-0">
              <div className="d-flex align-items-center justify-content-center justify-content-sm-start">
                <h5 className="mb-0">{identity.name}</h5>
                <div className="d-flex flex-shrink-0 bg-success text-white btn-sm rounded-pill ml-2">
                  Rank {identity.rank ? identity.rank : 'N/A'}
                </div>
              </div>

              {identity.description && (
                <div className="idenity-description text-secondary mt-3">
                  {identity.description}
                </div>
              )}

              {(identity.location || identity.twitter) && (
                <div className="d-flex mt-3 align-items-center">
                  {identity.location && (
                    <div className="d-flex align-items-center mr-4">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-secondary mr-1" />
                      <span className="text-secondary">{identity.location}</span>
                    </div>
                  )}

                  {identity.twitter && (
                    <div className="d-flex align-items-center">
                      <TwitterLogo className="identity-social-logo mr-1" />
                      <a target={`_blank`} rel={`noreferrer nofollow`} href={identity.twitter}>
                        {identity.twitter.split('/').pop()}
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

          <div className="col-12 col-lg-5 d-flex flex-column flex-sm-row">
            <div className="d-flex flex-column flex-fill mt-4 mt-lg-0">
              <h6 className="mb-3">Validator Details</h6>

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
            </div>
            <div className="d-flex flex-column flex-fill mt-4 mt-lg-0 ml-sm-4 min-w-0">
              <h6 className="mb-3">Stake Distribution</h6>
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
