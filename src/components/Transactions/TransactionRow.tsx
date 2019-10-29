import React from 'react';
import moment from 'moment';
import { faFileCode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { TransactionType } from './index';
import filters from './../../helpers/filters';
import { useCurrentTestnet } from '../../context';

type PropsType = {
  transaction: TransactionType;
};

const TransactionRow: React.FC<PropsType> = ({ transaction }) => {
  const { denomination, decimals } = useCurrentTestnet();

  return (
    <tr className="animated fadeIn">
      <td>
        <Link to={`/transactions/${transaction.hash}`}>
          {filters.truncate(transaction.hash, 20)}
        </Link>
      </td>
      <td>
        <Link to={`/block/${transaction.blockHash}`}>
          {filters.truncate(transaction.blockHash, 20)}
        </Link>
      </td>
      <td>
        <span title={moment(transaction.timestamp * 1000).format('MMM DD, YYYY HH:mm:ss A')}>
          {filters.timestampAge(transaction.timestamp * 1000)}
        </span>
      </td>
      <td>
        <Link to={`/shard/${transaction.senderShard}/page/1`}>{transaction.senderShard}</Link>
        &gt;
        <Link to={`/shard/${transaction.receiverShard}/page/1`}>{transaction.receiverShard}</Link>
      </td>
      <td>
        {transaction.sender.includes('00000000000000000000') && (
          <FontAwesomeIcon icon={faFileCode} className="w300 mr-1" />
        )}
        <Link to={`/address/${transaction.sender}`}>{transaction.sender}</Link>
      </td>
      <td>
        {transaction.receiver.includes('00000000000000000000') && (
          <FontAwesomeIcon icon={faFileCode} className="w300 mr-1" />
        )}
        <Link to={`/address/${transaction.receiver}`}>
          {filters.truncate(transaction.receiver, 20)}
        </Link>
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
