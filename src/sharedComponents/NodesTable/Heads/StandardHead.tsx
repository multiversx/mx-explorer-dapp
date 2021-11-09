import * as React from 'react';
import ShardFilter from '../ShardFilter';
import StatusFilter from '../StatusFilter';
import Sort from '../Sort';

const StandardHead = ({ hideFilters }: { hideFilters?: boolean }) => {
  return (
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
    </tr>
  );
};

export default StandardHead;
