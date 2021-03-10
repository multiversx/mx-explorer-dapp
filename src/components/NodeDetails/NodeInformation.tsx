import * as React from 'react';
import { urlBuilder } from 'helpers';
import { ShardSpan, NetworkLink, Trim, CopyButton, CardItem } from 'sharedComponents';
import RowIcon from 'sharedComponents/NodesTable/RowIcon';
import { NodeType } from 'context/state';
import { ReactComponent as ElrondSymbol } from 'assets/images/elrond-symbol-chart.svg';
import { faCogs } from '@fortawesome/pro-light-svg-icons/faCogs';

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

  return (
    <div className="card">
      <div className="card-body p-lg-spacer">
        <div className="row">
          <div className="col-12 col-lg-2 my-n2">
            <div className="d-flex flex-column py-3 justify-content-between h-100 align-items-center">
              <h5>Node Details</h5>
            </div>
          </div>
          <div className="col-12 col-lg-10 pr-0 my-n2 d-flex flex-wrap">
            <CardItem title="Public Key" customIcon={<ElrondSymbol />}>
              <div className="d-flex flex-column min-w-0">
                <div className="d-flex align-items-center">
                  {nodeType === 'observer' && <RowIcon node={node} />}
                  <Trim text={publicKey} />
                  <CopyButton text={publicKey} className="ml-2" />
                </div>
                <Alert node={node} />
              </div>
            </CardItem>

            <CardItem title="Shard" icon={faCogs}>
              {shard !== undefined ? (
                <NetworkLink to={urlBuilder.shard(shard)} data-testid="shardLink">
                  <ShardSpan shard={shard} />
                </NetworkLink>
              ) : (
                <span className="text-secondary">N/A</span>
              )}
            </CardItem>

            <CardItem title="Name" icon={faCogs}>
              <span className="text-secondary">{nodeName ? nodeName : <>N/A</>}</span>
            </CardItem>

            <CardItem title="Type" icon={faCogs}>
              <span className="text-secondary">
                {nodeType === 'observer' && <>Observer</>}
                {nodeType !== 'observer' && (
                  <>
                    Validator <span className="text-secondary">({peerType})</span>
                  </>
                )}
              </span>
            </CardItem>

            <CardItem title="Version" icon={faCogs}>
              <span className="text-secondary" data-testid="versionNumber">
                {versionNumber ? versionNumber : <>N/A</>}
              </span>
            </CardItem>

            <CardItem title="Nonce" icon={faCogs}>
              <span className="text-secondary">{nonce ? nonce : <>N/A</>}</span>
            </CardItem>

            <CardItem title="Instances" icon={faCogs}>
              <span className="text-secondary">{numInstances ? numInstances : <>N/A</>}</span>
            </CardItem>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodeInformation;
