import React from 'react';
import BigNumber from 'bignumber.js';
import { useGlobalState } from 'context';
import { ValidatorType } from 'context/validators';
import { IdentityType } from 'context/state';
import carretDown from 'assets/images/carret-down.svg';
import BrandDetailsRow from './IdenityDetailsRow';
import { Loader, NetworkLink } from 'sharedComponents';
import PercentegeBar from 'components/Validators/ValidatorDetails/PercentegeBar';
import { validatorsRoutes } from 'routes';

export interface IdentityRowType {
  identity: IdentityType;
  rank: number;
}

export const stake = ({ stake }: IdentityType) => {
  return parseFloat(new BigNumber(stake).dividedBy(1000).valueOf()).toLocaleString('en');
};

export const cumulativeStakePercent = (identity: IdentityType, blockchainTotalStake: number) => {
  const stakePercent = (identity.stake / blockchainTotalStake) * 100;
  return `${Math.round(stakePercent) > 0 ? Math.round(stakePercent) : '< 1'}%`;
};

const IdentityRow = ({ identity, rank }: IdentityRowType) => {
  const [collapsed, setCollapsed] = React.useState(true);
  const [showDetails, setShowDetails] = React.useState(false);
  const [brandNodes, setBrandNodes] = React.useState<ValidatorType[]>([]);
  const { blockchainTotalStake } = useGlobalState();

  const {
    activeNetwork: { erdLabel },
    nodes,
  } = useGlobalState();

  const expand = (identity: string) => () => {
    // TODO async call
    if (brandNodes.length === 0) {
      setTimeout(() => {
        const validators = nodes.filter((brand) => brand.identity === identity);
        setBrandNodes(validators);
      }, 3000);
    }
    setShowDetails(true);
    setCollapsed(!collapsed);
  };

  const link = `${validatorsRoutes.index}/${identity.identity}`;

  return (
    <>
      <tr
        onClick={expand(identity.identity)}
        className={collapsed ? 'brand-tr collapsed' : 'brand-tr'}
      >
        <td>{rank}</td>
        <td>
          <div className="d-flex align-items-center">
            <div className="mr-3">
              <NetworkLink to={`${validatorsRoutes.index}/${identity.identity}`}>
                {}
                <img
                  className={identity.avatar ? 'avatar' : 'avatar gray'}
                  src={
                    identity.avatar
                      ? identity.avatar
                      : require('../../assets/images/default-avatar.svg')
                  }
                  alt={identity.name}
                  height="42"
                />
              </NetworkLink>
            </div>
            <NetworkLink to={link}>{identity.name ? identity.name : 'N/A'}</NetworkLink>
          </div>
        </td>

        <td>
          {stake(identity)} {erdLabel}
        </td>
        <td className="stake-bar-col">
          <PercentegeBar
            totalUpTimeLabel={Math.round(identity.overallStakePercent) + '%'}
            totalUpTimePercentege={identity.overallStakePercent}
            totalDownTimeLabel={Math.round(identity.stakePercent) + '%'}
            totalDownTimePercentege={identity.stakePercent}
          />
          <div className="stake-percent">
            {cumulativeStakePercent(identity, blockchainTotalStake)}
          </div>
        </td>
        <td className="text-right">{identity.validators}</td>
        <td className="text-right">{Math.round(identity.score).toLocaleString()}</td>
        <td className="text-right">
          <img src={carretDown} className="details-arrow" alt="details-arrow" height="8" />
        </td>
      </tr>
      {showDetails && (
        <tr className={collapsed ? 'details-tr collapsed' : 'details-tr'}>
          <td colSpan={7} className="p-0">
            <div className="content">
              <div className="table-responsive px-4 pt-2" style={{ minHeight: '50px' }}>
                <table className="table mb-2">
                  <thead>
                    <tr>
                      <th>Public Key</th>
                      <th>Node Name</th>
                      <th>Shard</th>
                      <th>Version</th>
                      <th className="text-right">Uptime</th>
                      <th className="text-right">Status</th>
                      <th className="text-right">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {brandNodes.length > 0 ? (
                      brandNodes.map((node, i) => (
                        <BrandDetailsRow key={node.publicKey} rowIndex={i} node={node} />
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center">
                          <Loader />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default IdentityRow;
