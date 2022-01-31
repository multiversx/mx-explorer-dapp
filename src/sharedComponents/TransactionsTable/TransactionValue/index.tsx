import React from 'react';
import { UITransactionType, NftEnumType, TxActionsEnum } from 'helpers/types';
import { Denominate } from 'sharedComponents';
import NftValue from './NftValue';
import TokenValue from './TokenValue';

const TransactionValue = ({ transaction }: { transaction: UITransactionType }) => {
  if (transaction.action) {
    if (
      transaction.action.name === TxActionsEnum.wrapEgld ||
      transaction.action.name === TxActionsEnum.unwrapEgld
    ) {
      return <Denominate value={transaction.value} />;
    }

    const transactionTokens = [
      ...(transaction.action.arguments?.token ? [transaction.action.arguments?.token] : []),
      ...(transaction.action.arguments?.token1 ? [transaction.action.arguments?.token1] : []),
      ...(transaction.action.arguments?.token2 ? [transaction.action.arguments?.token2] : []),
      ...(transaction.action.arguments?.transfers ? transaction.action.arguments?.transfers : []),
    ];

    if (transactionTokens.length) {
      return (
        <>
          {transactionTokens.map((token, index) => {
            switch (token.type) {
              case NftEnumType.SemiFungibleESDT:
              case NftEnumType.NonFungibleESDT:
              case NftEnumType.MetaESDT:
                return (
                  <div
                    key={`${transaction.txHash}-value-${index}`}
                    className={index > 0 ? 'mt-1' : ''}
                  >
                    <NftValue token={token} />
                  </div>
                );

              case 'FungibleESDT':
                return (
                  <div
                    key={`${transaction.txHash}-value-${index}`}
                    className={index > 0 ? 'mt-1' : ''}
                  >
                    <TokenValue token={token} />
                  </div>
                );

              default:
                return (
                  <div
                    key={`${transaction.txHash}-value-${index}`}
                    className={index > 0 ? 'mt-1' : ''}
                  >
                    <Denominate value={transaction.value} />
                  </div>
                );
            }
          })}
        </>
      );
    }
  }

  return <Denominate value={transaction.value} />;
};

export default TransactionValue;
