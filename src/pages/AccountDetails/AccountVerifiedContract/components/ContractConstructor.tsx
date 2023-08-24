import { VerifiedContractType } from 'types';

export const ContractConstructor = ({
  contract
}: {
  contract: VerifiedContractType;
}) => {
  return (
    <div className='card card-sm bg-table-header mb-3'>
      <div className='d-flex flex-row flex-wrap align-items-center gap-2 card-body'>
        <h6 className='mb-0'>
          <code>Inputs:</code>
        </h6>
        {contract.source.abi?.['constructor']?.inputs?.map(
          ({ name, type }: any, index: number) => {
            return (
              <div
                className='px-2 py-1 bg-neutral-900'
                key={`${name}-${index}`}
              >
                <code className='text-neutral-100 me-2'>{name}</code>
                <code className='text-neutral-400'>{type}</code>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};
