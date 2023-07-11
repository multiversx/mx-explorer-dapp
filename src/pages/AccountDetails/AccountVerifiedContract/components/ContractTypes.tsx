import React from 'react';

import { VerifiedContractType } from 'types';

import { ContractType } from './ContractType';

export const ContractTypes = ({
  contract
}: {
  contract: VerifiedContractType;
}) => {
  return (
    <div className='contract-types'>
      {contract?.source?.abi?.types && (
        <>
          {Object.keys(contract.source.abi.types).map((type, index) => (
            <React.Fragment key={`${type}-${index}`}>
              <ContractType
                type={contract.source.abi.types[type]}
                typeName={type}
              />
            </React.Fragment>
          ))}
        </>
      )}
    </div>
  );
};
