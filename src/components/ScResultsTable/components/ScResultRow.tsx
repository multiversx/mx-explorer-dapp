import {
  ScAddressIcon,
  NetworkLink,
  TimeAgo,
  Trim,
  Denominate,
  AccountLink
} from 'components';
import { TransactionSCResultType } from 'types';

export interface ScResultRowType {
  scResult: TransactionSCResultType;
  address?: string;
}

export const ScResultRow = ({ scResult, address }: ScResultRowType) => {
  const directionOut = address === scResult.sender;
  const directionIn = address === scResult.receiver;

  const transactionLink = `/transactions/${
    scResult.originalTxHash
      ? `${scResult.originalTxHash}#${scResult.hash}`
      : scResult.hash
  }`;

  return (
    <tr className='animated-row trim-size-sm'>
      <td>
        <div className='d-flex align-items-center trim-size-xl'>
          <NetworkLink
            to={transactionLink}
            data-testid='transactionLink'
            className='trim-wrapper'
          >
            <Trim text={scResult.hash} />
          </NetworkLink>
        </div>
      </td>
      <td>
        <TimeAgo value={scResult.timestamp} tooltip /> ago &nbsp;
      </td>
      <td>
        <div className='d-flex align-items-center'>
          <ScAddressIcon initiator={scResult.sender} />
          {directionOut ? (
            <Trim text={scResult.sender} />
          ) : (
            <AccountLink address={scResult.sender} data-testid='senderLink' />
          )}
        </div>
      </td>
      <td>
        <div className='d-flex align-items-center'>
          <ScAddressIcon initiator={scResult.receiver} />
          {directionIn ? (
            <Trim text={scResult.receiver} />
          ) : (
            <AccountLink
              address={scResult.receiver}
              data-testid='receiverLink'
            />
          )}
        </div>
      </td>
      <td>
        <Denominate value={scResult.value} />
      </td>
    </tr>
  );
};
