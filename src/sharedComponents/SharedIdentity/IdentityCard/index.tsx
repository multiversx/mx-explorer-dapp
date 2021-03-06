import * as React from 'react';
import { ReactComponent as IdentityGear } from 'assets/images/identity-gear.svg';
import { IdentityType } from 'context/state';
import {
  CopyButton,
  MultilayerPercentageBar,
  NetworkLink,
  SharedIdentity,
  Trim,
} from 'sharedComponents';
import { urlBuilder } from 'helpers';
import { useGlobalState } from 'context';
import { ReactComponent as TwitterLogo } from 'assets/images/logos/twitter.svg';

const IdentityCard = ({ identity }: { identity: IdentityType }) => {
  const {
    activeNetwork: { erdLabel },
  } = useGlobalState();

  return identity !== undefined ? (
    <div className="identity-card card">
      <div className="card-body">
        <div className="row">
          <div className="col-12 col-lg-5 d-flex flex-row py-4">
            <div className="d-flex flex-column align-items-center align-self-center px-4">
              <div className="rounded-circle p-2 border mb-3">
                <SharedIdentity.Avatar identity={identity} />
              </div>
              <div className="bg-success text-white rounded px-3 py-1">Rank 10</div>
            </div>

            <div className="d-flex flex-fill flex-column min-w-0">
              <h5 className="mb-0">{identity.name}</h5>
              <div className="text-secondary mt-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ultrices mi et velit
                rutrum feugiat.
              </div>
              <div className="d-flex flex-row mt-3">
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
              <div className="d-flex mt-3 align-items-center">
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

          <div className="col-12 col-lg-2 d-flex align-items-center px-0">
            <IdentityGear className="h-100" />
          </div>

          <div className="col-12 col-lg-5 d-flex py-4 pr-4">
            <div className="d-flex flex-column flex-fill">
              <h5 className="mb-0">Validator Details</h5>

              <div className="d-flex mt-4">
                <span className="pr-2">Stake Balance:</span>
                <span className="text-secondary">
                  {identity.stake.toLocaleString('en')} {erdLabel}
                </span>
              </div>
              <div className="d-flex mt-3">
                <span className="pr-2">Stake percent:</span>
                <span className="text-secondary">
                  {Math.round(identity.stakePercent) > 0
                    ? Math.round(identity.stakePercent)
                    : '< 1'}
                  %
                </span>
              </div>
              <div className="d-flex mt-3">
                <span className="pr-2">Nodes:</span>
                <span className="text-secondary">{identity.validators}</span>
              </div>
              <div className="d-flex mt-3">
                <span className="pr-2">Commision:</span>
                <span className="text-secondary">[2%]</span>
              </div>
            </div>
            <div className="d-flex flex-column flex-fill">
              <h5 className="mb-4">Stake Distribution</h5>

              <MultilayerPercentageBar
                steps={[
                  { name: 'Direct-staked', percent: 70 },
                  { name: 'Contract 1', percent: 20 },
                  { name: 'Contract 2', percent: 10 },
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
