import React from 'react';
import classNames from 'classnames';

import { NodeType } from 'types';
import { NodesTableBody } from './components/NodesTableBody';
import { AuctionHead } from './components/NodesTableHead/AuctionHead';
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
  showPosition?: boolean;
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
      status,
      showPosition
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
            {auctionList && <AuctionHead />}
            {statistics && <StatisticsHead />}
            {queue && <QueueHead hideFilters={hideFilters} />}
            {!statistics && !queue && !auctionList && (
              <StandardHead
                hideFilters={hideFilters}
                type={type}
                status={status}
                showPosition={showPosition}
              />
            )}
          </thead>
          {children}
        </table>
      </div>
    );
  }
}
