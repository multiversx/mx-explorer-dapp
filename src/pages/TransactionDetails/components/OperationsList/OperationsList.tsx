import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ReactComponent as EgldSymbol } from 'assets/img/egld-token-logo.svg';
import {
  AccountLink,
  CopyButton,
  TransactionActionBlock,
  Denominate
} from 'components';
import { addressIsBech32, getOperationDirection } from 'helpers';
import { faChevronRight } from 'icons/solid';
import {
  UITransactionType,
  TransactionOperationType,
  TransactionOperationActionEnum,
  TransactionVisibleOperationEnum,
  TransactionOperationDirectionEnum
} from 'types';

const internalTransactionActions = [
  TransactionOperationActionEnum.create,
  TransactionOperationActionEnum.localMint,
  TransactionOperationActionEnum.ESDTLocalMint,
  TransactionOperationActionEnum.addQuantity,
  TransactionOperationActionEnum.burn,
  TransactionOperationActionEnum.localBurn,
  TransactionOperationActionEnum.ESDTLocalBurn,
  TransactionOperationActionEnum.wipe,
  TransactionOperationActionEnum.writeLog,
  TransactionOperationActionEnum.signalError
];

const getTicker = (identifier: string) => {
  if (!identifier) return '';

  const arr = identifier.split('-');
  if (arr.length > 0) {
    return arr[0];
  }

  return identifier;
};

const OperationToken = ({
  operation
}: {
  operation: TransactionOperationType;
}) => {
  const token = {
    type: operation.esdtType,
    name: operation.name,
    ticker: operation.svgUrl
      ? getTicker(operation.identifier)
      : operation.identifier,
    collection: operation.collection,
    identifier: operation.identifier,
    token: operation.identifier,
    decimals: operation.decimals,
    value: operation.value,
    svgUrl: operation.svgUrl,
    valueUSD: operation.valueUSD
  };
  switch (operation.type) {
    case 'nft':
      return <TransactionActionBlock.Nft token={token} />;
    case 'esdt':
      return <TransactionActionBlock.Token token={token} />;
    default:
      return <></>;
  }
};

const OperationBlock = ({
  address,
  transaction,
  operation,
  action,
  isFullSize,
  direction,
  isFirst
}: {
  address: string;
  transaction: UITransactionType;
  operation: TransactionOperationType;
  action?: string;
  isFullSize?: boolean;
  direction?: string;
  isFirst?: boolean;
}) => {
  let operationAssets;
  if (address === transaction.sender) {
    operationAssets = transaction.senderAssets;
  }
  if (address === transaction.receiver) {
    operationAssets = transaction.receiverAssets;
  }
  if (operation) {
    if (address === operation.sender) {
      operationAssets = operation.senderAssets;
    }
    if (address === operation.receiver) {
      operationAssets = operation.receiverAssets;
    }
  }

  return (
    <div
      className={`d-flex align-items-center ${
        isFullSize
          ? 'col-12'
          : ` pe-xl-0 ${
              operationAssets ? 'w-auto mw-lg-6 mw-xl-4' : 'col-lg-6 col-xl-4'
            }`
      }`}
    >
      {direction && (
        <div
          className={`me-2 badge badge-outline badge-rounded badge-direction ${direction.toLowerCase()}`}
        >
          {direction.toUpperCase()}
        </div>
      )}
      {!isFirst && action && (
        <FontAwesomeIcon
          icon={faChevronRight}
          size='sm'
          className='text-primary-200 me-2'
        />
      )}
      {action && (
        <div className='me-2 text-nowrap text-neutral-400'>{action}</div>
      )}
      {addressIsBech32(address) ? (
        <>
          <AccountLink address={address} assets={operationAssets} />
          <CopyButton text={address} className='side-action ms-2' />
        </>
      ) : (
        ''
      )}
    </div>
  );
};

