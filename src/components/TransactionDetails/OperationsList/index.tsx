import * as React from 'react';
import { faCaretRight } from '@fortawesome/pro-solid-svg-icons/faCaretRight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addressIsBech32, urlBuilder } from 'helpers';
import {
  OperationType,
  TransactionTokensType,
  TransactionOperationActionType,
  TransactionOperationType,
} from 'helpers/types';
import { NetworkLink, Trim, CopyButton, TokenBlock, NftBlock } from 'sharedComponents';

const OperationSender = ({
  operation,
  action,
  isFullSize,
}: {
  operation: OperationType;
  action?: string;
  isFullSize?: boolean;
}) => {
  return operation.sender ? (
    <div
      className={`d-flex align-items-center ${isFullSize ? 'col-12' : 'col-lg-6 col-xl-3 pr-xl-0'}`}
    >
      <FontAwesomeIcon icon={faCaretRight} size="xs" className="text-secondary mr-2" />
      <div className="mr-2 text-nowrap">{action ? action : 'From'}</div>
      {addressIsBech32(operation.sender) ? (
        <>
          <NetworkLink to={urlBuilder.accountDetails(operation.sender)} className="trim-wrapper">
            <Trim text={operation.sender} color="secondary" />
          </NetworkLink>
          <CopyButton text={operation.sender} className="side-action ml-2" />
        </>
      ) : (
        ''
      )}
    </div>
  ) : null;
};

const OperationReceiver = ({
  operation,
  action,
  isFullSize,
}: {
  operation: OperationType;
  action?: string;
  isFullSize?: boolean;
}) => {
  return operation.receiver ? (
    <div
      className={`d-flex align-items-center ${isFullSize ? 'col-12' : 'col-lg-6 col-xl-3 pr-xl-0'}`}
    >
      {action && <FontAwesomeIcon icon={faCaretRight} size="xs" className="text-secondary mr-2" />}
      <div className="mr-2 text-nowrap">{action ? action : 'To'}</div>
      {addressIsBech32(operation.receiver) ? (
        <>
          <NetworkLink to={urlBuilder.accountDetails(operation.receiver)} className="trim-wrapper">
            <Trim text={operation.receiver} color="secondary" />
          </NetworkLink>
          <CopyButton text={operation.receiver} className="side-action ml-2" />
        </>
      ) : (
        ''
      )}
    </div>
  ) : null;
};

const OperationText = ({ operation }: { operation: OperationType }) => {
  switch (operation.action) {
    case TransactionOperationActionType.create:
    case TransactionOperationActionType.localMint:
    case TransactionOperationActionType.ESDTLocalMint:
      return <OperationSender operation={operation} action="Mint by" />;
    case TransactionOperationActionType.addQuantity:
      return <OperationSender operation={operation} action="Add quantity by" />;
    case TransactionOperationActionType.burn:
    case TransactionOperationActionType.localBurn:
    case TransactionOperationActionType.ESDTLocalBurn:
      return <OperationSender operation={operation} action="Burn by" />;
    case TransactionOperationActionType.wipe:
      return <OperationReceiver operation={operation} action="Wipe from" />;
    case TransactionOperationActionType.multiTransfer:
      return (
        <>
          <OperationSender operation={operation} action="Multi transfer from" />{' '}
          <OperationReceiver operation={operation} />
        </>
      );
    case TransactionOperationActionType.transfer:
      return (
        <>
          <OperationSender operation={operation} action="Transfer from" />{' '}
          <OperationReceiver operation={operation} />
        </>
      );
    case TransactionOperationActionType.writeLog:
      return <OperationSender operation={operation} action="Write log by" isFullSize />;
    case TransactionOperationActionType.signalError:
      return <OperationSender operation={operation} action="Signal error by" isFullSize />;
    default:
      return (
        <>
          <OperationSender operation={operation} /> <OperationReceiver operation={operation} />
        </>
      );
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
  operations,
  transactionTokens,
}: {
  operations: OperationType[];
  transactionTokens?: TransactionTokensType;
}) => {
  return (
    <div className="operations-list d-flex flex-column mb-n2">
      {operations.map((operation: OperationType, index) => {
        switch (operation.type) {
          case TransactionOperationType.nft:
            if (operation.value !== null && operation.identifier !== null) {
              const operationNft = transactionTokens?.nfts.filter((token) => {
                return token.identifier === operation.identifier;
              });

              return operationNft?.length ? (
                <DetailedItem operation={operation} key={index}>
                  <>
                    {operationNft[0].type !== 'NonFungibleESDT' && (
                      <div className="mr-2">Value</div>
                    )}
                    <NftBlock operationToken={operationNft[0]} value={operation.value} />
                  </>
                </DetailedItem>
              ) : null;
            }
            return null;

          case TransactionOperationType.esdt:
            if (operation.value !== null && operation.identifier !== null) {
              const operationToken = transactionTokens?.esdts.filter((token) => {
                return token.identifier === operation.identifier;
              });
              return operationToken?.length ? (
                <DetailedItem operation={operation} key={index}>
                  <>
                    <div className="mr-2">Value</div>
                    <TokenBlock operationToken={operationToken[0]} value={operation.value} />
                  </>
                </DetailedItem>
              ) : null;
            }
            return null;

          default:
            return null;
        }
      })}
    </div>
  );
};

export default OperationsList;
