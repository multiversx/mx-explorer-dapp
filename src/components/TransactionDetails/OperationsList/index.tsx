import * as React from 'react';
import { faCaretRight } from '@fortawesome/pro-solid-svg-icons/faCaretRight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addressIsBech32, urlBuilder, types } from 'helpers';
import { NetworkLink, Trim, CopyButton, TokenBlock, NftBlock } from 'sharedComponents';

const OperationSender = ({
  operation,
  action,
}: {
  operation: types.OperationType;
  action?: string;
}) => {
  return operation.sender ? (
    <div className="col-lg-6 d-flex align-items-center col-xl-3 pr-xl-0">
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
}: {
  operation: types.OperationType;
  action?: string;
}) => {
  return operation.receiver ? (
    <div className="col-lg-6 d-flex align-items-center col-xl-3 pr-xl-0">
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

const OperationText = ({ operation }: { operation: types.OperationType }) => {
  switch (operation.action) {
    case 'create':
    case 'localMint':
    case 'ESDTLocalMint':
      return <OperationSender operation={operation} action="Mint to" />;
    case 'addQuantity':
      return <OperationSender operation={operation} action="Add quantity to" />;
    case 'burn':
    case 'localBurn':
    case 'ESDTLocalBurn':
      return <OperationSender operation={operation} action="Burn from" />;
    case 'wipe':
      return <OperationSender operation={operation} action="Wipe from" />;
    case 'multiTransfer':
      return (
        <>
          <OperationSender operation={operation} action="Multi transfer from" />{' '}
          <OperationReceiver operation={operation} />
        </>
      );
    case 'transfer':
      return (
        <>
          <OperationSender operation={operation} action="Transfer from" />{' '}
          <OperationReceiver operation={operation} />
        </>
      );
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
  children: React.ReactNode;
  operation: types.OperationType;
}) => {
  return (
    <div className="detailed-item d-flex row mb-3 mb-xl-2">
      <OperationText operation={operation} />
      <div className="col-lg-6 col-xl-6 d-flex align-items-center">
        <div className="d-flex text-truncate">{children}</div>
      </div>
    </div>
  );
};

const OperationsList = ({
  operations,
  transactionTokens,
}: {
  operations: types.OperationType[];
  transactionTokens?: types.TransactionTokensType;
}) => {
  return (
    <div className="operations-list d-flex flex-column mb-n2">
      {operations.map((operation: types.OperationType, i) => {
        if (
          operation.value !== undefined &&
          operation.identifier !== undefined &&
          operation.type !== undefined
        ) {
          switch (operation.type) {
            case 'nft':
              const operationNft = transactionTokens?.nfts.filter((token) => {
                return token.identifier === operation.identifier;
              });

              return operationNft?.length ? (
                <DetailedItem operation={operation} key={i}>
                  <>
                    {operationNft[0].type !== 'NonFungibleESDT' && (
                      <div className="mr-2">Value</div>
                    )}
                    <NftBlock operationToken={operationNft[0]} value={operation.value} />
                  </>
                </DetailedItem>
              ) : null;

            case 'esdt':
              const operationToken = transactionTokens?.esdts.filter((token) => {
                return token.identifier === operation.identifier;
              });
              return operationToken?.length ? (
                <DetailedItem operation={operation} key={i}>
                  <>
                    <div className="mr-2">Value</div>
                    <TokenBlock operationToken={operationToken[0]} value={operation.value} />
                  </>
                </DetailedItem>
              ) : null;
          }
        }
        return null;
      })}
    </div>
  );
};

export default OperationsList;
