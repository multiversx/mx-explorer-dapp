import React from 'react';
import BrandRow from './BrandRow';
import { ValidatorType } from './../index';
import { groupByBrandAndSort } from './helpers/brandHelper';
import Tabs from '../Tabs';

export interface BrandType {
  name: string;
  avatar: string;
  score: number;
  stake: number;
  stakePercent: number;
  overallStakePercent: number;
  validators: ValidatorType[];
}

interface ValidatorsBrandTableType {
  allValidators: ValidatorType[];
  brandData: BrandDataType[];
}

export interface BrandDataType {
  avatar: string;
  name: string;
  identity: string;
  publicKeys: string[];
}

const ValidatorsBrandTable = ({ allValidators, brandData }: ValidatorsBrandTableType) => {
  const sortedBrands: BrandType[] = groupByBrandAndSort({
    brandData,
    allValidators: [...allValidators],
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

export default ValidatorsBrandTable;
