import * as React from 'react';
import TableBody from './TableBody';
import TableHeader from './TableHeader';

export default class NodesTable extends React.Component<{ children: React.ReactNode }> {
  static Body = TableBody;
  static Header = TableHeader;

  render() {
    return (
      <div className="table-wrapper">
        <table className="table">{this.props.children}</table>
      </div>
    );
  }
}