const OperationText = ({
  operation,
  transaction
}: {
  operation: TransactionOperationType;
  transaction: UITransactionType;
}) => {
  const { direction } = getOperationDirection({
    operation,
    address: transaction.sender
  });

  switch (operation.action) {
    case TransactionOperationActionEnum.create:
    case TransactionOperationActionEnum.localMint:
    case TransactionOperationActionEnum.ESDTLocalMint:
      return (
        <OperationBlock
          transaction={transaction}
          operation={operation}
          address={operation.sender}
          action='Mint by'
          direction={TransactionOperationDirectionEnum.internal}
          isFirst
        />
      );
    case TransactionOperationActionEnum.addQuantity:
      return (
        <OperationBlock
          transaction={transaction}
          operation={operation}
          address={operation.sender}
          action='Add quantity by'
          direction={TransactionOperationDirectionEnum.internal}
          isFirst
        />
      );
    case TransactionOperationActionEnum.burn:
    case TransactionOperationActionEnum.localBurn:
    case TransactionOperationActionEnum.ESDTLocalBurn:
      return (
        <OperationBlock
          transaction={transaction}
          operation={operation}
          address={operation.sender}
          action='Burn by'
          direction={TransactionOperationDirectionEnum.internal}
          isFirst
        />
      );
    case TransactionOperationActionEnum.wipe:
      return (
        <OperationBlock
          transaction={transaction}
          operation={operation}
          address={operation.receiver}
          action='Wipe from'
          direction={TransactionOperationDirectionEnum.internal}
          isFirst
        />
      );
    case TransactionOperationActionEnum.multiTransfer:
      return (
        <>
          <OperationBlock
            transaction={transaction}
            operation={operation}
            address={operation.sender}
            action='Multi transfer from'
            direction={direction}
            isFirst
          />{' '}
          <OperationBlock
            transaction={transaction}
            operation={operation}
            address={operation.receiver}
            action='To'
          />
        </>
      );
    case TransactionOperationActionEnum.transfer:
      return (
        <>
          <OperationBlock
            transaction={transaction}
            operation={operation}
            address={operation.sender}
            action='Transfer from'
            direction={direction}
            isFirst
          />{' '}
          <OperationBlock
            transaction={transaction}
            operation={operation}
            address={operation.receiver}
            action='To'
          />
        </>
      );
    case TransactionOperationActionEnum.writeLog:
      return (
        <OperationBlock
          transaction={transaction}
          operation={operation}
          address={operation.sender}
          action='Write log by'
          direction={TransactionOperationDirectionEnum.internal}
          isFirst
          isFullSize
        />
      );
    case TransactionOperationActionEnum.signalError:
      return (
        <OperationBlock
          transaction={transaction}
          operation={operation}
          address={operation.sender}
          action='Signal error by'
          direction={TransactionOperationDirectionEnum.internal}
          isFirst
          isFullSize
        />
      );
    default:
      return (
        <>
          <OperationBlock
            transaction={transaction}
            operation={operation}
            address={operation.sender}
            action='From'
            direction={direction}
            isFirst
          />{' '}
          <OperationBlock
            transaction={transaction}
            operation={operation}
            address={operation.receiver}
            action='To'
          />
        </>
      );
  }
};

const OperationRow = ({
  operation,
  transaction
}: {
  operation: TransactionOperationType;
  transaction: UITransactionType;
}) => {
  switch (operation.type) {
    case TransactionVisibleOperationEnum.nft:
    case TransactionVisibleOperationEnum.esdt:
      return (
        <DetailedItem operation={operation} transaction={transaction}>
          <>
            {operation.esdtType === 'NonFungibleESDT' && (
              <div className='me-1 badge badge-outline badge-outline-yellow'>
                NFT
              </div>
            )}
            {operation.esdtType === 'SemiFungibleESDT' && (
              <div className='me-1 badge badge-outline badge-outline-orange'>
                SFT
              </div>
            )}
            <OperationToken operation={operation} />
          </>
        </DetailedItem>
      );

    case TransactionVisibleOperationEnum.egld:
      return (
        <DetailedItem operation={operation} transaction={transaction}>
          <div className='d-flex align-items-center symbol text-truncate'>
            <EgldSymbol className='side-icon me-1' />
            <span className='text-truncate'>
              <Denominate
                value={operation.value}
                showLastNonZeroDecimal={true}
              />
            </span>
          </div>
        </DetailedItem>
      );

    default:
      return <></>;
  }
};

const DetailedItem = ({
  children,
  operation,
  transaction
}: {
  children?: React.ReactNode;
  operation: TransactionOperationType;
  transaction: UITransactionType;
}) => {
  return (
    <div className='detailed-item d-flex row mb-2 mb-xl-1'>
      <OperationText operation={operation} transaction={transaction} />
      {children && (
        <div className='col d-flex align-items-center'>
          <div className='d-flex text-truncate'>{children}</div>
        </div>
      )}
    </div>
  );
};

export const OperationsList = ({
  transaction,
  operations
}: {
  transaction: UITransactionType;
  operations: TransactionOperationType[];
}) => {
  const initialDisplay = 25;
  const [expanded, setExpanded] = useState(false);

  const toggleCollapseClick = () => {
    setExpanded(!expanded);
  };

  const filteredOperations = operations.filter(
    (operation) =>
      !internalTransactionActions.includes(operation.action) &&
      (operation.sender === transaction.sender ||
        operation.receiver === transaction.sender)
  );
  const importantOperations =
    filteredOperations.length > 0 ? filteredOperations : operations;

  const displayOperations =
    importantOperations.length > initialDisplay
      ? importantOperations.slice(0, initialDisplay)
      : importantOperations;

  const collapsedOperations =
    importantOperations.length > initialDisplay
      ? importantOperations.slice(initialDisplay, importantOperations.length)
      : [];

  const buttonText = expanded
    ? filteredOperations.length > 0
      ? 'Show in/out operations'
      : 'Show fewer operations'
    : 'Show all operations';

  return (
    <div className='mb-n2'>
      <div className='operations-list d-flex flex-column text-lh-24'>
        {expanded ? (
          <>
            {operations.map((operation: TransactionOperationType, index) => (
              <div key={`display-${index}`}>
                <OperationRow operation={operation} transaction={transaction} />
              </div>
            ))}
          </>
        ) : (
          <>
            {displayOperations.map(
              (operation: TransactionOperationType, index) => (
                <div key={`display-${index}`}>
                  <OperationRow
                    operation={operation}
                    transaction={transaction}
                  />
                </div>
              )
            )}
          </>
        )}
      </div>
      {(displayOperations.length !== operations.length ||
        collapsedOperations.length > 0) && (
        <button
          className='btn btn-link btn-link-base text-primary-200'
          type='button'
          onClick={toggleCollapseClick}
          aria-controls='operations-list'
          aria-expanded={expanded}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};
