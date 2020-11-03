import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchange } from '@fortawesome/pro-regular-svg-icons/faExchange';
import { Denominate, CopyButton, TrimHash } from 'sharedComponents';
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
    <div className="sc-results-list d-flex flex-column">
      {scResults.map((result: ScResultType, i) => {
        return (
          <div key={i} className="result-item d-flex border-left border-bottom ml-3 py-3">
            <div className="transaction-icon">
              <FontAwesomeIcon icon={faExchange} />
            </div>

            <div className="result-item-content content-fill">
              <div className="row mb-3">
                <div className="col-12 col-lg-2 col-xl-1 pr-xl-0 text-secondary text-lg-right">
                  From
                </div>
                <div className="col-12 col-lg-10 col-xl-11 pl-xl-2 d-flex">
                  <div className="pl-xl-4 content-fill d-flex flex-row">
                    <TrimHash text={result.sender} />
                    <CopyButton text={result.sender} className="side-action" />
                  </div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-12 col-lg-2 col-xl-1 pr-xl-0 text-secondary text-lg-right">
                  To
                </div>
                <div className="col-12 col-lg-10 col-xl-11 pl-xl-2 d-flex">
                  <div className="pl-xl-4 content-fill d-flex flex-row">
                    <TrimHash text={result.receiver} />
                    <CopyButton text={result.receiver} className="side-action" />
                  </div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-12 col-lg-2 col-xl-1 pr-xl-0 text-secondary text-lg-right">
                  Value
                </div>
                <div className="col-12 col-lg-10 col-xl-11 pl-xl-2">
                  <div className="pl-xl-4 content-fill d-flex flex-row">
                    <Denominate value={result.value} showLastNonZeroDecimal />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12 col-lg-2 col-xl-1 pr-xl-0 text-secondary text-lg-right">
                  Data
                </div>
                <div className="col-12 col-lg-10 col-xl-11 pl-xl-2">
                  <div className="pl-xl-4 content-fill d-flex flex-row">
                    <textarea
                      readOnly
                      className="form-control cursor-text"
                      rows={2}
                      defaultValue={result.data ? decodeData(result.data) : 'N/A'}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ScResultsList;
