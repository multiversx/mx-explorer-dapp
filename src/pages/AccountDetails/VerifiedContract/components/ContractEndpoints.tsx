import React from 'react';

import { VerifiedContractType } from 'types';

import { ContractEndpoint } from './ContractEndpoint';

export const ContractEndpoints = ({
  contract
}: {
  contract: VerifiedContractType;
}) => {
  return (
    <div className='contract-endpoints'>
      {contract?.source?.abi?.endpoints && (
        <>
          {contract.source.abi.endpoints.map((endpoint, index) => (
            <React.Fragment key={`${endpoint.name}-${index}`}>
              <ContractEndpoint endpoint={endpoint} />
            </React.Fragment>
          ))}
        </>
      )}
    </div>
  );
};
