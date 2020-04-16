import React from 'react';
import BrandRow from './BrandRow';
import { ValidatorType } from './../index';
import { groupByBrandAndSort } from './helpers/brandHelper';
import brandsJson from '../../../validators_branding.js';

export interface BrandType {
    name: string;
    avatar: string;
    cumulativeUptime: number;
    cumulativeStatus: string;
    score: number;
    validators: ValidatorType[];
};

export interface JsonBrandType {
    name: string;
    avatar: string;
    nodesPubKeys: string[];
};

const ValidatorsBrandTable = ({
    allValidators
  }: {
    allValidators: ValidatorType[];
  }) => {
    const sortedBrands: BrandType[] = groupByBrandAndSort({brandsJson, allValidators});
  
    return (
        <div className="branded-validators row mb-3">
            <div className="col-12">
            <div className="card p-3">
                <div className="table-responsive" style={{ minHeight: '50px' }}>
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th style={{ width: '12px' }}>#</th>
                            <th>Validator Name</th>
                            <th className="w-10 text-right">Nodes</th>
                            <th className="text-right d-none">Uptime</th>
                            <th className="text-right d-none">Status</th>
                            <th className="w-10 text-right">Score</th>
                        </tr>
                        </thead>
                        <tbody>
                            {sortedBrands.map((brand, i) =>
                                <BrandRow 
                                    key={i} 
                                    rank={i+1} 
                                    brand={brand}
                                />
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            </div>
        </div>
    );
};

export default ValidatorsBrandTable;
