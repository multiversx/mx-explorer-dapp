import * as React from 'react';
import { urlBuilder } from 'helpers';
import { ShardSpan, NetworkLink, Trim, DetailItem, CopyButton } from 'sharedComponents';
import { NodeType } from 'context/state';

const NodeInformation = ({ node, colWidth }: { node: NodeType; colWidth: string }) => {
  const { publicKey, peerType, shardId, versionNumber, nodeDisplayName } = node;
  return (
    <div className="card">
      <div className="card-body p-0">
        <div className="container-fluid">
          <DetailItem title="Public Key" colWidth={colWidth}>
            <div className="d-flex align-items-center">
              <Trim text={publicKey} />
              <CopyButton text={publicKey} className="ml-2" />
            </div>
          </DetailItem>
          <DetailItem title="Shard" colWidth={colWidth}>
            {shardId !== undefined ? (
              <NetworkLink to={urlBuilder.shard(shardId)} data-testid="shardLink">
                <ShardSpan shard={shardId} />
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
