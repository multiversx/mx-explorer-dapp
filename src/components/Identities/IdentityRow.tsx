import React from 'react';
import BigNumber from 'bignumber.js';
import { useGlobalState } from 'context';
import { ValidatorType } from 'context/validators';
import { IdentityType } from 'context/state';
import carretDown from 'assets/images/carret-down.svg';
import BrandDetailsRow from './IdenityDetailsRow';
import { Loader, NetworkLink, Trim } from 'sharedComponents';
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
        className={`identity-row ${collapsed ? 'collapsed' : ''}`}
      >
        <td>{rank}</td>
        <td>
          <div className="d-flex align-items-center">
            <div className="mr-3">
              <NetworkLink to={`${validatorsRoutes.index}/${identity.identity}`}>
                {}
                <img
                  className={`avatar ${!identity.avatar ? 'gray' : ''}`}
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
            {identity.name && identity.name.length > 70 ? (
              <NetworkLink to={link} className="trim-wrapper">
                <Trim text={identity.name} />
              </NetworkLink>
            ) : (
              <NetworkLink to={link}>{identity.name ? identity.name : 'N/A'}</NetworkLink>
            )}
          </div>
        </td>

        <td>
          {stake(identity)} {erdLabel}
        </td>
        <td className="stake-bar-col">
          <div className="d-flex align-items-center">
            <div className="flex-fill">
              <PercentegeBar
                totalUpTimeLabel={Math.round(identity.overallStakePercent) + '%'}
                totalUpTimePercentege={identity.overallStakePercent}
                totalDownTimeLabel={Math.round(identity.stakePercent) + '%'}
                totalDownTimePercentege={identity.stakePercent}
              />
            </div>
            <div className="ml-3">{cumulativeStakePercent(identity, blockchainTotalStake)}</div>
          </div>
        </td>
        <td className="text-right">{identity.validators}</td>
        <td className="text-right">{Math.round(identity.score).toLocaleString()}</td>
        <td className="text-right">
          <img src={carretDown} className="details-arrow" alt="details-arrow" height="8" />
        </td>
      </tr>
      {showDetails && (
        <tr className={`identity-details-row ${collapsed ? 'collapsed' : ''}`}>
          <td colSpan={7} className="p-0">
            <div className="content">
              <div className="table-wrapper py-2 px-4">
                <table className="table">
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
