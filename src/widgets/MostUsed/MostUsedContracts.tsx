import BigNumber from 'bignumber.js';

import { AccountLink } from 'components';
import { AccountAssetType } from 'types';
import { MostUsedApplicationsType } from 'types/growthWidgets';

export const MostUsedContracts = ({
  data
}: {
  data: MostUsedApplicationsType[];
}) => {
  return (
    <div className='card card-black h-100'>
      <div className='card-header'>
        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap'>
          <h5 className='table-title text-capitalize'>
            Most used applications{'  '}
            <span className='text-neutral-500 ml-1'>(daily)</span>
          </h5>
        </div>
      </div>

      <div className='card-body'>
        <div className='table-wrapper animated-list'>
          <table className='table trim-size mb-0'>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Smart Contract</th>
                <th>Total Txn</th>
              </tr>
            </thead>
            <tbody data-testid='contractsTable'>
              {data.map((contract, i) => (
                <tr key={contract.rank} className='text-lh-24'>
                  <td>{contract.rank}</td>
                  <td>
                    <AccountLink
                      address={contract.key}
                      assets={contract?.extraInfo?.assets as AccountAssetType}
                      data-testid={`contractLink${i}`}
                      linkClassName='text-primary-200'
                    />
                  </td>
                  <td className='text-center'>
                    {new BigNumber(contract.value).toFormat()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
