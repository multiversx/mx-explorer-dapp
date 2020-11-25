import * as React from 'react';
import { NetworkLink, Trim, SharedIdentity, PageState } from 'sharedComponents';
import { IdentityType } from 'context/state';
import { faBuilding } from '@fortawesome/pro-regular-svg-icons/faBuilding';

const Identity = ({ identity }: { identity: IdentityType | undefined }) => {
  return (
    <>
      <div className="card" data-testid="brandContainer">
        {identity === undefined ? (
          <PageState
            icon={faBuilding}
            title="Unable to load Identity"
            className="page-state-sm m-auto"
            dataTestId="identityCardErrorScreen"
          />
        ) : (
          <>
            <div className="card-header">
              <div className="card-header-item p-0">
                <div className="identity-header-item px-lg-3 justify-content-center">
                  <SharedIdentity.Avatar identity={identity} />

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
                <SharedIdentity.Detail identity={identity} field="stake" title="Stake" />
                <SharedIdentity.Detail
                  identity={identity}
                  field="stakePercent"
                  title="Stake percent"
                />
                <SharedIdentity.Detail identity={identity} field="validators" title="Nodes" />
                <SharedIdentity.Detail identity={identity} field="score" title="Score" />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Identity;
