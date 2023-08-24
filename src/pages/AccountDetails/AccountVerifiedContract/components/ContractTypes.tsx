import { Fragment } from 'react';
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
            <Fragment key={`${type}-${index}`}>
              <ContractType
                type={contract.source.abi.types[type]}
                typeName={type}
              />
            </Fragment>
          ))}
        </>
      )}
    </div>
  );
};
