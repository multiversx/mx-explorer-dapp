import * as React from 'react';
import { ReactComponent as IdentityGear } from 'assets/images/identity-gear.svg';
import { IdentityType } from 'context/state';
import { MultilayerPercentageBar, SharedIdentity } from 'sharedComponents';
import { useGlobalState } from 'context';
import { ReactComponent as TwitterLogo } from 'assets/images/logos/twitter.svg';
import { faMapMarkerAlt } from '@fortawesome/pro-solid-svg-icons/faMapMarkerAlt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const IdentityCard = ({ identity }: { identity: IdentityType }) => {
  const {
    activeNetwork: { erdLabel },
  } = useGlobalState();

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
                  Rank 10
                </div>
              </div>

              {!identity.description && (
                <div className="idenity-description text-secondary mt-3">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ultrices mi et velit
                  rutrum feugiat.
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
                <span className="pr-2">Stake Balance:</span>
                <span className="text-secondary">
                  {identity.stake.toLocaleString('en')} {erdLabel}
                </span>
              </div>
              <div className="d-flex mt-2">
                <span className="pr-2">Stake percent:</span>
                <span className="text-secondary">
                  {Math.round(identity.stakePercent) > 0
                    ? Math.round(identity.stakePercent)
                    : '< 1'}
                  %
                </span>
              </div>
              <div className="d-flex mt-2">
                <span className="pr-2">Nodes:</span>
                <span className="text-secondary">{identity.validators}</span>
              </div>
            </div>
            <div className="d-flex flex-column flex-fill mt-4 mt-lg-0">
              <h6 className="mb-3">Stake Distribution</h6>

              <MultilayerPercentageBar
                steps={[
                  { name: 'Direct-staked', percent: 70 },
                  { name: 'Contract 1', percent: 30 },
                  // { name: 'Contract 2', percent: 10 },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default IdentityCard;
