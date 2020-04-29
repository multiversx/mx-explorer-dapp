import React from 'react';
import BrandRow from './BrandRow';
import { ValidatorType } from './../index';
import { groupByBrandAndSort } from './helpers/brandHelper';
import { getBrandData, KeybaseArrayType } from './helpers/asyncRequests';
import { useGlobalState } from 'context';

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
}

export type BrandDataType = {
  name: string;
  avatar: string;
} & KeybaseArrayType;

const ValidatorsBrandTable = ({ allValidators }: ValidatorsBrandTableType) => {
  const [keybaseData, setKeybaseData] = React.useState<BrandDataType[]>([]);
  const {
    timeout,
    config: { explorerApi },
  } = useGlobalState();

  React.useEffect(() => {
    const keybaseObj: { [key: string]: string[] } = {};
    allValidators.map(v => {
      if (keybaseObj[v.identity] === undefined) {
        keybaseObj[v.identity] = [];
      }
      keybaseObj[v.identity].push(v.publicKey);
      return null;
    });
    const keybaseArray = Object.keys(keybaseObj).map(identity => ({
      identity,
      publicKeys: keybaseObj[identity],
    }));
    getBrandData({ keybaseArray, explorerApi, timeout }).then(({ data, success }) => {
      if (success) {
        setKeybaseData(data as any);
      }
    });
  }, [allValidators, explorerApi, timeout]);

  const sortedBrands: BrandType[] = groupByBrandAndSort({
    keybaseData,
    allValidators: [...allValidators],
  });

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
                  <th className="th-stake-percent">Cumulative stake</th>
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
