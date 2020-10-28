import * as React from 'react';
import { truncate, urlBuilder } from 'helpers';
import { ShardSpan, TestnetLink } from 'sharedComponents';

export interface NodeInformationType {
  publicKey: string;
  instanceType: string;
  shardNumber: number;
  versionNumber: string;
  nodeDisplayName: string;
  publicKeyBlockSign: string;
}

const NodeInformation = ({
  publicKey,
  instanceType,
  shardNumber,
  versionNumber,
  nodeDisplayName,
  publicKeyBlockSign,
}: NodeInformationType) => {
  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-2 card-label">Public Key</div>
              <div className="col-lg-10">{truncate(publicKey, 100)}</div>
            </div>
            <hr className="hr-space" />
            {publicKeyBlockSign !== undefined && (
              <div>
                <div className="row">
                  <div className="col-lg-2 card-label">Public key BlockSign</div>
                  <div className="col-lg-10">missing</div>
                </div>
                <hr className="hr-space" />
              </div>
            )}

            <div className="row">
              <div className="col-lg-2 card-label">Shard</div>
              <div className="col-lg-10">
                {shardNumber !== undefined ? (
                  <TestnetLink to={urlBuilder.shard(shardNumber)} data-testid="shardLink">
                    <ShardSpan shardId={shardNumber} />
                  </TestnetLink>
                ) : (
                  <span className="text-muted">N/A</span>
                )}
              </div>
            </div>
            <hr className="hr-space" />
            <div className="row">
              <div className="col-lg-2 card-label">Name</div>
              <div className="col-lg-10">
                {nodeDisplayName ? nodeDisplayName : <span className="text-muted">N/A</span>}
              </div>
            </div>
            <hr className="hr-space" />
            <div className="row">
              <div className="col-lg-2 card-label">Type</div>
              <div className="col-lg-10">{instanceType}</div>
            </div>
            <hr className="hr-space" />
            <div className="row">
              <div className="col-lg-2 card-label">Version</div>
              <div className="col-lg-10" data-testid="versionNumber">
                {versionNumber ? versionNumber : <span className="text-muted">N/A</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodeInformation;
