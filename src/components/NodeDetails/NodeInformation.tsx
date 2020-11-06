import * as React from 'react';
import { urlBuilder } from 'helpers';
import { ShardSpan, NetworkLink, Trim, DetailItem } from 'sharedComponents';
import { ValidatorType } from 'context/validators';

const NodeInformation = ({ node }: { node: ValidatorType }) => {
  const { publicKey, peerType, shardNumber, versionNumber, nodeDisplayName } = node;
  return (
    <div className="card">
      <div className="card-body p-0">
        <div className="container-fluid">
          <DetailItem title="Public Key" colWidth="3">
            <Trim text={publicKey} />
          </DetailItem>
          <DetailItem title="Shard" colWidth="3">
            {shardNumber !== undefined ? (
              <NetworkLink to={urlBuilder.shard(shardNumber)} data-testid="shardLink">
                <ShardSpan shardId={shardNumber} />
              </NetworkLink>
            ) : (
              <span className="text-muted">N/A</span>
            )}
          </DetailItem>

          <DetailItem title="Name" colWidth="3">
            {nodeDisplayName ? nodeDisplayName : <span className="text-muted">N/A</span>}
          </DetailItem>

          <DetailItem title="Type" colWidth="3">
            Validator ({peerType})
          </DetailItem>

          <DetailItem title="Version" colWidth="3">
            <span data-testid="versionNumber">
              {versionNumber ? versionNumber : <span className="text-muted">N/A</span>}
            </span>
          </DetailItem>
        </div>
      </div>
    </div>
  );
};

export default NodeInformation;
