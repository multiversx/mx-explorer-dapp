import React from 'react';
import BigNumber from 'bignumber.js';
import carretDown from 'assets/img/carret-down.svg';
import BrandDetailsRow from './BrandDetailsRow';
import { BrandType } from './BrandTable';
import { TestnetLink } from 'sharedComponents';
import PercentegeBar from '../ValidatorDetails/PercentegeBar';
import { validatorsRoutes } from 'routes';
interface BrandRowType {
  brand: BrandType;
  rank: number;
}

export const stake = (brand: BrandType) =>
  parseFloat(new BigNumber(brand.stake).dividedBy(1000).valueOf()).toLocaleString('en');

export const cumulativeStakePercent = (brand: BrandType) =>
  `${Math.round(brand.stakePercent) > 0 ? Math.round(brand.stakePercent) : '< 1'}%`;

const BrandRow = ({ brand, rank }: BrandRowType) => {
  const [collapsed, setCollapsed] = React.useState(true);
  const [showDetails, setShowDetails] = React.useState(false);

  const onClick = () => {
    setShowDetails(true);
    setCollapsed(!collapsed);
  };

  const link = brand.identity
    ? `${validatorsRoutes.index}/${brand.identity}`
    : `${validatorsRoutes.nodes}/${brand.validators[0].publicKey}`;

  return brand.validators.length ? (
    <>
      <tr onClick={onClick} className={collapsed ? 'brand-tr collapsed' : 'brand-tr'}>
        <td>{rank}</td>
        <td>
          <div className="d-flex align-items-center">
            <div className="mr-3">
              <TestnetLink to={`${validatorsRoutes.index}/${brand.identity}`}>
                <img
                  className={brand.avatar ? 'avatar' : 'avatar gray'}
                  src={brand.avatar ? brand.avatar : '/validators/default-avatar.svg'}
                  alt={brand.name}
                  height="42"
                />
              </TestnetLink>
            </div>
            <TestnetLink to={link}>{brand.name ? brand.name : 'N/A'}</TestnetLink>
          </div>
        </td>

        <td>{stake(brand)} eGLD</td>
        <td className="stake-bar-col">
          <PercentegeBar
            totalUpTimeLabel={Math.round(brand.overallStakePercent) + '%'}
            totalUpTimePercentege={brand.overallStakePercent}
            totalDownTimeLabel={Math.round(brand.stakePercent) + '%'}
            totalDownTimePercentege={brand.stakePercent}
          />
          <div className="stake-percent">{cumulativeStakePercent(brand)}</div>
        </td>
        <td className="text-right">{brand.validators.length}</td>
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
                    {brand.validators.map((validator, i) => (
                      <BrandDetailsRow
                        key={validator.publicKey}
                        rowIndex={i}
                        validator={validator}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  ) : (
    <></>
  );
};

export default BrandRow;
