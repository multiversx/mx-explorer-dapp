import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchange } from '@fortawesome/pro-regular-svg-icons/faExchange';
import { Denominate, CopyButton, Trim } from 'sharedComponents';

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
    <div className="operations-list detailed-list d-flex flex-column mt-1">
      {operations.map((operation: OperationType, i) => {
        return (
          <div key={i} className="detailed-item d-flex border-left border-bottom ml-3 py-3">
            <div className="transaction-icon">
              <FontAwesomeIcon icon={faExchange} />
            </div>

            <div className="detailed-item-content">
              {operation.sender && (
                <div className="row mb-3 d-flex flex-column flex-sm-row">
                  <div className="col col-left">From</div>
                  <div className="col d-flex align-items-center">
                    <Trim text={operation.sender} />
                    <CopyButton text={operation.sender} className="side-action ml-2" />
                  </div>
                </div>
              )}

              {operation.receiver && (
                <div className="row mb-3 d-flex flex-column flex-sm-row">
                  <div className="col col-left">To</div>
                  <div className="col d-flex align-items-center">
                    <Trim text={operation.receiver} />
                    <CopyButton text={operation.receiver} className="side-action ml-2" />
                  </div>
                </div>
              )}

              {operation.action !== undefined && operation.type !== undefined && (
                <div className="row mb-3 d-flex flex-column flex-sm-row">
                  <div className="col col-left">Action</div>
                  <div className="col text-wrap">
                    <span className="text-uppercase">{operation.type}</span> {operation.action}
                  </div>
                </div>
              )}

              {operation.value !== undefined && operation.identifier !== undefined && (
                <div className="row mb-3 d-flex flex-column flex-sm-row">
                  <div className="col col-left">Value</div>
                  <div className="col text-wrap">
                    <Denominate
                      token={operation.identifier}
                      value={operation.value}
                      showLastNonZeroDecimal
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OperationsList;
