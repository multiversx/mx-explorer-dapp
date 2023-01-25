import * as React from 'react';
import { NodeType } from 'types';
import { QueueHead } from './Heads/QueueHead';
import { StandardHead } from './Heads/StandardHead';
import { StatisticsHead } from './Heads/StatisticsHead';
import { TableBody } from './TableBody';

interface NodesTableType {
  children: React.ReactNode;
  hideFilters?: boolean;
  statistics?: boolean;
  queue?: boolean;
  type?: NodeType['type'];
  status?: NodeType['status'];
}

export default class NodesTable extends React.Component<NodesTableType> {
  static Body = TableBody;

  render() {
    const { statistics, queue, children, hideFilters, type, status } =
      this.props;

    return (
      <div className='nodes-table table-wrapper'>
        <table className='table mb-0'>
          <thead>
            {!statistics && !queue && (
              <StandardHead
                hideFilters={hideFilters}
                type={type}
                status={status}
              />
            )}
            {statistics && <StatisticsHead />}
            {queue && <QueueHead hideFilters={hideFilters} />}
          </thead>
          {children}
        </table>
      </div>
    );
  }
}
