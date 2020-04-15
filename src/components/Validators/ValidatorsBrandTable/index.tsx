import React from 'react';
import ValidatorBrandRow from './TBrandRow';
import { ValidatorType } from './../index';

export interface ValidatorBrand {
    name: string;
    avatar: string;
    cumulativeUptime: string;
    cumulativeStatus: string;
    cumulativeRating: number;
    validators: ValidatorType[];
};

export interface JsonValidatorBrand {
    name: string;
    avatar: string;
    nodesPubKeys: string[];
};

const groupByBrandAndSort = (brandsJson: JsonValidatorBrand[], allValidators: ValidatorType[]) => {
    const sortedBrands: ValidatorBrand[] = [];

    brandsJson.forEach((jsonBrand: JsonValidatorBrand) => {
        const brandValidators: ValidatorType[] = allValidators.filter(
            validator => jsonBrand.nodesPubKeys.indexOf(validator.publicKey) > -1
        );

        // remove owned nodes from allValidators
        brandValidators.forEach(validator => {
            const index = allValidators.indexOf(validator);

            if (index > -1) { 
                allValidators.splice(index, 1);
            }
        });
        
        // sort DESC
        brandValidators.sort((a, b) => b.rating - a.rating);

        sortedBrands.push(generateBrandRowWithStats(jsonBrand, brandValidators));
    });

    // add the rest of the brandless validators
    allValidators.forEach(validator => {
        sortedBrands.push(
            generateBrandRowWithStats({
                    name: validator.nodeDisplayName,
                    avatar: '',
                    nodesPubKeys: [validator.publicKey]
                }, 
                [validator]
            )
        );
    });

    // sort DESC
    sortedBrands.sort((a, b) => b.cumulativeRating - a.cumulativeRating);

    return sortedBrands;
};

const generateBrandRowWithStats = (jsonBrand: JsonValidatorBrand, brandValidators: ValidatorType[]) => {
    // RATING
    let _cumulativeRating = 0;
    if (brandValidators && brandValidators.length > 0) {
        _cumulativeRating = brandValidators.map(o => o.rating).reduce((a, c) => { return a + c });
    }

    // STATUS
    let _cumulativeStatus = 'Online';
    let offlineValidators: number = brandValidators.filter(validator => 
        validator.isActive === false
    ).length;

    if (offlineValidators === brandValidators.length) {
        _cumulativeStatus = 'Offline';
    } else if (offlineValidators > 0) {
        _cumulativeStatus = 'Mixed';
    }

    // UPTIME
    let _cumulativeUptime = 0;

    brandValidators.forEach(validator => {
        let uptime = 0;

        if (validator.totalUpTimeSec !== 0 || validator.totalDownTimeSec !== 0) {
            uptime = Math.floor(
                (validator.totalUpTimeSec * 100) /
                (validator.totalUpTimeSec + validator.totalDownTimeSec)
            );
        } else {
            if (validator.totalUpTimeSec === 0 &&
                validator.totalDownTimeSec === 0 &&
                validator.isActive === true) {
                    uptime = 100;
                }              
                
            if (validator.totalUpTimeSec === 0 &&
                validator.totalDownTimeSec === 0 &&
                validator.isActive === false) {
                    uptime = 0;
                }
        }

        _cumulativeUptime += uptime;
    });

    if (_cumulativeUptime > 0) {
        _cumulativeUptime = (_cumulativeUptime / brandValidators.length);
    }
    
   return {
        name: jsonBrand.name,
        avatar: jsonBrand.avatar,
        cumulativeUptime: _cumulativeUptime + '%',
        cumulativeStatus: _cumulativeStatus,
        cumulativeRating: _cumulativeRating,
        validators: brandValidators
    };
};

const ValidatorsBrandTable = ({
    allValidators
  }: {
    allValidators: ValidatorType[];
  }) => {
    const brandsJson: JsonValidatorBrand[] = require('../../../../public/validators_branding.json');
    const sortedBrands: ValidatorBrand[] = groupByBrandAndSort(brandsJson, allValidators);
  
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
                            <th className="w-10 text-right">Rating</th>
                        </tr>
                        </thead>
                        <tbody>
                            {sortedBrands.map((brand, i) =>
                                <ValidatorBrandRow 
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