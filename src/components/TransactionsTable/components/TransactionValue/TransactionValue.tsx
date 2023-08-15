import React, { useState } from 'react';
import { faLayerPlus } from 'icons/regular';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import { Denominate, TransactionActionBlock } from 'components';
import { UITransactionType, NftTypeEnum, TransactionActionEnum } from 'types';

const getTransactionTokens = (transaction: UITransactionType) => {
  if (transaction.action) {
    return [
      ...(transaction.action.arguments?.token
        ? [transaction.action.arguments?.token]
        : []),
      ...(transaction.action.arguments?.token1
        ? [transaction.action.arguments?.token1]
        : []),
      ...(transaction.action.arguments?.token2
        ? [transaction.action.arguments?.token2]
        : []),
      ...(transaction.action.arguments?.transfers
        ? transaction.action.arguments?.transfers
        : [])
    ];
  }

  return [];
};

const OverlayTooltip = ({ tooltip, children }: any) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const renderTooltip = (props: any) => (
    <Tooltip
      className='extra-tokens-tooltip'
      id='extra-tokens-tooltip'
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      {...props}
    >
      {tooltip}
    </Tooltip>
  );

  const child = children ?? null;
  if (tooltip === undefined) {
    return child;
  }
  return (
    <OverlayTrigger
      show={showTooltip}
      trigger={['hover', 'focus']}
      delay={{ show: 250, hide: 300 }}
      overlay={renderTooltip}
    >
      <span
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {child}
      </span>
    </OverlayTrigger>
  );
};

const MultipleTokensBadge = ({
  transactionTokens
}: {
  transactionTokens: any[];
}) => {
  const Tooltip = (
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
    <OverlayTooltip tooltip={Tooltip}>
      <FontAwesomeIcon icon={faLayerPlus} className='ms-2 text-neutral-400' />
    </OverlayTooltip>
  );
};

export const TransactionValue = ({
  transaction,
  hideMultipleBadge
}: {
  transaction: UITransactionType;
  hideMultipleBadge?: boolean;
}) => {
  if (transaction.action) {
    if (
      transaction.action.name === TransactionActionEnum.wrapEgld ||
      transaction.action.name === TransactionActionEnum.unwrapEgld
    ) {
      return <Denominate value={transaction.value} />;
    }

    const transactionTokens = getTransactionTokens(transaction);

    if (transactionTokens.length) {
      const txToken = transactionTokens[0];
      return (
        <div className='d-flex align-items-center'>
          {Object.values(NftTypeEnum).includes(txToken.type) ? (
            <TransactionActionBlock.Nft token={txToken} showBadge />
          ) : (
            <TransactionActionBlock.Token token={txToken} />
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
