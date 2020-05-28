import { HeadersType } from './../helpers/validatorHelpers';

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
    id: 'shardID',
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

headers.splice(0, 0, {
  id: 'ratingOrder',
  label: '#',
  dir: 'none',
});
headers.splice(7, 0, {
  id: 'rating',
  label: 'Rating',
  dir: 'none',
});

export default headers;
