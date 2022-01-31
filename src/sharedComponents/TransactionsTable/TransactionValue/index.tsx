import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerPlus } from '@fortawesome/pro-regular-svg-icons';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { UITransactionType, NftEnumType, TxActionsEnum } from 'helpers/types';
import { Denominate } from 'sharedComponents';
import NftValue from './NftValue';
import TokenValue from './TokenValue';

const MultipleTokensBadge = () => (
  <OverlayTrigger
    placement="top"
    delay={{ show: 0, hide: 400 }}
    overlay={(props) => (
      <Tooltip id="multiple-tooltip" {...props}>
        Multiple Tokens
      </Tooltip>
    )}
  >
    <FontAwesomeIcon icon={faLayerPlus} className="ml-2 text-muted" />
  </OverlayTrigger>
);

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
      const txToken = transactionTokens[0];

      switch (txToken.type) {
        case NftEnumType.SemiFungibleESDT:
        case NftEnumType.NonFungibleESDT:
        case NftEnumType.MetaESDT:
          return (
            <div className="transaction-value d-flex align-items-center">
              <NftValue token={txToken} />
              {transactionTokens.length > 1 && <MultipleTokensBadge />}
            </div>
          );

        case 'FungibleESDT':
          return (
            <div className="transaction-value d-flex align-items-center">
              <TokenValue token={txToken} />
              {transactionTokens.length > 1 && <MultipleTokensBadge />}
            </div>
          );

        default:
          return <Denominate value={transaction.value} />;
      }
    }
  }

  return <Denominate value={transaction.value} />;
};

export default TransactionValue;
