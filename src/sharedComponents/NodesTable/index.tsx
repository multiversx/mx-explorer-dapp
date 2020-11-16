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
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th data-testid="publickey">Public key</th>
              <th data-testid="nodeDisplayName">Node Name</th>
              <th data-testid="shard">
                <Sort id="shard" field="Shard" />
                {this.props.hideFilters === true ? '' : <ShardFilter />}
              </th>
              <th data-testid="versionNumber">
                <Sort id="version" field="Version" />
              </th>
              <th className="text-right" data-testid="totalUpTimeSec">
                <Sort id="uptime" field="Uptime" />
              </th>
              <th className="text-right" data-testid="status">
                <Sort id="status" field="Status" />
                {this.props.hideFilters === true ? '' : <StatusFilter />}
              </th>
              <th className="text-right" data-testid="rating">
                <Sort id="rating" field="Rating" />
              </th>
            </tr>
          </thead>
          {this.props.children}
        </table>
      </div>
    );
  }
}
