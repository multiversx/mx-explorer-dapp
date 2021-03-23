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
              <th data-testid="node">Public key</th>
              <th data-testid="name">
                <Sort id="name" field="Name" />
              </th>
              <th data-testid="shard">
                Shard{this.props.hideFilters === true ? '' : <ShardFilter />}
              </th>
              <th data-testid="version">
                <Sort id="version" field="Version" />
              </th>
              <th className="text-right" data-testid="uptime">
                <Sort id="uptime" field="Uptime" />
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
