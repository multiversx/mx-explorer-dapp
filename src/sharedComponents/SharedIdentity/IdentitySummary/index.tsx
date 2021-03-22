import * as React from 'react';
import { faAngleRight } from '@fortawesome/pro-regular-svg-icons/faAngleRight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IdentityType } from 'context/state';
import { NetworkLink, SharedIdentity, Trim } from 'sharedComponents';
import { urlBuilder } from 'helpers';
import { useGlobalState } from 'context';

const IdentitySummary = ({ identity }: { identity: IdentityType | undefined }) => {
  const {
    activeNetwork: { erdLabel },
  } = useGlobalState();

  return identity !== undefined ? (
    <div className="identity-summary card">
      <div className="card-body px-lg-spacer">
        <div className="row">
          <div className="col">
            <div className="d-flex flex-column flex-md-row align-items-md-center">
              <div className="d-flex align-items-center min-w-0 mb-3 mb-md-0">
                <SharedIdentity.Avatar identity={identity} />

                <h5 className="mb-0 ml-2">
                  {identity.identity ? (
                    <NetworkLink to={urlBuilder.identityDetails(identity.identity)}>
                      {identity.name ? identity.name : 'N/A'}
                    </NetworkLink>
                  ) : (
                    <>{identity.name ? <Trim text={identity.name} /> : 'N/A'}</>
                  )}
                </h5>

                <div className="flex-shrink-0 bg-success text-white btn-sm rounded-pill ml-2">
                  Rank {identity.rank ? identity.rank : '...'}
                </div>
              </div>

              <div className="d-none d-md-flex mx-4">
                <FontAwesomeIcon icon={faAngleRight} className="text-muted" size="2x" />
              </div>

              <div className="d-flex align-items-center mr-4">
                <span className="pr-2">Stake Balance:</span>
                <span className="text-secondary">
                  {identity.stake ? (
                    <>
                      {identity.stake.toLocaleString('en')} {erdLabel}
                    </>
                  ) : (
                    '...'
                  )}
                </span>
              </div>
              <div className="d-flex align-items-center mr-4">
                <span className="pr-2">Stake percent:</span>
                <span className="text-secondary">
                  {identity.stakePercent ? (
                    <>
                      {Math.round(identity.stakePercent) > 0
                        ? Math.round(identity.stakePercent)
                        : '< 1'}
                      %
                    </>
                  ) : (
                    '...'
                  )}
                </span>
              </div>
              <div className="d-flex align-items-center">
                <span className="pr-2">Nodes:</span>
                <span className="text-secondary">
                  {identity.validators ? identity.validators : '...'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default IdentitySummary;
