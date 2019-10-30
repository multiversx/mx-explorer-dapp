import React from 'react';
import moment from 'moment';
import { faFileCode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TestnetLink from './../../sharedComponents/TestnetLink';
import { TransactionType } from './index';
import filters from './../../helpers/filters';
import { useGlobalState } from '../../context';

type PropsType = {
  transaction: TransactionType;
};

const TransactionRow: React.FC<PropsType> = ({ transaction }) => {
  const {
    activeTestnet: { denomination, decimals },
  } = useGlobalState();

  return (
    <tr className="animated fadeIn">
      <td>
        <TestnetLink to={`/transactions/${transaction.hash}`}>
          {filters.truncate(transaction.hash, 20)}
        </TestnetLink>
      </td>
      <td>
        <TestnetLink to={`/block/${transaction.blockHash}`}>
          {filters.truncate(transaction.blockHash, 20)}
        </TestnetLink>
      </td>
      <td>
        <span title={moment(transaction.timestamp * 1000).format('MMM DD, YYYY HH:mm:ss A')}>
          {filters.timestampAge(transaction.timestamp * 1000)}
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
        {transaction.sender.includes('00000000000000000000') && (
          <FontAwesomeIcon icon={faFileCode} className="w300 mr-1" />
        )}
        <TestnetLink to={`/address/${transaction.sender}`}>{transaction.sender}</TestnetLink>
      </td>
      <td>
        {transaction.receiver.includes('00000000000000000000') && (
          <FontAwesomeIcon icon={faFileCode} className="w300 mr-1" />
        )}
        <TestnetLink to={`/address/${transaction.receiver}`}>
          {filters.truncate(transaction.receiver, 20)}
        </TestnetLink>
      </td>
      <td>
        {filters.denominate({
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
