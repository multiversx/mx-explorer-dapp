import * as React from 'react';

type ShardType = {
  shardID: string;
  status: string;
  allValidators: number;
  allActiveValidators: number;
};

const ShardsList = ({ shardData }: { shardData: ShardType[] }) => {
  return (
    <div className="row d-flex flex-row pl-3">
      {shardData.map(shardEntry => (
        <div className="flex-grow-1 mr-3 mb-3 pb-3" key={shardEntry.shardID}>
          <div className="card">
            <div className="card-body">
              <span className="metric-label">
                {shardEntry.shardID == 'Metachain'
                  ? shardEntry.shardID
                  : 'Shard ' + shardEntry.shardID}
              </span>
              <span className="metric-value">
                <span
                  className={`
                    badge badge-pill badge-status
                    ${shardEntry.status == 'success' && 'badge-success'}
                    ${shardEntry.status == 'warning' && 'badge-warning'}
                    ${shardEntry.status == 'danger' && 'badge-danger'}`}
                >
                  &nbsp;
                </span>
                <span>
                  {shardEntry.allActiveValidators}/{shardEntry.allValidators}
                </span>
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShardsList;
