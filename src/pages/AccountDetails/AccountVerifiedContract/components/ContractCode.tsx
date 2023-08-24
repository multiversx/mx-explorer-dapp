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
      {contract && <ContractCards contract={contract} />}
      {contract?.source?.contract?.entries && (
        <div className=''>
          <h5 className='d-flex flex-column flex-xl-row flex-wrap align-items-center justify-content-xl-between my-spacer gap-2'>
            <span>Contract Source Code</span>
            <div className='d-flex gap-2'>
              {contract?.source?.contract?.name && (
                <code className='p-2 bg-table-header text-primary rounded'>
                  {contract.source.contract.name}
                </code>
              )}
              {contract?.source?.contract?.version && (
                <code className='p-2 bg-table-header text-primary-700 rounded ms-2'>
                  {contract.source.contract.version}
                </code>
              )}
            </div>
          </h5>

          <ContractFiles entries={contract.source.contract.entries} />
        </div>
      )}
    </div>
  );
};
