import * as React from 'react';
import TableBody from './TableBody';

type DirectioinsType = 'none' | 'desc' | 'asc';
interface HeadersType {
  id: string;
  label: string;
  dir: DirectioinsType;
}

const headers: HeadersType[] = [
  {
    id: 'publicKey',
    label: 'Public Key',
    dir: 'none',
  },
  {
    id: 'nodeDisplayName',
    label: 'Node Name',
    dir: 'none',
  },
  {
    id: 'shardId',
    label: 'Shard',
    dir: 'none',
  },
  {
    id: 'versionNumber',
    label: 'Version',
    dir: 'none',
  },

  {
    id: 'totalUpTimeSec',
    label: 'Uptime',
    dir: 'none',
  },
  {
    id: 'isActive',
    label: 'Status',
    dir: 'none',
  },
];

const TableHeader = () => {
  return (
    <thead>
      <tr>
        {headers.map((header) => (
          <th key={header.id}>{header.label}</th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
