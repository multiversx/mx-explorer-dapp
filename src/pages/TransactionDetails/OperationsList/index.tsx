import * as React from 'react';
import { faCaretRight } from '@fortawesome/pro-solid-svg-icons/faCaretRight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addressIsBech32, urlBuilder } from 'helpers';
import {
  OperationType,
  TransactionOperationActionType,
  VisibleTransactionOperationType,
} from 'types';
import { NetworkLink, AccountName, CopyButton, TxActionBlock, Denominate } from 'components';
import { UITransactionType } from 'types';

export enum OperationDirectionEnum {
  out = 'out',
  in = 'in',
  self = 'self',
  internal = 'int',
}

const internalTransactionActions = [
  TransactionOperationActionType.create,
  TransactionOperationActionType.localMint,
  TransactionOperationActionType.ESDTLocalMint,
  TransactionOperationActionType.addQuantity,
  TransactionOperationActionType.burn,
  TransactionOperationActionType.localBurn,
  TransactionOperationActionType.ESDTLocalBurn,
  TransactionOperationActionType.wipe,
  TransactionOperationActionType.writeLog,
  TransactionOperationActionType.signalError,
];

const getTicker = (identifier: string) => {
  if (!identifier) return '';

  const arr = identifier.split('-');
  if (arr.length > 0) {
    return arr[0];
  }

  return identifier;
};

export const getOperationDirection = ({
  operation,
  address,
}: {
  operation: OperationType;
  address: string;
}) => {
  const directionOut = address === operation.sender;
  const directionIn = address === operation.receiver;
  const directionSelf = directionOut && directionIn;
  const directionInternal = !directionSelf;

  let direction = '';
  switch (true) {
    case directionOut:
      direction = OperationDirectionEnum.out;
      break;
    case directionIn:
      direction = OperationDirectionEnum.in;
      break;
    case directionSelf:
      direction = OperationDirectionEnum.self;
      break;
    case directionInternal:
      direction = OperationDirectionEnum.internal;
      break;
  }

  return {
    direction,
  };
};

