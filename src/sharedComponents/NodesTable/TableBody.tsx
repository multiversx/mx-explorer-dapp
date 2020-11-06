import * as React from 'react';
import { ValidatorType } from 'context/validators';
import { truncate, urlBuilder } from 'helpers';
import { ShardSpan, NetworkLink, Trim, Led } from 'sharedComponents';
import RowIcon from './RowIcon';

const getRatings = (nodes: ValidatorType[]) => {
  return nodes
    .filter((node: ValidatorType) => node.nodeType === 'validator')
    .sort((a: any, b: any) => a.rating - b.rating)
    .map((v: any) => v);
};

const NodesTable = ({ nodes }: { nodes: ValidatorType[] }) => {
  const orderedByRating = getRatings(nodes);

  // const getRatingsEffect = () => {
  //   const uniqueRatings = getRatings(nodes);
  //   setRatingOrder(uniqueRatings);
  // };

  // React.useEffect(getRatingsEffect, [nodes]);

  return (
    <tbody>
      {orderedByRating.map((node, index) => (
        <tr key={node.publicKey}>
          {/* <td>{node.nodeType === 'validator' ? ratingOrder.indexOf(node.publicKey) + 1 : ''}</td> */}
          <td>
            <div className="d-flex align-items-center">
              <RowIcon node={node} />
              {node.nodeType === 'validator' ? (
                <NetworkLink to={urlBuilder.nodeDetails(node.publicKey)}>
                  <Trim text={node.publicKey} />
                </NetworkLink>
              ) : (
                <Trim text={node.publicKey} />
              )}
            </div>
          </td>
          <td>
            {node.nodeDisplayName ? (
              truncate(node.nodeDisplayName, 20)
            ) : (
              <span className="text-muted">N/A</span>
            )}
          </td>
          <td>
            <NetworkLink to={urlBuilder.shard(node.shardId)} data-testid={`shardLink${index}`}>
              <ShardSpan shardId={node.shardId} />
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
            {node.totalUpTimeSec === 0 &&
              node.totalDownTimeSec === 0 &&
              node.status === 'online' && <span>100%</span>}
            {node.totalUpTimeSec === 0 &&
              node.totalDownTimeSec === 0 &&
              node.status === 'offline' && <span>0%</span>}
          </td>
          <td>
            <div className="d-flex align-items-center justify-content-end">
              <Led color={node.status === 'online' ? 'bg-success' : 'bg-danger'} />
              <span className="ml-2">{node.status === 'online' ? 'Online' : 'Offline'}</span>
            </div>
          </td>
          <td className="text-right">{node.rating}</td>
        </tr>
      ))}
    </tbody>
  );
};

export default NodesTable;
