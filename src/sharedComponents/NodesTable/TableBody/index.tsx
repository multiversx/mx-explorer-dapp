import * as React from 'react';
import { NodeType } from 'helpers/types';
import { PageState } from 'sharedComponents';
import { faCogs } from '@fortawesome/pro-regular-svg-icons/faCogs';
import StandardRow from './Rows/StandardRow';
import StatisticsRow from './Rows/StatisticsRow';
import QueueRow from './Rows/QueueRow';

const NodesTable = ({
  nodes,
  statistics,
  queue,
  type,
  status,
}: {
  nodes: NodeType[];
  statistics?: boolean;
  queue?: boolean;
  type?: NodeType['type'];
  status?: NodeType['status'];
}) => {
  const colSpan = statistics ? 8 : queue ? 6 : 7;

  return (
    <tbody>
      {nodes.map((nodeData, index) => (
        <tr key={nodeData.bls}>
          {!statistics && !queue && (
            <StandardRow nodeData={nodeData} index={index} type={type} status={status} />
          )}
          {statistics && <StatisticsRow nodeData={nodeData} />}
          {queue && <QueueRow nodeData={nodeData} />}
        </tr>
      ))}
      {nodes.length === 0 && (
        <tr>
          <td colSpan={colSpan}>
            <PageState
              icon={faCogs}
              title="No Nodes"
              className="py-spacer my-auto"
              dataTestId="errorScreen"
            />
          </td>
        </tr>
      )}
    </tbody>
  );
};

export default NodesTable;
