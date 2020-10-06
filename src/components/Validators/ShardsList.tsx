import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faServer } from '@fortawesome/free-solid-svg-icons';
import { ComputedShard } from './ValidatorsTable/Table';
import { nrOfShards, metaChainShardId } from 'appConfig';

interface ShardCardType {
  shardEntry: ComputedShard;
  isOverall?: boolean;
}

const ShardCard = ({ shardEntry, isOverall = false }: ShardCardType) => {
  return (
    <div className="flex-grow-1 mr-3 mb-3 pb-3" key={shardEntry.shardID}>
      <div className={`card ${isOverall ? 'overall-card bg-blue' : ''}`}>
        <div className="card-body px-3">
          <span className="metric-label">
            {shardEntry.shardID === 'Metachain' || isOverall
              ? shardEntry.shardID
              : 'Shard ' + shardEntry.shardID}
          </span>
          <span className="metric-value d-flex align-items-center">
            {!isOverall && (
              <>
                <span
                  className={`
                badge badge-pill badge-status
                ${shardEntry.status === 'success' && 'badge-success'}
                ${shardEntry.status === 'warning' && 'badge-warning'}
                ${shardEntry.status === 'danger' && 'badge-danger'}`}
                >
                  &nbsp;
                </span>
                &nbsp;
              </>
            )}
            <span>
              {shardEntry.allActiveValidators}/{shardEntry.allValidators}
            </span>
            {!isOverall && (
              <span className="shard-icon-container d-flex align-items-center justify-content-center ml-2">
                <FontAwesomeIcon icon={faServer} className="shard-icon" />
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

interface ShardsListType {
  shardData: ComputedShard[];
}

const ShardsList = ({ shardData }: ShardsListType) => {
  const blockchainStatus: ComputedShard = {
    shardID: 'Active Validators',
    shardNumber: -1,
    status: '',
    allValidators: shardData.reduce(
      (totalValidators, shardEntry) => totalValidators + shardEntry.allValidators,
      0
    ),
    allActiveValidators: shardData.reduce(
      (totalAllActiveValidators, shardEntry) =>
        totalAllActiveValidators + shardEntry.allActiveValidators,
      0
    ),
  };

  const allowedShards = [metaChainShardId, ...Array.from(Array(nrOfShards).keys())];

  return (
    <div className="row d-flex pl-3">
      <ShardCard shardEntry={blockchainStatus} isOverall />
      {allowedShards.map((shard, i) => {
        const shardEntry = shardData.find((sh) => sh.shardNumber === shard);
        return shardEntry ? (
          <React.Fragment key={shardEntry.shardNumber + i}>
            {i === shardData.length - 3 && (
              <div className="d-none d-lg-block d-xl-none" style={{ flexBasis: '100%' }} />
            )}
            {allowedShards.includes(shardEntry.shardNumber) && (
              <ShardCard shardEntry={shardEntry} />
            )}
          </React.Fragment>
        ) : null;
      })}
    </div>
  );
};

export default ShardsList;
