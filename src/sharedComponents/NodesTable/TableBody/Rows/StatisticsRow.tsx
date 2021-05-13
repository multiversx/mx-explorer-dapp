import * as React from 'react';
import { NodeType } from 'context/state';
import { urlBuilder } from 'helpers';
import { NetworkLink, Trim } from 'sharedComponents';
import RowIcon from '../../RowIcon';

const StatisticsRow = ({ nodeData }: { nodeData: NodeType }) => {
  return (
    <>
      <td>
        <div className="d-flex align-items-center">
          <RowIcon node={nodeData} />
          <NetworkLink to={urlBuilder.nodeDetails(nodeData.bls)} className="trim-wrapper">
            <Trim text={nodeData.bls} />
          </NetworkLink>
        </div>
      </td>
      <td>
        {nodeData.name ? (
          <div className="truncate-item-lg">{nodeData.name}</div>
        ) : (
          <span className="text-secondary">N/A</span>
        )}
      </td>
      <td className="text-right">
        {nodeData.leaderSuccess ? (
          nodeData.leaderSuccess.toLocaleString('en')
        ) : (
          <span className="text-secondary">N/A</span>
        )}
      </td>
      <td className="text-right">
        {nodeData.leaderFailure ? (
          nodeData.leaderFailure.toLocaleString('en')
        ) : (
          <span className="text-secondary">N/A</span>
        )}
      </td>
      <td className="text-right">
        {nodeData.validatorSuccess ? (
          nodeData.validatorSuccess.toLocaleString('en')
        ) : (
          <span className="text-secondary">N/A</span>
        )}
      </td>
      <td className="text-right">
        {nodeData.validatorFailure ? (
          nodeData.validatorFailure.toLocaleString('en')
        ) : (
          <span className="text-secondary">N/A</span>
        )}
      </td>
      <td className="text-right">
        {nodeData.validatorIgnoredSignatures ? (
          nodeData.validatorIgnoredSignatures.toLocaleString('en')
        ) : (
          <span className="text-secondary">N/A</span>
        )}
      </td>
      <td className="text-right">
        {nodeData.tempRating ? (
          nodeData.tempRating.toLocaleString('en')
        ) : (
          <span className="text-secondary">N/A</span>
        )}
      </td>
    </>
  );
};

export default StatisticsRow;
