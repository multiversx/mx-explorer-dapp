import * as React from 'react';
import ShardFilter from '../ShardFilter';
import StatusFilter from '../StatusFilter';
import { Sort } from 'components';
import { NodeType } from 'helpers/types';

const StandardHead = ({
  hideFilters,
  type,
  status,
}: {
  hideFilters?: boolean;
  type?: NodeType['type'];
  status?: NodeType['status'];
}) => (
  <tr>
    <th data-testid="node">Public key</th>
    <th data-testid="name">
      <Sort id="name" field="Name" />
    </th>
    <th data-testid="shard">Shard{hideFilters === true ? '' : <ShardFilter />}</th>
    <th data-testid="version">
      <Sort id="version" field="Version" />
    </th>
    <th
      className="text-right"
      data-testid="validatorIgnoredSignatures"
      style={{ maxWidth: '8rem' }}
    >
      <Sort id="validatorIgnoredSignatures" field="Ignored Signatures" />
    </th>
    <th className="text-right" data-testid="status">
      Status
      {hideFilters === true ? '' : <StatusFilter />}
    </th>
    <th className="text-right" data-testid="tempRating">
      <Sort id="tempRating" field="Rating" />
    </th>
    <th className="text-right" data-testid="nonce">
      Nonce
    </th>
    {status === 'queued' && (
      <th className="text-right" data-testid="position">
        <Sort id="position" field="Position" />
      </th>
    )}
    {type === 'validator' && (
      <th className="text-right" data-testid="lockedStake">
        <Sort id="locked" field="Locked Stake" />
      </th>
    )}
  </tr>
);

export default StandardHead;
