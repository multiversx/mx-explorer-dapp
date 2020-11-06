import * as React from 'react';
import { truncate, trimHash, urlBuilder } from 'helpers';
import { ShardSpan, NetworkLink } from 'sharedComponents';
import { ValidatorType } from 'context/validators';
import RowIcon from 'sharedComponents/NodesTable/RowIcon';
import { validatorsRoutes } from 'routes';

interface IdenityDetailsRowType {
  node: ValidatorType;
  rowIndex: number;
}

const IdenityDetailsRow = ({ node, rowIndex }: IdenityDetailsRowType) => {
  return (
    <tr className="identity-details-row">
      <td>
        <RowIcon node={node} />
        <NetworkLink
          to={`${validatorsRoutes.nodes}/${node.publicKey}`}
          data-testid={`hexPublicKeyLink${rowIndex}`}
        >
          {trimHash(node.publicKey)}
        </NetworkLink>
      </td>
      <td>
        {node.nodeDisplayName ? (
          truncate(node.nodeDisplayName, 20)
        ) : (
          <span className="text-muted">N/A</span>
        )}
      </td>
      <td>
        <NetworkLink to={urlBuilder.shard(node.shardNumber)} data-testid={`shardLink${rowIndex}`}>
          <ShardSpan shardId={node.shardNumber} />
        </NetworkLink>
      </td>
      <td>
        {node.versionNumber ? (
          truncate(node.versionNumber.split('-')[0], 20)
        ) : (
          <span className="text-muted">N/A</span>
        )}
      </td>

      <td className="text-right">
        {(node.totalUpTimeSec !== 0 || node.totalDownTimeSec !== 0) && (
          <span>
            {Math.floor(
              (node.totalUpTimeSec * 100) / (node.totalUpTimeSec + node.totalDownTimeSec)
            )}
            %
          </span>
        )}
        {node.totalUpTimeSec === 0 && node.totalDownTimeSec === 0 && node.isActive === true && (
          <span>100%</span>
        )}
        {node.totalUpTimeSec === 0 && node.totalDownTimeSec === 0 && node.isActive === false && (
          <span>0%</span>
        )}
      </td>

      <td className="text-right">
        {node.status === 'online' ? (
          <div>
            <span className="badge badge-pill badge-success badge-status">&nbsp;</span>
            &nbsp;
            <span>Online</span>
          </div>
        ) : (
          <div>
            <span className="badge badge-pill badge-danger badge-status">&nbsp;</span>
            &nbsp;
            <span className={node.nodeType === 'observer' ? 'text-muted' : ''}>Offline</span>
          </div>
        )}
      </td>

      <td className="text-right">{node.rating > 0 ? Math.floor(node.rating) : null}</td>
    </tr>
  );
};

export default IdenityDetailsRow;
