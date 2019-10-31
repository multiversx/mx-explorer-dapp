import React from 'react';
import moment from 'moment';
import { faFileCode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TestnetLink from './../../sharedComponents/TestnetLink';
import { TransactionType } from './index';
import { truncate, timeAgo, denominate } from './../../helpers';
import { useGlobalState } from '../../context';

type PropsType = {
  transaction: TransactionType;
};

// TODO: change filters truncate to truncate
// TODO: transaction.sender.includes('00000000000000000000') -> beginsWith

const TransactionRow: React.FC<PropsType> = ({ transaction }) => {
  const {
    activeTestnet: { denomination, decimals },
  } = useGlobalState();

  return (
    <tr className="animated fadeIn">
      <td>
        <TestnetLink to={`/transactions/${transaction.hash}`}>
          {truncate(transaction.hash, 20)}
        </TestnetLink>
      </td>
      <td>
        <TestnetLink to={`/block/${transaction.blockHash}`}>
          {truncate(transaction.blockHash, 20)}
        </TestnetLink>
      </td>
      <td>
        <span title={moment(transaction.timestamp * 1000).format('MMM DD, YYYY HH:mm:ss A')}>
          {timeAgo(transaction.timestamp * 1000)}
        </span>
      </td>
      <td>
        <TestnetLink to={`/shard/${transaction.senderShard}/page/1`}>
          {transaction.senderShard}
        </TestnetLink>
        &gt;
        <TestnetLink to={`/shard/${transaction.receiverShard}/page/1`}>
          {transaction.receiverShard}
        </TestnetLink>
      </td>
      <td>
        {transaction.sender.startsWith('00000000000000000000') && (
          <FontAwesomeIcon icon={faFileCode} className="w300 mr-1" />
        )}
        <TestnetLink to={`/address/${transaction.sender}`}>
          {truncate(transaction.sender, 20)}
        </TestnetLink>
      </td>
      <td>
        {transaction.receiver.startsWith('00000000000000000000') && (
          <FontAwesomeIcon icon={faFileCode} className="w300 mr-1" />
        )}
        <TestnetLink to={`/address/${transaction.receiver}`}>
          {truncate(transaction.receiver, 20)}
        </TestnetLink>
      </td>
      <td>
        {denominate({
          input: transaction.value,
          denomination,
          decimals,
          showAllDecimals: true,
        })}
      </td>
    </tr>
  );
};

export default TransactionRow;
