import * as React from 'react';
import TableBody from './TableBody';
import ShardLabel from './ShardLabel';
import StatusLabel from './StatusLabel';

export default class NodesTable extends React.Component<{ children: React.ReactNode }> {
  static Body = TableBody;

  render() {
    return (
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th data-testid="publickey">Public key</th>
              <th data-testid="nodeDisplayName">Node Name</th>
              <th data-testid="shardId">
                <ShardLabel />
              </th>
              <th data-testid="versionNumber">Version</th>
              <th data-testid="totalUpTimeSec">Uptime</th>
              <th data-testid="status">
                <StatusLabel />
              </th>
            </tr>
          </thead>
          {this.props.children}
        </table>
      </div>
    );
  }
}
