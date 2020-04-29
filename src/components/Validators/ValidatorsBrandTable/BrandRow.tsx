import React from 'react';
import carretDown from 'assets/img/carret-down.svg';
import BrandDetailsRow from './BrandDetailsRow';
import { BrandType } from './index';
import PercentegeBar from 'components/ValidatorDetails/PercentegeBar';

interface BrandRowType {
  brand: BrandType;
  rank: number;
}

const BrandRow = ({ brand, rank }: BrandRowType) => {
  const [collapsed, setCollapsed] = React.useState(true);

  const onClick = () => {
    setCollapsed(!collapsed);
  };

  const stake = brand.stake
    .toLocaleString('en')
    .replace(',000,000', 'm')
    .replace('00,000', 'm')
    .replace(',', '.');

  return (
    <>
      <tr onClick={onClick} className={collapsed ? 'brand-tr collapsed' : 'brand-tr'}>
        <td>{rank}</td>
        <td>
          <div className="d-flex align-items-center">
            <div className="mr-3">
              <img
                className={brand.avatar ? 'avatar' : 'avatar gray'}
                src={brand.avatar ? brand.avatar : '/validators/default-avatar.svg'}
                alt={brand.name}
                height="30"
              />
            </div>
            {brand.name ? brand.name : 'N/A'}
          </div>
        </td>

        <td>{stake} ERD</td>
        <td className="stake-bar-col">
          <PercentegeBar
            totalUpTimeLabel={Math.round(brand.overallStakePercent) + '%'}
            totalUpTimePercentege={brand.overallStakePercent}
            totalDownTimeLabel={Math.round(brand.stakePercent) + '%'}
            totalDownTimePercentege={brand.stakePercent}
          />
          <div className="stake-percent">
            {Math.round(brand.stakePercent) > 0 ? Math.round(brand.stakePercent) : '< 1'}%
          </div>
        </td>
        <td className="text-right">{brand.validators.length}</td>
        <td className="text-right">{Math.floor(brand.score).toLocaleString()}</td>
        <td className="text-right">
          <img src={carretDown} className="details-arrow" alt="details-arrow" height="8" />
        </td>
      </tr>
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
                    <BrandDetailsRow key={validator.publicKey} rowIndex={i} validator={validator} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
};

export default BrandRow;
