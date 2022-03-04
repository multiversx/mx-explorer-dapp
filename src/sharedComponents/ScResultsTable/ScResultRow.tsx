import React from 'react';
import { addressIsBech32, urlBuilder } from 'helpers';
import { ScResultType } from 'helpers/types';
import { ScAddressIcon, ShardSpan, NetworkLink, TimeAgo, Trim, Denominate } from 'sharedComponents';

export interface ScResultRowType {
  scResult: ScResultType;
  address?: string;
  senderShard?: string | number;
  receiverShard?: string | number;
}

const ScResultRow = ({ scResult, address }: ScResultRowType) => {
  const directionOut = address === scResult.sender;
  const directionIn = address === scResult.receiver;

  return (
    <tr className="animated-row trim-size-sm">
      <td>
        <div className="d-flex align-items-center trim-size-xl">
          <NetworkLink
            to={`/transactions/${
              scResult.originalTxHash
                ? `${scResult.originalTxHash}#${scResult.hash}`
                : scResult.hash
            }`}
            data-testid="transactionLink"
            className="trim-wrapper"
          >
            <Trim text={scResult.hash} />
          </NetworkLink>
        </div>
      </td>
      <td>
        <TimeAgo value={scResult.timestamp} /> ago &nbsp;
      </td>
      <td>
        <div className="d-flex align-items-center">
          <ScAddressIcon initiator={scResult.sender} />
          {directionOut ? (
            <Trim text={scResult.sender} />
          ) : (
            <>
              {addressIsBech32(scResult.sender) ? (
                <NetworkLink
                  to={urlBuilder.accountDetails(scResult.sender)}
                  data-testid="senderLink"
                  className="trim-wrapper"
                >
                  <Trim text={scResult.sender} />
                </NetworkLink>
              ) : (
                <ShardSpan shard={scResult.sender} />
              )}
            </>
          )}
        </div>
      </td>
      <td>
        <div className="d-flex align-items-center">
          <ScAddressIcon initiator={scResult.receiver} />
          {directionIn ? (
            <Trim text={scResult.receiver} />
          ) : (
            <NetworkLink
              to={urlBuilder.accountDetails(scResult.receiver)}
              data-testid="receiverLink"
              className="trim-wrapper"
            >
              <Trim text={scResult.receiver} />
            </NetworkLink>
          )}
        </div>
      </td>
      <td>
        <Denominate value={scResult.value} />
      </td>
    </tr>
  );
};

export default ScResultRow;
