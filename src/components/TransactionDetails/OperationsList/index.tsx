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
import { NetworkLink, Trim, CopyButton, TokenBlock, NftBlock, Denominate } from 'sharedComponents';

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
            const operationNft = transactionTokens?.nfts.filter((token) => {
              return token.identifier === operation.identifier;
            });

            return operationNft?.length ? (
              <DetailedItem operation={operation} key={index}>
                <>
                  {operationNft[0].type !== 'NonFungibleESDT' && <div className="mr-2">Value</div>}
                  <NftBlock operationToken={operationNft[0]} value={operation.value} />
                </>
              </DetailedItem>
            ) : null;

          case TransactionOperationType.esdt:
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

          case TransactionOperationType.egld:
            return (
              <DetailedItem operation={operation} key={index}>
                <>
                  <div className="mr-2">Value</div>
                  <Denominate value={operation.value} showLastNonZeroDecimal={true} />
                </>
              </DetailedItem>
            );

          default:
            return null;
        }
      })}
    </div>
  );
};

export default OperationsList;
