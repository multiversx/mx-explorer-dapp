import * as React from 'react';
import { TransactionsTableType } from 'sharedComponents/TransactionsTable';
import {
  AgeColumnFilters,
  FromColumnFilters,
  ShardColumnFilters,
  StatusColumnFilters,
  MethodColumnFilters,
  ToColumnFilters,
} from '../TransactionsFilters';

export const Header = ({ directionCol = false, allowFilters }: TransactionsTableType) => {
  return (
    <thead>
      <tr>
        <th scope="col">Txn Hash {allowFilters && <StatusColumnFilters />}</th>
        <th scope="col">Age {allowFilters && <AgeColumnFilters />}</th>
        <th scope="col">Shard {allowFilters && <ShardColumnFilters />}</th>
        <th scope="col">From {allowFilters && <FromColumnFilters />}</th>
        {directionCol && <th scope="col" />}
        <th scope="col">To {allowFilters && <ToColumnFilters />}</th>
        <th scope="col">Method {allowFilters && <MethodColumnFilters />}</th>
        <th scope="col">Value</th>
      </tr>
    </thead>
  );
};
