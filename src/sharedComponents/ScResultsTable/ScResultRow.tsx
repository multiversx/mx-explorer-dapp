import React from 'react';
import { addressIsBech32, urlBuilder } from 'helpers';
import { ScResultType } from 'helpers/types';
import { ScAddressIcon, ShardSpan, NetworkLink, TimeAgo, Trim, Denominate } from 'sharedComponents';

export interface ScResultRowType {
  scResult: ScResultType;
  address?: string;
}

const ScAccountLink = ({ address, testId }: { address: string; testId?: string }) =>
  addressIsBech32(address) ? (
    <NetworkLink
      to={urlBuilder.accountDetails(address)}
      data-testid={testId ? testId : 'addressLink'}
      className="trim-wrapper"
    >
      <Trim text={address} />
    </NetworkLink>
  ) : (
    <ShardSpan shard={address} />
  );

const ScResultRow = ({ scResult, address }: ScResultRowType) => {
  const directionOut = address === scResult.sender;
  const directionIn = address === scResult.receiver;

  const transactionLink = `/transactions/${
    scResult.originalTxHash ? `${scResult.originalTxHash}#${scResult.hash}` : scResult.hash
  }`;

  return (
    <tr className="animated-row trim-size-sm">
      <td>
        <div className="d-flex align-items-center trim-size-xl">
          <NetworkLink to={transactionLink} data-testid="transactionLink" className="trim-wrapper">
            <Trim text={scResult.hash} />
          </NetworkLink>
        </div>
      </td>
      <td>
        <TimeAgo value={scResult.timestamp} tooltip /> ago &nbsp;
      </td>
      <td>
        <div className="d-flex align-items-center">
          <ScAddressIcon initiator={scResult.sender} />
          {directionOut ? (
            <Trim text={scResult.sender} />
          ) : (
            <ScAccountLink address={scResult.sender} testId="senderLink" />
          )}
        </div>
      </td>
      <td>
        <div className="d-flex align-items-center">
          <ScAddressIcon initiator={scResult.receiver} />
          {directionIn ? (
            <Trim text={scResult.receiver} />
          ) : (
            <ScAccountLink address={scResult.receiver} testId="receiverLink" />
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
