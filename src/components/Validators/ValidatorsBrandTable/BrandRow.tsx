import React from 'react';
import elrondLogo from 'assets/img/elrond-symbol.svg';
import carretDown from 'assets/img/carret-down.svg';
import BrandDetailsRow from './BrandDetailsRow';
import { BrandType } from './index';

interface BrandRowType {
  brand: BrandType;
  rank: number;
}

const BrandRow = ({ brand, rank }: BrandRowType) => {
  const [collapsed, setCollapsed] = React.useState(true);

  const onClick = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      <tr onClick={onClick} className={collapsed ? 'brand-tr collapsed' : 'brand-tr'}>
        <td>{rank}</td>
        <td>
          <div className="d-flex align-items-center">
            <div className="mr-3">
              <img
                className={brand.avatar ? 'avatar' : 'avatar gray'}
                src={brand.avatar ? `/validators/${brand.avatar}` : elrondLogo}
                alt={brand.name}
                height="30"
              />
            </div>
            {brand.name ? brand.name : 'N/A'}
          </div>
        </td>

        <td className="stake-bar-col p-0">
          <div className="stake-bar-wrapper d-flex justify-content-start h-100 w-100">
            <div className="stake-bar-overall" style={{ width: brand.overallStakeBarWidth + '%' }}>
              &nbsp;
            </div>
            <div className="stake-bar" style={{ width: brand.stakeBarWidth + '%' }}>
              &nbsp;
            </div>
            <div className="stake-percent">{brand.stakeBarWidth.toFixed(2)}%</div>
            <div className="stake-value">{brand.stake}</div>
          </div>
        </td>
        <td className="text-right">{brand.validators.length}</td>
        <td className="text-right">{Math.floor(brand.score)}</td>
        <td className="text-right">
          <img src={carretDown} className="details-arrow" alt="details-arrow" height="8" />
        </td>
      </tr>
      <tr className={collapsed ? 'details-tr collapsed' : 'details-tr'}>
        <td colSpan={6} className="p-0">
          <div className="content">
            <div className="table-responsive px-4 pt-3" style={{ minHeight: '50px' }}>
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
