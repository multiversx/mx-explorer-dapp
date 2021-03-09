import * as React from 'react';
import { faAngleRight } from '@fortawesome/pro-regular-svg-icons/faAngleRight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IdentityType } from 'context/state';
import { CopyButton, NetworkLink, SharedIdentity, Trim } from 'sharedComponents';
import { urlBuilder } from 'helpers';
import { ReactComponent as TwitterLogo } from 'assets/images/logos/twitter.svg';

const IdentitySummary = ({ identity }: { identity: IdentityType | undefined }) => {
  return identity !== undefined ? (
    <div className="identity-summary card">
      <div className="card-body px-lg-spacer">
        <div className="row">
          <div className="col">
            <div className="d-flex flex-row align-items-center">
              <div className="d-flex align-items-center flex-shrink-0 mr-3">
                <div className="rounded-circle p-1 border">
                  <SharedIdentity.Avatar identity={identity} />
                </div>
                <h5 className="mb-0 ml-2">
                  {identity.identity ? (
                    <NetworkLink to={urlBuilder.identityDetails(identity.identity)}>
                      {identity.name ? identity.name : 'N/A'}
                    </NetworkLink>
                  ) : (
                    <>{identity.name ? <Trim text={identity.name} /> : 'N/A'}</>
                  )}
                </h5>
              </div>

              <div className="mr-3">
                <FontAwesomeIcon icon={faAngleRight} className="text-muted" size="2x" />
              </div>

              <div className="d-flex text-secondary mr-3" style={{ maxWidth: '22rem' }}>
                <span className="mr-2 d-flex flex-shrink-0">Public address:</span>
                <NetworkLink
                  to={urlBuilder.accountDetails(
                    'erd104le4p88hwdyhtmnm8er547xgvr6w4es2c7e0dytt25l5633dt5qy59jtg'
                  )}
                  className="trim-wrapper"
                >
                  <Trim text="erd104le4p88hwdyhtmnm8er547xgvr6w4es2c7e0dytt25l5633dt5qy59jtg" />
                </NetworkLink>
                <CopyButton
                  text={'erd104le4p88hwdyhtmnm8er547xgvr6w4es2c7e0dytt25l5633dt5qy59jtg'}
                />
              </div>

              <div>
                {identity.location && (
                  <>
                    Location:
                    <span className="text-secondary mx-2">{identity.location}</span>
                  </>
                )}

                {identity.twitter && (
                  <a target={`_blank`} rel={`noreferrer nofollow`} href={identity.twitter}>
                    <TwitterLogo className="social-logo" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default IdentitySummary;
