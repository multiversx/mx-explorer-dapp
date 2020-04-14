import React from 'react';
import elrondLogo from 'assets/img/elrond-symbol.svg';
import ValidatorTableRow from '../ValidatorsTable/Trow';
import { ValidatorBrand } from './index';

const ValidatorBrandRow = ({ 
        brand, 
        rank,
        validatorDetails,
        validatorStatistics,
        ratingOrder
    } : { 
        brand: ValidatorBrand, 
        rank: number,
        validatorDetails: boolean,
        validatorStatistics: boolean,
        ratingOrder: string[]
    }) => {
    const [collapsed, setCollapsed] = React.useState(true);

    return (
        <>
            <tr onClick={(e) => setCollapsed(!collapsed)}>
                <td>{rank}</td>
                <td><img src={brand.avatar ? brand.avatar : elrondLogo} alt={brand.name} className="mr-2" height="30" /></td>
                <td>{brand.name}</td>
                <td>{brand.validators.length}</td>
                <td className="text-right">{Math.floor(brand.totalRating)}</td>
            </tr>
            <tr className={collapsed ? 'details-row collapsed' : 'details-row'}>
                <td colSpan={5} className="p-0">
                    <div className="content">
                        <div className="inner-content p-2 ml-4">
                            <div className="table-responsive" style={{ minHeight: '100px' }}>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Public Key</th>
                                            <th>Node Name</th>
                                            <th>Shard</th>
                                            <th>Version</th>
                                            <th className="text-right">Rating</th>
                                            <th className="text-right">Uptime</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {brand.validators.map((validator, i) => (
                                            <ValidatorTableRow
                                                key={validator.hexPublicKey}
                                                ratingOrder={ratingOrder}
                                                rowIndex={i}
                                                validator={validator}
                                                validatorDetails={validatorDetails}
                                                validatorStatistics={validatorStatistics}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        </>
    );
  };
  
  export default ValidatorBrandRow;