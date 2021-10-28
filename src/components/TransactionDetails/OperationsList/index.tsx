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

const OperationsList = ({ operations }: { operations: OperationType[] }) => {
  return (
    <div className="operations-list d-flex flex-column mb-n2">
      {operations.map((operation: OperationType, i) => {
        return (
          <div key={i} className="detailed-item d-flex row mb-3 mb-xl-2">
            {operation.sender && (
              <div className="col-lg-6 col-xl-3 d-flex align-items-center">
                <div className="mr-2">From</div>
                {addressIsBech32(operation.sender) ? (
                  <>
                    <NetworkLink
                      to={urlBuilder.accountDetails(operation.sender)}
                      className="trim-wrapper"
                    >
                      <Trim text={operation.sender} color="secondary" />
                    </NetworkLink>
                    <CopyButton text={operation.sender} className="side-action ml-2" />
                  </>
                ) : (
                  ''
                )}
              </div>
            )}

            {operation.receiver && (
              <div className="col-lg-6 col-xl-3 d-flex align-items-center pl-xl-0">
                <div className="mr-2">To</div>
                {addressIsBech32(operation.sender) ? (
                  <>
                    <NetworkLink
                      to={urlBuilder.accountDetails(operation.receiver)}
                      className="trim-wrapper"
                    >
                      <Trim text={operation.receiver} color="secondary" />
                    </NetworkLink>
                    <CopyButton text={operation.receiver} className="side-action ml-2" />
                  </>
                ) : (
                  ''
                )}
              </div>
            )}

            {operation.value !== undefined && operation.identifier !== undefined && (
              <div className="col-lg-6 col-xl-5 d-flex align-items-center px-xl-0">
                <div className="mr-2">Value</div>
                <div className="d-flex flex-wrap">
                  <Denominate
                    token={operation.identifier}
                    value={operation.value}
                    showLastNonZeroDecimal
                  />
                </div>
              </div>
            )}

            {operation.action !== undefined && operation.type !== undefined && (
              <div className="col-lg-6 col-xl-1 d-flex align-items-center px-xl-0 ml-xl-n3">
                <span className="text-uppercase mr-1">{operation.type}</span> {operation.action}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OperationsList;
