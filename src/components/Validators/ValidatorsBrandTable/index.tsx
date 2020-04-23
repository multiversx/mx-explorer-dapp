import React from 'react';
import BrandRow from './BrandRow';
import { ValidatorType } from './../index';
import { groupByBrandAndSort } from './helpers/brandHelper';
import brandsJson from '../../../validators_branding.js';

export interface BrandType {
  name: string;
  avatar: string;
  score: number;
  stake: number;
  stakePercent: number;
  overallStakePercent: number;
  validators: ValidatorType[];
}

export interface JsonBrandType {
  name: string;
  avatar: string;
  nodesPubKeys: string[];
}

interface ValidatorsBrandTableType {
  allValidators: ValidatorType[];
}

const ValidatorsBrandTable = ({ allValidators }: ValidatorsBrandTableType) => {
  const sortedBrands: BrandType[] = groupByBrandAndSort({ brandsJson, allValidators });

  return (
    <div className="branded-validators row mb-3">
      <div className="col-12">
        <div className="card p-3">
          <div className="table-responsive" style={{ minHeight: '50px' }}>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th className="th-rank">#</th>
                  <th className="th-name">Validator Name</th>
                  <th>Stake</th>
                  <th className="th-stake-percent">Stake percent</th>
                  <th className="w-10 text-right">Nodes</th>
                  <th className="w-10 text-right">Score</th>
                  <th className="th-details">&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {sortedBrands.map((brand, i) => (
                  <BrandRow key={i} rank={i + 1} brand={brand} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidatorsBrandTable;
