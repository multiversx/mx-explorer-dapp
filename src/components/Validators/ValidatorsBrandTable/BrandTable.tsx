import React from 'react';
import BrandRow from './BrandRow';
import { ValidatorType, BrandDataType as ContextBrandDataType } from 'context/validators';

import { groupByBrandAndSort } from './helpers/brandHelper';
import Tabs from '../Tabs';
// import './validatorsBrand.scss';

export interface BrandType {
  name: string;
  avatar: string;
  identity: string;
  score: number;
  stake: number;
  twitter: string;
  web: string;
  location: string;
  stakePercent: number;
  overallStakePercent: number;
  validators: ValidatorType[];
}

export type BrandDataType = ContextBrandDataType;
interface BrandTableType {
  allValidators: ValidatorType[];
  brandData: BrandDataType[];
}

const BrandTable = ({ allValidators, brandData }: BrandTableType) => {
  const sortedBrands: BrandType[] = groupByBrandAndSort({
    brandData,
    allValidators: [...allValidators],
    totalValidators: allValidators.length,
  });

  const ref = React.useRef(null);
  const [brands, setBrands] = React.useState([...sortedBrands].slice(0, 10));

  const delayRendering = () => {
    if (brands.length !== sortedBrands.length) {
      setTimeout(() => {
        if (ref.current !== null) {
          setBrands(sortedBrands);
        }
      }, 100);
    }
  };

  React.useEffect(delayRendering, [sortedBrands]);

  return (
    <div className="branded-validators row mb-3" ref={ref}>
      <div className="col-12">
        <div className="card">
          <div className="card-body card-list">
            <Tabs extraClasses={'mb-2'} />

            <div className="table-responsive" style={{ minHeight: '50px' }}>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th className="th-rank">#</th>
                    <th className="th-name">Validator Name</th>
                    <th>Stake</th>
                    <th className="th-stake-percent">Cumulative stake</th>
                    <th className="w-10 text-right">Nodes</th>
                    <th className="w-10 text-right">Score</th>
                    <th className="th-details">&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  {brands.map((brand, i) => (
                    <BrandRow key={i} rank={i + 1} brand={brand} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandTable;
