import * as React from 'react';
import { urlBuilder } from 'helpers';
import { ShardSpan, NetworkLink, Trim, DetailItem } from 'sharedComponents';
import { NodeType } from 'context/state';

const NodeInformation = ({ node, colWidth }: { node: NodeType; colWidth: string }) => {
  const { publicKey, peerType, shardNumber, versionNumber, nodeDisplayName } = node;
  return (
    <div className="card">
      <div className="card-body p-0">
        <div className="container-fluid">
          <DetailItem title="Public Key" colWidth={colWidth}>
            <Trim text={publicKey} />
          </DetailItem>
          <DetailItem title="Shard" colWidth={colWidth}>
            {shardNumber !== undefined ? (
              <NetworkLink to={urlBuilder.shard(shardNumber)} data-testid="shardLink">
                <ShardSpan shardId={shardNumber} />
              </NetworkLink>
            ) : (
              <span className="text-muted">N/A</span>
            )}
          </DetailItem>

          <DetailItem title="Name" colWidth={colWidth}>
            {nodeDisplayName ? nodeDisplayName : <span className="text-muted">N/A</span>}
          </DetailItem>

          <DetailItem title="Type" colWidth={colWidth}>
            Validator ({peerType})
          </DetailItem>

          <DetailItem title="Version" colWidth={colWidth}>
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
