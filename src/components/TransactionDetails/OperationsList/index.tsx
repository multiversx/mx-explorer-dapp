import * as React from 'react';
import { faCaretRight } from '@fortawesome/pro-solid-svg-icons/faCaretRight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addressIsBech32, urlBuilder } from 'helpers';
import {
  OperationType,
  TransactionTokensType,
  TransactionOperationActionType,
  VisibleTransactionOperationType,
} from 'helpers/types';
import { NetworkLink, Trim, CopyButton, TokenBlock, NftBlock, Denominate } from 'sharedComponents';
import { TransactionType } from 'sharedComponents/TransactionsTable';

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
      direction = 'Out';
      break;
    case directionIn:
      direction = 'In';
      break;
    case directionSelf:
      direction = 'Self';
      break;
    case directionInternal:
      direction = 'Int';
      break;
  }

  return {
    direction,
  };
};

const OperationBlock = ({
  address,
  action,
  isFullSize,
  direction,
}: {
  address: string;
  action?: string;
  isFullSize?: boolean;
  direction?: string;
}) => {
  return (
    <div
      className={`d-flex align-items-center ${isFullSize ? 'col-12' : 'col-lg-6 col-xl-3 pr-xl-0'}`}
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
            <Trim text={address} color="secondary" />
          </NetworkLink>
          <CopyButton text={address} className="side-action ml-2" />
        </>
      ) : (
        ''
      )}
    </div>
  );
};

const OperationText = ({ operation, sender }: { operation: OperationType; sender: string }) => {
  const { direction } = getOperationDirection({ operation, address: sender });

  switch (operation.action) {
    case TransactionOperationActionType.create:
    case TransactionOperationActionType.localMint:
    case TransactionOperationActionType.ESDTLocalMint:
      return <OperationBlock address={operation.sender} action="Mint by" direction={direction} />;
    case TransactionOperationActionType.addQuantity:
      return (
        <OperationBlock address={operation.sender} action="Add quantity by" direction={direction} />
      );
    case TransactionOperationActionType.burn:
    case TransactionOperationActionType.localBurn:
    case TransactionOperationActionType.ESDTLocalBurn:
      return <OperationBlock address={operation.sender} action="Burn by" direction={direction} />;
    case TransactionOperationActionType.wipe:
      return (
        <OperationBlock address={operation.receiver} action="Wipe from" direction={direction} />
      );
    case TransactionOperationActionType.multiTransfer:
      return (
        <>
          <OperationBlock
            address={operation.sender}
            action="Multi transfer from"
            direction={direction}
          />{' '}
          <OperationBlock address={operation.receiver} action="To" />
        </>
      );
    case TransactionOperationActionType.transfer:
      return (
        <>
          <OperationBlock address={operation.sender} action="Transfer from" direction={direction} />{' '}
          <OperationBlock address={operation.receiver} action="To" />
        </>
      );
    case TransactionOperationActionType.writeLog:
      return (
        <OperationBlock
          address={operation.sender}
          action="Write log by"
          direction={direction}
          isFullSize
        />
      );
    case TransactionOperationActionType.signalError:
      return (
        <OperationBlock
          address={operation.sender}
          action="Signal error by"
          direction={direction}
          isFullSize
        />
      );
    default:
      return (
        <>
          <OperationBlock address={operation.sender} action="From" direction={direction} />{' '}
          <OperationBlock address={operation.receiver} action="To" />
        </>
      );
  }
};

const OperationRow = ({
  operation,
  transactionTokens,
  sender,
}: {
  operation: OperationType;
  transactionTokens?: TransactionTokensType;
  sender: string;
}) => {
  switch (operation.type) {
    case VisibleTransactionOperationType.nft:
      const operationNft = transactionTokens?.nfts.filter((token) => {
        return token.identifier === operation.identifier;
      });

      return operationNft?.length ? (
        <DetailedItem operation={operation} sender={sender}>
          <>
            {operationNft[0].type !== 'NonFungibleESDT' && <div className="mr-2">Value</div>}
            <NftBlock operationToken={operationNft[0]} value={operation.value} />
          </>
        </DetailedItem>
      ) : null;

    case VisibleTransactionOperationType.esdt:
      const operationToken = transactionTokens?.esdts.filter((token) => {
        return token.identifier === operation.identifier;
      });

      return operationToken?.length ? (
        <DetailedItem operation={operation} sender={sender}>
          <>
            <div className="mr-2">Value</div>
            <TokenBlock operationToken={operationToken[0]} value={operation.value} />
          </>
        </DetailedItem>
      ) : null;

    case VisibleTransactionOperationType.egld:
      return (
        <DetailedItem operation={operation} sender={sender}>
          <>
            <div className="mr-2">Value</div>
            <Denominate value={operation.value} showLastNonZeroDecimal={true} />
          </>
        </DetailedItem>
      );

    default:
      return null;
  }
};

const DetailedItem = ({
  children,
  operation,
  sender,
}: {
  children?: React.ReactNode;
  operation: OperationType;
  sender: string;
}) => {
  return (
    <div className="detailed-item d-flex row mb-3 mb-xl-2">
      <OperationText operation={operation} sender={sender} />
      {children && (
        <div className="col-lg-6 col-xl-6 d-flex align-items-center">
          <div className="d-flex text-truncate">{children}</div>
        </div>
      )}
    </div>
  );
};

const OperationsList = ({
  transaction,
  operations,
  transactionTokens,
}: {
  transaction: TransactionType;
  operations: OperationType[];
  transactionTokens?: TransactionTokensType;
}) => {
  const initialDisplay = 25;
  const [expanded, setExpanded] = React.useState(false);

  const toggleCollapseClick = (e: React.MouseEvent) => {
    setExpanded(!expanded);
  };

  const filteredOperations = operations.filter(
    (operation) =>
      operation.sender === transaction.sender || operation.receiver === transaction.sender
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

  return (
    <div className="mb-n2">
      <div className="operations-list d-flex flex-column">
        {expanded ? (
          <>
            {operations.map((operation: OperationType, index) => (
              <div key={`display-${index}`}>
                <OperationRow
                  operation={operation}
                  transactionTokens={transactionTokens}
                  sender={transaction.sender}
                />
              </div>
            ))}
          </>
        ) : (
          <>
            {displayOperations.map((operation: OperationType, index) => (
              <div key={`display-${index}`}>
                <OperationRow
                  operation={operation}
                  transactionTokens={transactionTokens}
                  sender={transaction.sender}
                />
              </div>
            ))}
          </>
        )}
      </div>
      {(filteredOperations.length !== operations.length || collapsedOperations.length > 0) &&
        !expanded && (
          <button
            className="btn btn-link btn-link-base"
            type="button"
            onClick={toggleCollapseClick}
            aria-controls="operations-list"
            aria-expanded={expanded}
          >
            Show all operations
          </button>
        )}
    </div>
  );
};

export default OperationsList;
