import React from 'react';
import BigNumber from 'bignumber.js';
import { useGlobalState } from 'context';
import { ValidatorType } from 'context/validators';
import { BrandType } from 'context/state';
import carretDown from 'assets/img/carret-down.svg';
import BrandDetailsRow from './IdenityDetailsRow';
import { Loader, TestnetLink } from 'sharedComponents';
import PercentegeBar from 'components/Validators/ValidatorDetails/PercentegeBar';
import { validatorsRoutes } from 'routes';

export interface BrandRowType {
  brand: BrandType;
  rank: number;
}

export const stake = (brand: BrandType) =>
  parseFloat(new BigNumber(brand.stake).dividedBy(1000).valueOf()).toLocaleString('en');

export const cumulativeStakePercent = (brand: BrandType) =>
  `${Math.round(brand.stakePercent) > 0 ? Math.round(brand.stakePercent) : '< 1'}%`;

const IdentityRow = ({ brand, rank }: BrandRowType) => {
  const [collapsed, setCollapsed] = React.useState(true);
  const [showDetails, setShowDetails] = React.useState(false);
  const [brandNodes, setBrandNodes] = React.useState<ValidatorType[]>([]);

  const {
    config: { erdLabel },
    nodes,
  } = useGlobalState();

  const expand = (identity: string) => () => {
    if (brandNodes.length === 0) {
      setTimeout(() => {
        const validators = nodes.filter((brand) => brand.identity === identity);
        setBrandNodes(validators);
      }, 3000);
    }
    setShowDetails(true);
    setCollapsed(!collapsed);
  };

  const link = `${validatorsRoutes.index}/${brand.identity}`;

  return (
    <>
      <tr
        onClick={expand(brand.identity)}
        className={collapsed ? 'brand-tr collapsed' : 'brand-tr'}
      >
        <td>{rank}</td>
        <td>
          <div className="d-flex align-items-center">
            <div className="mr-3">
              <TestnetLink to={`${validatorsRoutes.index}/${brand.identity}`}>
                {}
                <img
                  className={brand.avatar ? 'avatar' : 'avatar gray'}
                  src={brand.avatar ? brand.avatar : require('../../assets/img/default-avatar.svg')}
                  alt={brand.name}
                  height="42"
                />
              </TestnetLink>
            </div>
            <TestnetLink to={link}>{brand.name ? brand.name : 'N/A'}</TestnetLink>
          </div>
        </td>

        <td>
          {stake(brand)} {erdLabel}
        </td>
        <td className="stake-bar-col">
          <PercentegeBar
            totalUpTimeLabel={Math.round(brand.overallStakePercent) + '%'}
            totalUpTimePercentege={brand.overallStakePercent}
            totalDownTimeLabel={Math.round(brand.stakePercent) + '%'}
            totalDownTimePercentege={brand.stakePercent}
          />
          <div className="stake-percent">{cumulativeStakePercent(brand)}</div>
        </td>
        <td className="text-right">{brand.nodesCount}</td>
        <td className="text-right">{Math.round(brand.score).toLocaleString()}</td>
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
                          <Loader.Dots />
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
