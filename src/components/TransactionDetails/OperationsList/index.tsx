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

const OperationBlock = ({
  address,
  action,
  isFullSize,
}: {
  address: string;
  action?: string;
  isFullSize?: boolean;
}) => {
  return (
    <div
      className={`d-flex align-items-center ${isFullSize ? 'col-12' : 'col-lg-6 col-xl-3 pr-xl-0'}`}
    >
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

const OperationText = ({ operation }: { operation: OperationType }) => {
  switch (operation.action) {
    case TransactionOperationActionType.create:
    case TransactionOperationActionType.localMint:
    case TransactionOperationActionType.ESDTLocalMint:
      return <OperationBlock address={operation.sender} action="Mint by" />;
    case TransactionOperationActionType.addQuantity:
      return <OperationBlock address={operation.sender} action="Add quantity by" />;
    case TransactionOperationActionType.burn:
    case TransactionOperationActionType.localBurn:
    case TransactionOperationActionType.ESDTLocalBurn:
      return <OperationBlock address={operation.sender} action="Burn by" />;
    case TransactionOperationActionType.wipe:
      return <OperationBlock address={operation.receiver} action="Wipe from" />;
    case TransactionOperationActionType.multiTransfer:
      return (
        <>
          <OperationBlock address={operation.sender} action="Multi transfer from" />{' '}
          <OperationBlock address={operation.receiver} action="To" />
        </>
      );
    case TransactionOperationActionType.transfer:
      return (
        <>
          <OperationBlock address={operation.sender} action="Transfer from" />{' '}
          <OperationBlock address={operation.receiver} action="To" />
        </>
      );
    case TransactionOperationActionType.writeLog:
      return <OperationBlock address={operation.sender} action="Write log by" isFullSize />;
    case TransactionOperationActionType.signalError:
      return <OperationBlock address={operation.sender} action="Signal error by" isFullSize />;
    default:
      return (
        <>
          <OperationBlock address={operation.sender} action="From" />{' '}
          <OperationBlock address={operation.receiver} action="To" />
        </>
      );
  }
};

const OperationRow = ({
  operation,
  transactionTokens,
}: {
  operation: OperationType;
  transactionTokens?: TransactionTokensType;
}) => {
  switch (operation.type) {
    case VisibleTransactionOperationType.nft:
      const operationNft = transactionTokens?.nfts.filter((token) => {
        return token.identifier === operation.identifier;
      });

      return operationNft?.length ? (
        <DetailedItem operation={operation}>
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
        <DetailedItem operation={operation}>
          <>
            <div className="mr-2">Value</div>
            <TokenBlock operationToken={operationToken[0]} value={operation.value} />
          </>
        </DetailedItem>
      ) : null;

    case VisibleTransactionOperationType.egld:
      return (
        <DetailedItem operation={operation}>
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
}: {
  children?: React.ReactNode;
  operation: OperationType;
}) => {
  return (
    <div className="detailed-item d-flex row mb-3 mb-xl-2">
      <OperationText operation={operation} />
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
                <OperationRow operation={operation} transactionTokens={transactionTokens} />
              </div>
            ))}
          </>
        ) : (
          <>
            {displayOperations.map((operation: OperationType, index) => (
              <div key={`display-${index}`}>
                <OperationRow operation={operation} transactionTokens={transactionTokens} />
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
            See all
          </button>
        )}
    </div>
  );
};

export default OperationsList;
