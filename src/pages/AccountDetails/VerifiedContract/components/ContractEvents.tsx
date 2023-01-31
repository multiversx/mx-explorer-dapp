import React from 'react';

import { VerifiedContractType } from 'types';

import { ContractEvent } from './ContractEvent';

export const ContractEvents = ({
  contract
}: {
  contract: VerifiedContractType;
}) => {
  return (
    <div className='contract-events'>
      {contract?.source?.abi?.events && (
        <>
          {contract.source.abi.events.map((event, index) => (
            <React.Fragment key={`${event.identifier}-${index}`}>
              <ContractEvent event={event} />
            </React.Fragment>
          ))}
        </>
      )}
    </div>
  );
};
