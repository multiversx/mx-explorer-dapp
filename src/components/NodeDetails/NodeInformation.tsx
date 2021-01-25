import * as React from 'react';
import { urlBuilder } from 'helpers';
import { ShardSpan, NetworkLink, Trim, DetailItem, CopyButton } from 'sharedComponents';
import RowIcon from 'sharedComponents/NodesTable/RowIcon';
import { NodeType } from 'context/state';
import Alert from './Alert';

const NodeInformation = ({ node, colWidth }: { node: NodeType; colWidth: string }) => {
  const {
    publicKey,
    peerType,
    shard,
    versionNumber,
    nodeName,
    nodeType,
    nonce,
    numInstances,
  } = node;
  return (
    <div className="card">
      <div className="card-body p-0">
        <div className="container-fluid">
          <DetailItem title="Public Key" colWidth={colWidth}>
            <div className="d-flex flex-column">
              <div className="d-flex align-items-center">
                {nodeType === 'observer' && <RowIcon node={node} />}
                <Trim text={publicKey} />
                <CopyButton text={publicKey} className="ml-2" />
              </div>
              <Alert node={node} />
            </div>
          </DetailItem>
          <DetailItem title="Shard" colWidth={colWidth}>
            <div className="d-flex">
              {shard !== undefined ? (
                <NetworkLink to={urlBuilder.shard(shard)} data-testid="shardLink">
                  <ShardSpan shard={shard} />
                </NetworkLink>
              ) : (
                <span className="text-secondary">N/A</span>
              )}
            </div>
          </DetailItem>

          <DetailItem title="Name" colWidth={colWidth}>
            {nodeName ? nodeName : <span className="text-secondary">N/A</span>}
          </DetailItem>

          <DetailItem title="Type" colWidth={colWidth}>
            {nodeType === 'observer' && <>Observer</>}
            {nodeType !== 'observer' && (
              <>
                Validator <span className="text-secondary">({peerType})</span>
              </>
            )}
          </DetailItem>

          <DetailItem title="" colWidth={colWidth}>
            <div className="d-flex flex-wrap justify-content-between justify-content-lg-start">
              <div className="d-flex flex-column mr-2 mr-sm-4">
                <span className="text-secondary mr-2">Version</span>
                <span data-testid="versionNumber">
                  {versionNumber ? versionNumber : <span className="text-secondary">N/A</span>}
                </span>
              </div>
              <div className="d-flex flex-column ml-2 mr-2 mr-sm-4">
                <span className="text-secondary mr-2">Nonce</span>
                <span>{nonce ? nonce : <span className="text-secondary">N/A</span>}</span>
              </div>
              <div className="d-flex flex-column ml-2">
                <span className="text-secondary mr-2">Instances</span>
                <span>
                  {numInstances ? numInstances : <span className="text-secondary">N/A</span>}
                </span>
              </div>
            </div>
          </DetailItem>
        </div>
      </div>
    </div>
  );
};

export default NodeInformation;