const OperationToken = ({ operation }: { operation: OperationType }) => {
  const token = {
    type: operation.esdtType,
    name: operation.name,
    ticker: operation.svgUrl ? getTicker(operation.identifier) : operation.identifier,
    collection: operation.collection,
    identifier: operation.identifier,
    token: operation.identifier,
    decimals: operation.decimals,
    value: operation.value,
    svgUrl: operation.svgUrl,
    valueUSD: operation.valueUSD,
  };
  switch (operation.type) {
    case 'nft':
      return <TxActionBlock.Nft token={token} />;
    case 'esdt':
      return <TxActionBlock.Token token={token} />;
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
}: {
  address: string;
  transaction: UITransactionType;
  operation: OperationType;
  action?: string;
  isFullSize?: boolean;
  direction?: string;
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
          : ` pr-xl-0 ${operationAssets ? 'pl-3 mw-lg-6 mw-xl-4' : 'col-lg-6 col-xl-4'}`
      }`}
    >
      {direction && (
        <div className={`direction-badge mr-2 ${direction.toLowerCase()}`}>
          {direction.toUpperCase()}
        </div>
      )}
      {action && <FontAwesomeIcon icon={faCaretRight} size="xs" className="text-secondary mr-2" />}
      <div className="mr-2 text-nowrap">{action ? action : ''}</div>
      {addressIsBech32(address) ? (
        <>
          <NetworkLink to={urlBuilder.accountDetails(address)} className="trim-wrapper">
            <AccountName address={address} assets={operationAssets} />
          </NetworkLink>
          <CopyButton text={address} className="side-action ml-2" />
        </>
      ) : (
        ''
      )}
    </div>
  );
};

const OperationText = ({
  operation,
  transaction,
}: {
  operation: OperationType;
  transaction: UITransactionType;
}) => {
  const { direction } = getOperationDirection({ operation, address: transaction.sender });

  switch (operation.action) {
    case TransactionOperationActionType.create:
    case TransactionOperationActionType.localMint:
    case TransactionOperationActionType.ESDTLocalMint:
      return (
        <OperationBlock
          transaction={transaction}
          operation={operation}
          address={operation.sender}
          action="Mint by"
          direction={OperationDirectionEnum.internal}
        />
      );
    case TransactionOperationActionType.addQuantity:
      return (
        <OperationBlock
          transaction={transaction}
          operation={operation}
          address={operation.sender}
          action="Add quantity by"
          direction={OperationDirectionEnum.internal}
        />
      );
    case TransactionOperationActionType.burn:
    case TransactionOperationActionType.localBurn:
    case TransactionOperationActionType.ESDTLocalBurn:
      return (
        <OperationBlock
          transaction={transaction}
          operation={operation}
          address={operation.sender}
          action="Burn by"
          direction={OperationDirectionEnum.internal}
        />
      );
    case TransactionOperationActionType.wipe:
      return (
        <OperationBlock
          transaction={transaction}
          operation={operation}
          address={operation.receiver}
          action="Wipe from"
          direction={OperationDirectionEnum.internal}
        />
      );
    case TransactionOperationActionType.multiTransfer:
      return (
        <>
          <OperationBlock
            transaction={transaction}
            operation={operation}
            address={operation.sender}
            action="Multi transfer from"
            direction={direction}
          />{' '}
          <OperationBlock
            transaction={transaction}
            operation={operation}
            address={operation.receiver}
            action="To"
          />
        </>
      );
    case TransactionOperationActionType.transfer:
      return (
        <>
          <OperationBlock
            transaction={transaction}
            operation={operation}
            address={operation.sender}
            action="Transfer from"
            direction={direction}
          />{' '}
          <OperationBlock
            transaction={transaction}
            operation={operation}
            address={operation.receiver}
            action="To"
          />
        </>
      );
    case TransactionOperationActionType.writeLog:
      return (
        <OperationBlock
          transaction={transaction}
          operation={operation}
          address={operation.sender}
          action="Write log by"
          direction={OperationDirectionEnum.internal}
          isFullSize
        />
      );
    case TransactionOperationActionType.signalError:
      return (
        <OperationBlock
          transaction={transaction}
          operation={operation}
          address={operation.sender}
          action="Signal error by"
          direction={OperationDirectionEnum.internal}
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
            action="From"
            direction={direction}
          />{' '}
          <OperationBlock
            transaction={transaction}
            operation={operation}
            address={operation.receiver}
            action="To"
          />
        </>
      );
  }
};

const OperationRow = ({
  operation,
  transaction,
}: {
  operation: OperationType;
  transaction: UITransactionType;
}) => {
  switch (operation.type) {
    case VisibleTransactionOperationType.nft:
    case VisibleTransactionOperationType.esdt:
      return (
        <DetailedItem operation={operation} transaction={transaction}>
          <>
            {operation.esdtType === 'NonFungibleESDT' && <div className="mr-1">NFT</div>}
            {operation.esdtType === 'SemiFungibleESDT' && <div className="mr-1">SFT quantity</div>}
            <OperationToken operation={operation} />
          </>
        </DetailedItem>
      );

    case VisibleTransactionOperationType.egld:
      return (
        <DetailedItem operation={operation} transaction={transaction}>
          <>
            <div className="mr-2">Value</div>
            <Denominate value={operation.value} showLastNonZeroDecimal={true} />
          </>
        </DetailedItem>
      );

    default:
      return <></>;
  }
};

const DetailedItem = ({
  children,
  operation,
  transaction,
}: {
  children?: React.ReactNode;
  operation: OperationType;
  transaction: UITransactionType;
}) => {
  return (
    <div className="detailed-item d-flex row mb-3 mb-xl-2">
      <OperationText operation={operation} transaction={transaction} />
      {children && (
        <div className="col d-flex align-items-center">
          <div className="d-flex text-truncate">{children}</div>
        </div>
      )}
    </div>
  );
};

export const OperationsList = ({
  transaction,
  operations,
}: {
  transaction: UITransactionType;
  operations: OperationType[];
}) => {
  const initialDisplay = 25;
  const [expanded, setExpanded] = React.useState(false);

  const toggleCollapseClick = (e: React.MouseEvent) => {
    setExpanded(!expanded);
  };

  const filteredOperations = operations.filter(
    (operation) =>
      !internalTransactionActions.includes(operation.action) &&
      (operation.sender === transaction.sender || operation.receiver === transaction.sender)
  );
  const importantOperations = filteredOperations.length > 0 ? filteredOperations : operations;

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
    <div className="mb-n2">
      <div className="operations-list d-flex flex-column">
        {expanded ? (
          <>
            {operations.map((operation: OperationType, index) => (
              <div key={`display-${index}`}>
                <OperationRow operation={operation} transaction={transaction} />
              </div>
            ))}
          </>
        ) : (
          <>
            {displayOperations.map((operation: OperationType, index) => (
              <div key={`display-${index}`}>
                <OperationRow operation={operation} transaction={transaction} />
              </div>
            ))}
          </>
        )}
      </div>
      {(displayOperations.length !== operations.length || collapsedOperations.length > 0) && (
        <button
          className="btn btn-link btn-link-base"
          type="button"
          onClick={toggleCollapseClick}
          aria-controls="operations-list"
          aria-expanded={expanded}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};