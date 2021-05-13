import * as React from 'react';
import TableBody from './TableBody';
import StandardHead from './Heads/StandardHead';
import StatisticsHead from './Heads/StatisticsHead';
import QueueHead from './Heads/QueueHead';

interface NodesTableType {
  children: React.ReactNode;
  hideFilters?: boolean;
  statistics?: boolean;
  queue?: boolean;
}

export default class NodesTable extends React.Component<NodesTableType> {
  static Body = TableBody;

  render() {
    const { statistics, queue, children, hideFilters } = this.props;

    return (
      <div className="nodes-table table-wrapper">
        <table className="table">
          <thead>
            {!statistics && !queue && <StandardHead hideFilters={hideFilters} />}
            {statistics && <StatisticsHead />}
            {queue && <QueueHead hideFilters={hideFilters} />}
          </thead>
          {children}
        </table>
      </div>
    );
  }
}
