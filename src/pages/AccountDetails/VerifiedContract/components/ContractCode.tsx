import React, { useState } from 'react';

import { VerifiedContractType } from 'types';

import { ContractCards } from './ContractCards';
import { ContractFiles } from './ContractFiles';

export const ContractCode = ({
  contract
}: {
  contract: VerifiedContractType;
}) => {
  return (
    <div>
      {contract?.source?.abi && <ContractCards abi={contract.source.abi} />}
      {contract?.source?.contract?.entries && (
        <div className=''>
          <h5 className='my-spacer'>Contract Source Code</h5>
          <ContractFiles entries={contract.source.contract.entries} />
        </div>
      )}
    </div>
  );
};
