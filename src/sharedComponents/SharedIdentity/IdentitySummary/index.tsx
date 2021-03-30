import * as React from 'react';
import { faAngleRight } from '@fortawesome/pro-regular-svg-icons/faAngleRight';
import { faCity } from '@fortawesome/pro-regular-svg-icons/faCity';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IdentityType } from 'context/state';
import { Denominate, NetworkLink, PageState, SharedIdentity, Trim } from 'sharedComponents';
import { urlBuilder } from 'helpers';

const IdentitySummary = ({ identity }: { identity: IdentityType | undefined }) => {
  return (
    <div className="identity-summary card">
      <div className="card-body px-lg-spacer">
        {identity !== undefined ? (
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
                    Rank {identity.rank ? identity.rank : 'N/A'}
                  </div>
                </div>
                <div className="d-none d-md-flex mx-4">
                  <FontAwesomeIcon icon={faAngleRight} className="text-muted" size="2x" />
                </div>
                <div className="d-flex align-items-center mr-4">
                  <span className="text-secondary pr-2">Stake Balance:</span>
                  {identity.locked ? <Denominate value={identity.locked} /> : 'N/A'}
                </div>
                <div className="d-flex align-items-center mr-4">
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
                <div className="d-flex align-items-center">
                  <span className="text-secondary pr-2">Nodes:</span>
                  {identity.validators ? identity.validators : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <PageState
            icon={faCity}
            title="Unable to load identity details"
            className="py-spacer my-auto page-state-sm"
            dataTestId="errorScreen"
          />
        )}
      </div>
    </div>
  );
};

export default IdentitySummary;
