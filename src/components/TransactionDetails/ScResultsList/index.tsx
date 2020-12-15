import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchange } from '@fortawesome/pro-regular-svg-icons/faExchange';
import { Denominate, CopyButton, Trim } from 'sharedComponents';
import decodePart from './decodePart';

export interface ScResultType {
  callType: string;
  gasLimit: number;
  gasPrice: number;
  nonce: number;
  prevTxHash: string;
  receiver: string;
  sender: string;
  value: string;
  data?: string;
  returnMessage?: string;
}

const ScResultsList = ({ scResults }: { scResults: ScResultType[] }) => {
  const decodeData = (data: string) => {
    const parts = Buffer.from(data, 'base64').toString().split('@');

    if (parts.length >= 2) {
      if (parts[0].length > 0) {
        parts[0] = decodePart(parts[0]);
      } else {
        parts[1] = decodePart(parts[1]);
      }
    }

    return parts.join('@');
  };

  return (
    <div className="sc-results-list d-flex flex-column mt-1">
      {scResults.map((result: ScResultType, i) => {
        return (
          <div key={i} className="result-item d-flex border-left border-bottom ml-3 py-3">
            <div className="transaction-icon">
              <FontAwesomeIcon icon={faExchange} />
            </div>

            <div className="result-item-content">
              {result.sender && (
                <div className="row mb-3 d-flex flex-column flex-sm-row">
                  <div className="col col-left">From</div>
                  <div className="col d-flex align-items-center">
                    <Trim text={result.sender} />
                    <CopyButton text={result.sender} className="side-action ml-2" />
                  </div>
                </div>
              )}

              {result.receiver && (
                <div className="row mb-3 d-flex flex-column flex-sm-row">
                  <div className="col col-left">To</div>
                  <div className="col d-flex align-items-center">
                    <Trim text={result.receiver} />
                    <CopyButton text={result.receiver} className="side-action ml-2" />
                  </div>
                </div>
              )}

              <div className="row mb-3 d-flex flex-column flex-sm-row">
                <div className="col col-left">Value</div>
                <div className="col text-wrap">
                  <Denominate value={result.value} showLastNonZeroDecimal />
                </div>
              </div>

              {result.data && (
                <div className="row d-flex flex-column flex-sm-row">
                  <div className="col col-left">Data</div>
                  <div className="col">
                    <textarea
                      readOnly
                      className="form-control cursor-text mt-1"
                      rows={2}
                      defaultValue={result.data ? decodeData(result.data) : 'N/A'}
                    />
                  </div>
                </div>
              )}

              {result.returnMessage && (
                <div className="row mt-3 d-flex flex-column flex-sm-row">
                  <div className="col col-left">Response</div>
                  <div className="col text-break-all">{result.returnMessage}</div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ScResultsList;
