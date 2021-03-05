import * as React from 'react';
import { urlBuilder } from 'helpers';
import { ShardSpan, NetworkLink, Trim, DetailItem, CopyButton } from 'sharedComponents';
import RowIcon from 'sharedComponents/NodesTable/RowIcon';
import { NodeType } from 'context/state';
import Alert from './Alert';

const NodeInformation = ({ node }: { node: NodeType }) => {
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

  const leftColWith = '3';
  const rightColWith = '4';

  return (
    <div className="row">
      <div className="col-12 col-lg-8 mb-spacer mb-lg-0">
        <div className="card">
          <div className="card-body p-0">
            <div className="container-fluid">
              <DetailItem title="Public Key" colWidth={leftColWith}>
                <div className="d-flex flex-column">
                  <div className="d-flex align-items-center">
                    {nodeType === 'observer' && <RowIcon node={node} />}
                    <Trim text={publicKey} />
                    <CopyButton text={publicKey} className="ml-2" />
                  </div>
                  <Alert node={node} />
                </div>
              </DetailItem>

              <DetailItem title="Shard" colWidth={leftColWith}>
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

              <DetailItem title="Name" colWidth={leftColWith}>
                {nodeName ? nodeName : <span className="text-secondary">N/A</span>}
              </DetailItem>

              <DetailItem title="Type" colWidth={leftColWith}>
                {nodeType === 'observer' && <>Observer</>}
                {nodeType !== 'observer' && (
                  <>
                    Validator <span className="text-secondary">({peerType})</span>
                  </>
                )}
              </DetailItem>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-lg-4">
        <div className="card" data-testid="brandContainer">
          <div className="card-body p-0">
            <div className="container-fluid">
              <DetailItem title="Version" colWidth={rightColWith}>
                <span data-testid="versionNumber">
                  {versionNumber ? versionNumber : <span className="text-secondary">N/A</span>}
                </span>
              </DetailItem>

              <DetailItem title="Nonce" colWidth={rightColWith}>
                <span>{nonce ? nonce : <span className="text-secondary">N/A</span>}</span>
              </DetailItem>

              <DetailItem title="Instances" colWidth={rightColWith}>
                {numInstances ? numInstances : <span className="text-secondary">N/A</span>}
              </DetailItem>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodeInformation;
