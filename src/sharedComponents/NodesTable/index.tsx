import * as React from 'react';
import TableBody from './TableBody';
import ShardLabel from './ShardLabel';
import StatusLabel from './StatusLabel';

export default class NodesTable extends React.Component<{
  children: React.ReactNode;
  hideFilters?: boolean;
}> {
  static Body = TableBody;

  render() {
    return (
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th data-testid="publickey">Public key</th>
              <th data-testid="nodeDisplayName">Node Name</th>
              <th data-testid="shard">
                {this.props.hideFilters === true ? 'Shard' : <ShardLabel />}
              </th>
              <th data-testid="versionNumber">Version</th>
              <th className="text-right" data-testid="totalUpTimeSec">
                Uptime
              </th>
              <th className="text-right" data-testid="status">
                {this.props.hideFilters === true ? 'Status' : <StatusLabel />}
              </th>
              <th className="text-right" data-testid="rating">
                Rating
              </th>
            </tr>
          </thead>
          {this.props.children}
        </table>
      </div>
    );
  }
}
