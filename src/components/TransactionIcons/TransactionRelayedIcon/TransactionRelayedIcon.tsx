import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';

import { AccountLink, Overlay } from 'components';
import { faHandshake, faHandHoldingHand } from 'icons/regular';
import { accountSelector } from 'redux/selectors';
import { UITransactionType } from 'types';

export const TransactionRelayedIcon = ({
  transaction
}: {
  transaction: UITransactionType;
}) => {
  const { account } = useSelector(accountSelector);

  const relayedText = transaction?.relayedVersion
    ? `Relayed Tx Version: ${transaction.relayedVersion}`
    : 'Relayed Transaction';

  if (transaction?.isRelayed) {
    const isRelayedByCurrentAccount =
      account?.address && transaction?.relayer === account.address;

    return (
      <>
        <Overlay title={relayedText} className='relayed-icon' persistent>
          <FontAwesomeIcon icon={faHandshake} className='text-primary me-1' />
        </Overlay>

        {transaction?.relayer && (
          <Overlay
            title={
              <>
                Transaction relayed by{' '}
                {isRelayedByCurrentAccount ? (
                  'current account'
                ) : (
                  <AccountLink address={transaction.relayer} />
                )}
              </>
            }
            className='relayed-icon'
            persistent
          >
            <FontAwesomeIcon
              icon={faHandHoldingHand}
              className='text-primary me-1'
            />
          </Overlay>
        )}
      </>
    );
  }

  if (transaction?.relayer) {
    return (
      <Overlay title={relayedText} className='relayed-icon' persistent>
        <FontAwesomeIcon icon={faHandshake} className='text-primary me-1' />
      </Overlay>
    );
  }

  return null;
};
