import * as React from 'react';

import { CardItem } from 'sharedComponents';
import { NodeType } from 'context/state';
import { faCheck, faTimes } from '@fortawesome/pro-solid-svg-icons';

const NodeInformation = ({ nodeData }: { nodeData: NodeType }) => {
  const {
    leaderSuccess,
    leaderFailure,
    validatorSuccess,
    validatorFailure,
    validatorIgnoredSignatures,
  } = nodeData;

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-item">
          <h6 data-testid="title">Validator Statistics</h6>
        </div>
      </div>
      <div className="card-body card-item-container mx-spacing">
        <CardItem title="Ignored Signature" icon={faTimes}>
          {validatorIgnoredSignatures ? validatorIgnoredSignatures : <>N/A</>}
        </CardItem>
        <CardItem title="Leader Success" icon={faCheck}>
          {leaderSuccess ? leaderSuccess : <>N/A</>}
        </CardItem>
        <CardItem title="Leader Failure" icon={faTimes}>
          {leaderFailure ? leaderFailure : <>N/A</>}
        </CardItem>
        <CardItem title="Validator Success" icon={faCheck}>
          {validatorSuccess ? validatorSuccess : <>N/A</>}
        </CardItem>
        <CardItem title="Validator Failure" icon={faTimes}>
          {validatorFailure ? validatorFailure : <>N/A</>}
        </CardItem>
      </div>
    </div>
  );
};

export default NodeInformation;
