import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchange } from '@fortawesome/pro-regular-svg-icons/faExchange';
import { addressIsBech32, dateFormatted, urlBuilder, useNetworkRoute } from 'helpers';

import {
  Denominate,
  ScAddressIcon,
  ShardSpan,
  NetworkLink,
  TimeAgo,
  TransactionStatus,
  DetailItem,
  Trim,
  CopyButton,
} from 'sharedComponents';

export interface OperationType {
  action: string;
  type: string;
  identifier: string;
  sender: string;
  receiver: string;
  value: string;
}

const OperationSender = ({
  operation,
  size,
  action,
}: {
  operation: OperationType;
  size?: string;
  action?: string;
}) => {
  return operation.sender ? (
    <div className="col-lg-6 d-flex align-items-center col-xl-3 pr-xl-0">
      <div className="mr-2 text-nowrap">{action ? `${action} from ` : 'From'}</div>
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
  size,
  action,
}: {
  operation: OperationType;
  size?: string;
  action?: string;
}) => {
  return operation.receiver ? (
    <div className="col-lg-6 d-flex align-items-center col-xl-3 pr-xl-0">
      <div className="mr-2 text-nowrap">{action ? `${action} to ` : 'To'}</div>
      {addressIsBech32(operation.sender) ? (
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
    case 'create':
    case 'localMint':
      return <OperationReceiver operation={operation} size="lg" action="Mint" />;
    case 'burn':
      return <OperationSender operation={operation} size="lg" action="Burn" />;
    default:
      return (
        <>
          <OperationSender operation={operation} /> <OperationReceiver operation={operation} />
        </>
      );
  }
};

const OperationsList = ({ operations }: { operations: OperationType[] }) => {
  return (
    <div className="operations-list d-flex flex-column mb-n2">
      {operations.map((operation: OperationType, i) => {
        return (
          <div key={i} className="detailed-item d-flex row mb-3 mb-xl-2">
            <OperationText operation={operation} />

            {operation.value !== undefined &&
              operation.identifier !== undefined &&
              operation.type !== undefined && (
                <div className="col-lg-6 col-xl-6 d-flex align-items-center">
                  <div className="mr-2">Value</div>
                  <div className="d-flex flex-wrap">
                    {operation.type === 'nft' ? (
                      <div>
                        {operation.value} <span className="text-muted">{operation.identifier}</span>
                      </div>
                    ) : (
                      <Denominate token={operation.identifier} value={operation.value} />
                    )}
                  </div>
                </div>
              )}
          </div>
        );
      })}
    </div>
  );
};

export default OperationsList;
