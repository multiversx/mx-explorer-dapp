import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';

import { AccountLink, Overlay } from 'components';
import { useActiveRoute } from 'hooks';
import { faHandshake, faHandHoldingHand } from 'icons/regular';
import { accountSelector } from 'redux/selectors';
import { accountsRoutes } from 'routes';
import { UITransactionType } from 'types';

export const TransactionRelayedIcon = ({
  transaction
}: {
  transaction: UITransactionType;
}) => {
  const { account } = useSelector(accountSelector);
  const activeRoute = useActiveRoute();

  const relayedText = transaction?.relayedVersion
    ? `Relayed Tx Version: ${transaction.relayedVersion}`
    : 'Relayed Transaction';

  const isRelayedByCurrentAccount =
    activeRoute(accountsRoutes.accountDetails) &&
    account?.address &&
    transaction?.relayer === account.address;

  if (transaction?.isRelayed) {
    return (
      <>
        <Overlay
          title={
            <>
              <p className='mb-0'>{relayedText}</p>
              {transaction?.relayer && !isRelayedByCurrentAccount && (
                <p className='mb-0'>
                  Transaction relayed by{' '}
                  <AccountLink address={transaction.relayer} />
                </p>
              )}
            </>
          }
          className='relayed-icon'
          persistent
        >
          <FontAwesomeIcon icon={faHandshake} className='text-primary me-1' />
        </Overlay>
        {isRelayedByCurrentAccount && (
          <Overlay
            title='Transaction relayed by current account'
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

  return null;
};
