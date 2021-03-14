import * as React from 'react';
import { urlBuilder } from 'helpers';
import { ShardSpan, NetworkLink, Trim, CopyButton, CardItem } from 'sharedComponents';
import RowIcon from 'sharedComponents/NodesTable/RowIcon';
import { NodeType } from 'context/state';
import { faLock, faServer, faCheck, faCode } from '@fortawesome/pro-solid-svg-icons';

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
    owner,
  } = node;

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-item">
          <h6 data-testid="title">Node Details</h6>
        </div>
        <div className="card-header-item compact d-flex">
          <span className="flex-shrink-0 mr-2">Public key:</span>

          <div className="d-flex flex-column min-w-0">
            <div className="d-flex align-items-center">
              {nodeType === 'observer' && <RowIcon node={node} />}
              <Trim color="secondary" text={publicKey} />
              <CopyButton text={publicKey} className="ml-2" />
            </div>
            <Alert node={node} />
          </div>
        </div>
      </div>
      <div className="card-body card-item-container">
        <CardItem title="Shard" icon={faLock}>
          {shard !== undefined ? (
            <NetworkLink to={urlBuilder.shard(shard)} data-testid="shardLink">
              <ShardSpan shard={shard} />
            </NetworkLink>
          ) : (
            <span className="text-secondary">N/A</span>
          )}
        </CardItem>

        <CardItem title="Version" icon={faLock}>
          <span className="text-secondary" data-testid="versionNumber">
            {versionNumber ? versionNumber : <>N/A</>}
          </span>
        </CardItem>

        <CardItem title="Instances" icon={faCheck}>
          <span className="text-secondary">{numInstances ? numInstances : <>N/A</>}</span>
        </CardItem>

        <CardItem title="Node Name" icon={faServer}>
          <span className="text-secondary">{nodeName ? nodeName : <>N/A</>}</span>
        </CardItem>

        <CardItem title="Type" icon={faCheck}>
          <span className="text-secondary">
            {nodeType === 'observer' && <>Observer</>}
            {nodeType !== 'observer' && (
              <>
                Validator <span className="text-secondary">({peerType})</span>
              </>
            )}
          </span>
        </CardItem>

        <CardItem title="Nonce" icon={faCheck}>
          <span className="text-secondary">{nonce ? nonce : <>N/A</>}</span>
        </CardItem>

        {/* <CardItem title="Contract" icon={faCode}>
          <div className="d-flex align-items-center min-w-0">
            <NetworkLink to={urlBuilder.providerDetails(owner)} className="trim-wrapper">
              <Trim text={owner} />
            </NetworkLink>
            <CopyButton text={owner} />
          </div>
        </CardItem> */}

        <CardItem title="Contract" icon={faCode}>
          <div className="d-flex align-items-center min-w-0">
            <NetworkLink
              to={urlBuilder.providerDetails(
                'erd1qqqqqqqqqqqqqpgqxwakt2g7u9atsnr03gqcgmhcv38pt7mkd94q6shuwt'
              )}
              className="trim-wrapper"
            >
              <Trim text={'erd1qqqqqqqqqqqqqpgqxwakt2g7u9atsnr03gqcgmhcv38pt7mkd94q6shuwt'} />
            </NetworkLink>
            <CopyButton text={'erd1qqqqqqqqqqqqqpgqxwakt2g7u9atsnr03gqcgmhcv38pt7mkd94q6shuwt'} />
          </div>
        </CardItem>
      </div>
    </div>
  );
};

export default NodeInformation;
