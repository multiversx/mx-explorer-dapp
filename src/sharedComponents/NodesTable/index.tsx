import * as React from 'react';
import TableBody from './TableBody';
import ShardFilter from './ShardFilter';
import StatusFilter from './StatusFilter';
import Sort from './Sort';

export default class NodesTable extends React.Component<{
  children: React.ReactNode;
  hideFilters?: boolean;
}> {
  static Body = TableBody;

  render() {
    return (
      <div className="nodes-table table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th data-testid="publicKey">Public key</th>
              <th data-testid="nodeName">
                <Sort id="nodeName" field="Node Name" />
              </th>
              <th data-testid="shard">
                Shard{this.props.hideFilters === true ? '' : <ShardFilter />}
              </th>
              <th data-testid="versionNumber">
                <Sort id="versionNumber" field="Version" />
              </th>
              <th className="text-right" data-testid="totalUptime">
                <Sort id="totalUpTime" field="Uptime" />
              </th>
              <th className="text-right" data-testid="status">
                Status
                {this.props.hideFilters === true ? '' : <StatusFilter />}
              </th>
              <th className="text-right" data-testid="tempRating">
                <Sort id="tempRating" field="Rating" />
              </th>
            </tr>
          </thead>
          {this.props.children}
        </table>
      </div>
    );
  }
}
