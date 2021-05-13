import * as React from 'react';
import StatusFilter from '../StatusFilter';
import Sort from '../Sort';

const QueueHead = ({ hideFilters }: { hideFilters?: boolean }) => {
  return (
    <tr>
      <th data-testid="position">
        <Sort id="position" field="Position" />
      </th>
      <th data-testid="node">Public key</th>
      <th data-testid="name">
        <Sort id="name" field="Name" />
      </th>
      <th data-testid="version">
        <Sort id="version" field="Version" />
      </th>
      <th className="text-right" data-testid="uptime">
        <Sort id="uptime" field="Uptime" />
      </th>
      <th className="text-right" data-testid="status">
        Status
        {hideFilters === true ? '' : <StatusFilter />}
      </th>
    </tr>
  );
};

export default QueueHead;
