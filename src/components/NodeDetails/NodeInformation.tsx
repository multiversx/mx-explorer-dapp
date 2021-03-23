import * as React from 'react';
import { urlBuilder } from 'helpers';
import {
  ShardSpan,
  NetworkLink,
  Trim,
  CopyButton,
  CardItem,
  Denominate,
  LockedAmountTooltip,
} from 'sharedComponents';
import RowIcon from 'sharedComponents/NodesTable/RowIcon';
import { NodeType } from 'context/state';
import { faLock, faServer, faCheck, faCode } from '@fortawesome/pro-solid-svg-icons';

import Alert from './Alert';

const NodeInformation = ({ nodeData }: { nodeData: NodeType }) => {
  const {
    node,
    type,
    shard,
    version,
    name,
    nonce,
    instances,
    provider,
    online,
    locked,
    topUp,
    stake,
  } = nodeData;

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
              {type === 'observer' && <RowIcon node={nodeData} />}
              <Trim color="secondary" text={node} />
              <CopyButton text={node} className="ml-2" />
            </div>
            <Alert node={nodeData} />
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
          <span className="text-secondary" data-testid="version">
            {version ? version : <>N/A</>}
          </span>
        </CardItem>

        <CardItem title="Instances" icon={faCheck}>
          <span className="text-secondary">{instances ? instances : <>N/A</>}</span>
        </CardItem>

        <CardItem title="Name" icon={faServer}>
          <span className="text-secondary">{name ? name : <>N/A</>}</span>
        </CardItem>

        <CardItem title="Type" icon={faCheck}>
          <span className="text-secondary">
            {type === 'observer' && <>Observer</>}
            {type !== 'observer' && (
              <>
                Validator <span className="text-secondary">({online ? 'online' : 'offline'})</span>
              </>
            )}
          </span>
        </CardItem>

        <CardItem title="Nonce" icon={faCheck}>
          <span className="text-secondary">{nonce ? nonce : <>N/A</>}</span>
        </CardItem>

        <CardItem title="Locked" icon={faLock}>
          <div className="d-flex align-items-center">
            <span className="mr-2">
              <Denominate value={locked} />
            </span>

            <LockedAmountTooltip
              lockedDetails={[
                { label: 'Stake', value: <Denominate value={stake} /> },
                {
                  label: 'Topup',
                  value: <Denominate value={topUp} />,
                },
              ]}
            />
          </div>
        </CardItem>

        {provider && (
          <CardItem title="Provider" icon={faCode}>
            <div className="d-flex align-items-center min-w-0">
              <NetworkLink to={urlBuilder.providerDetails(provider)} className="trim-wrapper">
                <Trim text={provider} />
              </NetworkLink>
              <CopyButton text={provider} />
            </div>
          </CardItem>
        )}
      </div>
    </div>
  );
};

export default NodeInformation;
