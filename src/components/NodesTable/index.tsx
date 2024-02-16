import React from 'react';
import classNames from 'classnames';

import { NodeType } from 'types';
import { NodesTableBody } from './components/NodesTableBody';
import { AuctionListHead } from './components/NodesTableHead/AuctionListHead';
import { QueueHead } from './components/NodesTableHead/QueueHead';
import { StandardHead } from './components/NodesTableHead/StandardHead';
import { StatisticsHead } from './components/NodesTableHead/StatisticsHead';

interface NodesTableUIType {
  children: React.ReactNode;
  hideFilters?: boolean;
  statistics?: boolean;
  queue?: boolean;
  auctionList?: boolean;
  type?: NodeType['type'];
  status?: NodeType['status'];
}

export default class NodesTable extends React.Component<NodesTableUIType> {
  static Body = NodesTableBody;

  render() {
    const {
      statistics,
      queue,
      auctionList,
      children,
      hideFilters,
      type,
      status
    } = this.props;

    return (
      <div
        className={classNames('nodes-table table-wrapper', {
          'auction-list-table': auctionList,
          'queue-table': queue,
          'statistics-table': statistics
        })}
      >
        <table className='table mb-0'>
          <thead>
            {auctionList && <AuctionListHead />}
            {statistics && <StatisticsHead />}
            {queue && <QueueHead hideFilters={hideFilters} />}
            {!statistics && !queue && !auctionList && (
              <StandardHead
                hideFilters={hideFilters}
                type={type}
                status={status}
              />
            )}
          </thead>
          {children}
        </table>
      </div>
    );
  }
}
