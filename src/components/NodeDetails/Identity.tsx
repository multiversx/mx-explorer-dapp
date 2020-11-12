import * as React from 'react';
import { DetailItem, NetworkLink, Trim, IdentityAvatar, PageState } from 'sharedComponents';
import { IdentityType } from 'context/state';
import { useGlobalState } from 'context';
import { faUser } from '@fortawesome/pro-regular-svg-icons/faUser';

const Identity = ({ identity }: { identity: IdentityType | undefined }) => {
  const {
    activeNetwork: { erdLabel },
  } = useGlobalState();

  return (
    <>
      <div className="card" data-testid="brandContainer">
        {identity === undefined ? (
          <PageState
            icon={faUser}
            title="Unable to load Identity"
            className="page-state-sm m-auto"
            dataTestId="identityCardErrorScreen"
          />
        ) : (
          <>
            <div className="card-header">
              <div className="card-header-item p-0">
                <div className="identity-header-item px-lg-3 justify-content-center">
                  <IdentityAvatar identity={identity} />

                  {identity.identity ? (
                    <NetworkLink to={`/validators/${identity.identity}`}>
                      {identity.name ? identity.name : 'N/A'}
                    </NetworkLink>
                  ) : (
                    <>{identity.name ? <Trim text={identity.name} /> : 'N/A'}</>
                  )}
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="container-fluid">
                <DetailItem title="Stake" colWidth="6">
                  {identity.stake.toLocaleString('en')} {erdLabel}
                </DetailItem>
                <DetailItem title="Stake percent" colWidth="6">
                  {Math.round(identity.stakePercent) > 0
                    ? Math.round(identity.stakePercent)
                    : '< 1'}
                  %
                </DetailItem>
                <DetailItem title="Nodes" colWidth="6">
                  {identity.validators.toLocaleString('en')}
                </DetailItem>
                <DetailItem title="Score" colWidth="6">
                  {Math.round(identity.score).toLocaleString('en')}
                </DetailItem>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Identity;
