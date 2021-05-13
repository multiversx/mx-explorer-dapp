import * as React from 'react';
import Sort from '../Sort';

const StatisticsHead = () => {
  return (
    <tr>
      <th data-testid="node">Public key</th>
      <th data-testid="name">
        <Sort id="name" field="Name" />
      </th>

      <th data-testid="leaderSuccess">
        <Sort id="leaderSuccess" field="Leader Success" />
      </th>
      <th data-testid="leaderFailure">
        <Sort id="leaderFailure" field="Leader Failure" />
      </th>
      <th data-testid="validatorSuccess">
        <Sort id="validatorSuccess" field="Validator Success" />
      </th>
      <th data-testid="validatorFailure">
        <Sort id="validatorFailure" field="Validator Failure" />
      </th>
      <th data-testid="validatorIgnoredSignatures">
        <Sort id="validatorIgnoredSignatures" field="Ignored Signature" />
      </th>
      <th data-testid="tempRating">
        <Sort id="tempRating" field="Temp Rating" />
      </th>
    </tr>
  );
};

export default StatisticsHead;
