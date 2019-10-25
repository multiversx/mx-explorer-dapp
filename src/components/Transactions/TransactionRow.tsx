import React from 'react';
import { TransactionType } from './index';
import filters from './../../helpers/filters';

type PropsType = {
  transaction: TransactionType;
};

const TransactionRow: React.FC<PropsType> = ({ transaction }) => (
  <tr className="animated fadeIn">
    <td>
      <a href="/#/tx/{{ tx.hash }}">{filters.truncate(transaction.hash, 20)}</a>
    </td>
    <td>
      <a href="./#/block/{{ tx.blockHash }}">{filters.truncate(transaction.blockHash, 20)}</a>
    </td>
    <td>
      <span title="{{ tx.timestamp * 1000 | date:'medium' }}">{transaction.timestamp}</span>
    </td>
    <td>
      <a href="/#/shard/{{ tx.senderShard }}/page/1" className="d-inline">
        {transaction.senderShard}
      </a>
      &gt;
      <a href="/#/shard/{{ tx.receiverShard }}/page/1" className="d-inline">
        {transaction.receiverShard}
      </a>
    </td>
    <td>
      <i
        ng-show="(tx.sender | limitTo : 20) == '00000000000000000000'"
        className="fa fa-file-code w300 mr-1"
      />
      <a
        href="/#/address/{{ tx.sender}}"
        ng-show="tx.sender != addressId && checkAddress(tx.sender)"
      >
        {transaction.sender}
      </a>
    </td>
    <td>
      <i
        ng-show="(tx.receiver | limitTo : 20) == '00000000000000000000'"
        className="fa fa-file-code w300 mr-1"
      />
      <a href="/#/address/{{ tx.receiver}}">{filters.truncate(transaction.receiver, 20)}</a>
    </td>
    <td>{transaction.value}</td>
  </tr>
);

export default TransactionRow;
