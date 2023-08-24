import React from 'react';
import { faLayerPlus } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Denominate, TransactionActionBlock, Overlay } from 'components';
import { getTransactionTokens } from 'helpers';
import { UITransactionType, NftTypeEnum, TransactionActionEnum } from 'types';

const MultipleTokensBadge = ({
  transactionTokens
}: {
  transactionTokens: any[];
}) => {
  const Tooltip = () => (
    <div className='py-2 px-1'>
      {transactionTokens.map((transactionToken, index) => (
        <div
          key={`tx-token-tooltip-${index}`}
          className={`d-flex align-items-center ${index > 0 ? 'pt-2' : ''}`}
        >
          {Object.values(NftTypeEnum).includes(transactionToken.type) ? (
            <TransactionActionBlock.Nft token={transactionToken} showBadge />
          ) : (
            <TransactionActionBlock.Token token={transactionToken} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <Overlay title={<Tooltip />}>
      <FontAwesomeIcon
        icon={faLayerPlus}
        className='ms-2 text-neutral-400 cursor-context'
      />
    </Overlay>
  );
};

export const TransactionValue = ({
  transaction,
  token,
  hideMultipleBadge
}: {
  transaction: UITransactionType;
  token?: string;
  hideMultipleBadge?: boolean;
}) => {
  if (transaction.action) {
    if (
      transaction.action.name === TransactionActionEnum.wrapEgld ||
      transaction.action.name === TransactionActionEnum.unwrapEgld
    ) {
      return <Denominate value={transaction.value} />;
    }

    const transactionTokens = getTransactionTokens({ transaction, token });

    if (transactionTokens.length) {
      const firstToken = transactionTokens[0];
      return (
        <div className='d-flex align-items-center'>
          {Object.values(NftTypeEnum).includes(firstToken.type) ? (
            <TransactionActionBlock.Nft token={firstToken} showBadge />
          ) : (
            <TransactionActionBlock.Token token={firstToken} />
          )}
          {!hideMultipleBadge && transactionTokens.length > 1 && (
            <MultipleTokensBadge transactionTokens={transactionTokens} />
          )}
        </div>
      );
    }
  }

  return <Denominate value={transaction.value} />;
};
