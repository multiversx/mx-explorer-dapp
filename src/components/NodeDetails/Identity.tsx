import * as React from 'react';
import { DetailItem, NetworkLink, Trim } from 'sharedComponents';
import { validatorsRoutes } from 'routes';
import { IdentityType } from 'context/state';

const Identity = ({ identity }: { identity: IdentityType }) => {
  return (
    <div className="card" data-testid="brandContainer">
      <div className="card-header">
        <div className="card-header-item p-0">
          <div className="identity-header-item px-lg-3">
            <img
              className={`mr-3 avatar rounded-circle shadow-sm ${identity.avatar ? '' : 'gray'}`}
              src={identity.avatar ? identity.avatar : '/validators/default-avatar.svg'}
              alt={identity.name}
              height="42"
            />

            {identity.identity ? (
              <NetworkLink to={`${validatorsRoutes.index}/${identity.identity}`}>
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
            {identity.stake.toLocaleString('en')}
          </DetailItem>
          <DetailItem title="Stake percent" colWidth="6">
            {Math.round(identity.stakePercent) > 0 ? Math.round(identity.stakePercent) : '< 1'}%
          </DetailItem>
          <DetailItem title="Nodes" colWidth="6">
            {identity.validators.toLocaleString('en')}
          </DetailItem>
          <DetailItem title="Score" colWidth="6">
            {Math.round(identity.score).toLocaleString('en')}
          </DetailItem>
        </div>
      </div>
    </div>
  );
};

export default Identity;
