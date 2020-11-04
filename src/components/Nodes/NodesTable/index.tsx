import * as React from 'react';
import TableBody from './TableBody';
import ShardLabel from './ShardLabel';
import StatusLabel from './StatusLabel';

export default class NodesTable extends React.Component<{ children: React.ReactNode }> {
  static Body = TableBody;
  static ShardLabel = ShardLabel;
  static StatusLabel = StatusLabel;

  render() {
    return (
      <div className="table-wrapper">
        <table className="table">{this.props.children}</table>
      </div>
    );
  }
}
