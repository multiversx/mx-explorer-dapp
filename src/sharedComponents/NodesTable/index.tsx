import * as React from 'react';
import TableBody from './TableBody';
import ShardFilter from './ShardFilter';
import StatusFilter from './StatusFilter';
import Sort from './Sort';

export default class NodesTable extends React.Component<{
  children: React.ReactNode;
  hideFilters?: boolean;
  statistics?: boolean;
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
              {this.props.statistics ? (
                <>
                  <th data-testid="leaderSuccess">
                    <Sort id="leaderSuccess" field="Leader Success" />
                  </th>
                  <th data-testid="leaderFailure">
                    <Sort id="leaderFailure" field="Leader Failure" />
                  </th>
                  <th data-testid="validatorSuccess">
                    <Sort id="validatorSuccess" field="Validator Success" />
                  </th>
                  <th data-testid="validatorFailure">
                    <Sort id="validatorFailure" field="Validator Failure" />
                  </th>
                  <th data-testid="validatorIgnoredSignatures">
                    <Sort id="validatorIgnoredSignatures" field="Ignored Signature" />
                  </th>
                  <th data-testid="tempRating">
                    <Sort id="tempRating" field="Temp Rating" />
                  </th>
                </>
              ) : (
                <>
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
                </>
              )}
            </tr>
          </thead>
          {this.props.children}
        </table>
      </div>
    );
  }
}
