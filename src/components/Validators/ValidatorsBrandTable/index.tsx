import React from 'react';
import ValidatorBrandRow from './TBrandRow';
import { ValidatorType } from './../index';

export interface ValidatorBrand {
    name: string;
    avatar: string;
    validators: ValidatorType[];
    totalRating: number;
};

export interface JsonValidatorBrand {
    name: string;
    avatar: string;
    nodesPubKeys: string[];
};

const groupAndSortValidators = (brandsJson: JsonValidatorBrand[], allValidators: ValidatorType[]) => {
    const sortedBrands: ValidatorBrand[] = [];

    brandsJson.map((jsonBrand: JsonValidatorBrand) => {
        const ownedValidators = allValidators.filter(
            validator => jsonBrand.nodesPubKeys.indexOf(validator.hexPublicKey) > -1
        );

        // remove owned from allValidators
        ownedValidators.forEach(validator => {
            const index = allValidators.indexOf(validator);

            if (index > -1) { 
                allValidators.splice(index, 1);
            }
        });
        
        // sort DESC
        ownedValidators.sort((a, b) => b.rating - a.rating);

        let _totalRating = 0;
        if (ownedValidators && ownedValidators.length > 0) {
            _totalRating = ownedValidators.map(o => o.rating).reduce((a, c) => { return a + c }) / ownedValidators.length;
        }

        sortedBrands.push({
            name: jsonBrand.name,
            avatar: jsonBrand.avatar,
            validators: ownedValidators,
            totalRating: _totalRating 
        });
    });

    // add the rest of the brandless validators
    allValidators.forEach(validator => {
        sortedBrands.push({
            name: validator.nodeDisplayName,
            avatar: "",
            validators: [validator],
            totalRating: validator.rating 
        });
    });

    // sort DESC
    sortedBrands.sort((a, b) => b.totalRating - a.totalRating);

    return sortedBrands;
};

const ValidatorsBrandTable = ({
    allValidators,
    validatorDetails,
    validatorStatistics
  }: {
    allValidators: ValidatorType[];
    validatorDetails: boolean;
    validatorStatistics: boolean;
  }) => {
    const brandsJson: JsonValidatorBrand[] = require('../../../../public/validators_branding.json');
    const sortedBrands: ValidatorBrand[] = groupAndSortValidators(brandsJson, allValidators);
  
    return (
        <div className="branded-validators row mb-3">
            <div className="col-12">
            <div className="card p-3">
                <div className="table-responsive" style={{ minHeight: '50px' }}>
                <table className="table table-hover">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Avatar</th>
                        <th>Name</th>
                        <th>Nodes</th>
                        <th className="text-right">Rating</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedBrands.map((brand, i) =>
                        <ValidatorBrandRow 
                            key={i} 
                            rank={i+1} 
                            brand={brand}
                            ratingOrder={brand.validators.map(validator => validator.hexPublicKey)}
                            validatorDetails={validatorDetails}
                            validatorStatistics={validatorStatistics}
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