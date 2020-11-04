import * as React from 'react';
import TableBody from './TableBody';
import ShardLabel from './ShardLabel';
import StatusLabel from './StatusLabel';
import { Pager } from 'sharedComponents';

export default class NodesTable extends React.Component<{ children: React.ReactNode }> {
  static Body = TableBody;
  static ShardLabel = ShardLabel;
  static StatusLabel = StatusLabel;

  render() {
    return (
      <>
        <div className="card-body p-0">
          <div className="table-wrapper">
            <table className="table">{this.props.children}</table>
          </div>
        </div>
        <div className="card-footer border-top py-2">
          <Pager itemsPerPage={50} page={'1'} total={1000} show={true} />
        </div>
      </>
    );
  }
}
