import { ReactNode } from 'react';

import { AccountLink, ColSpanWrapper, PageState } from 'components';
import { formatBigNumber, NeighborType } from 'helpers';
import { faExchangeAlt } from 'icons/regular';
import { AccountAssetType, WithClassnameType } from 'types';

interface TransactionInteractionTableUIType extends WithClassnameType {
  title: ReactNode;
  interactions: NeighborType[];
  showSentAndReceived?: boolean;
}

export const TransactionInteractionTable = ({
  title,
  showSentAndReceived = true,
  interactions
}: TransactionInteractionTableUIType) => {
  return (
    <div className='card border h-100'>
      <div className='card-header'>
        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap'>
          <div className='h5 table-title text-capitalize w-100'>{title}</div>
        </div>
      </div>

      <div className='card-body'>
        <div className='table-wrapper animated-list'>
          <table className='table trim-size mb-0'>
            <thead>
              <tr>
                <th>#</th>
                <th>Address</th>
                {showSentAndReceived && (
                  <>
                    <th>Received Txn</th>
                    <th>Send Txn</th>
                  </>
                )}
                <th>Txn Count</th>
              </tr>
            </thead>
            <tbody data-testid='neighborTable'>
              {interactions.length === 0 ? (
                <ColSpanWrapper colSpan={showSentAndReceived ? 5 : 3}>
                  <PageState
                    icon={faExchangeAlt}
                    title='No transactions'
                    className='py-spacer my-auto'
                  />
                </ColSpanWrapper>
              ) : (
                <>
                  {interactions.map((interaction, i) => (
                    <tr key={interaction.address} className='text-lh-24'>
                      <td>{i + 1}</td>
                      <td>
                        <AccountLink
                          address={interaction.address}
                          assets={interaction?.assets as AccountAssetType}
                          data-testid={`interactionLink${i}`}
                          linkClassName='text-primary-200'
                        />
                      </td>
                      {showSentAndReceived && (
                        <>
                          <td className='text-center'>
                            {formatBigNumber({ value: interaction.received })}
                          </td>
                          <td className='text-center'>
                            {formatBigNumber({ value: interaction.sent })}
                          </td>
                        </>
                      )}
                      <td className='text-center'>
                        {formatBigNumber({ value: interaction.total })}
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
