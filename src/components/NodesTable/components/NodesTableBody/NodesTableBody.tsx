import { PageState } from 'components';
import { faCogs } from 'icons/regular';
import { IdentityType, NodeType } from 'types';

import { AuctionListRow } from './Rows/AuctionListRow';
import { QueueRow } from './Rows/QueueRow';
import { StandardRow } from './Rows/StandardRow';
import { StatisticsRow } from './Rows/StatisticsRow';

export interface NodesTableBodyUIType {
  nodes: NodeType[];
  statistics?: boolean;
  queue?: boolean;
  auctionList?: boolean;
  type?: NodeType['type'];
  status?: NodeType['status'];
  identities?: IdentityType[];
}

export const NodesTableBody = ({
  nodes,
  statistics,
  queue,
  auctionList,
  type,
  status,
  identities
}: NodesTableBodyUIType) => {
  let colSpan = 8;
  if (queue) {
    colSpan = 5;
  }

  return (
    <tbody>
      {nodes.map((nodeData, index) => {
        if (statistics) {
          return <StatisticsRow nodeData={nodeData} key={nodeData.bls} />;
        }
        if (queue) {
          return <QueueRow nodeData={nodeData} key={nodeData.bls} />;
        }
        if (auctionList) {
          return (
            <AuctionListRow
              nodeData={nodeData}
              identities={identities}
              key={nodeData.bls}
            />
          );
        }
        return (
          <StandardRow
            nodeData={nodeData}
            index={index}
            type={type}
            status={status}
            key={nodeData.bls}
          />
        );
      })}
      {nodes.length === 0 && (
        <tr>
          <td colSpan={colSpan}>
            <PageState icon={faCogs} title='No Nodes' isError />
          </td>
        </tr>
      )}
    </tbody>
  );
};
