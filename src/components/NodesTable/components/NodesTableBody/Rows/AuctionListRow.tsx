import { useGetSort } from 'hooks';
import { NodeType, SortOrderEnum, WithClassnameType } from 'types';

import { AuctionListBaseRow } from './AuctionListBaseRow';
import { AuctionListExpandRow } from './AuctionListExpandRow';
import { AuctionListTresholdRow } from './AuctionListTresholdRow';

import { ExpandRowConfigType } from '../NodesTableBody';

export interface AuctionListRowUIType extends WithClassnameType {
  nodeData: NodeType;
  showTresholdRow?: boolean;
  expandRowConfig?: ExpandRowConfigType;
  index?: number;
  showPosition?: boolean;
}

export const AuctionListRow = ({
  nodeData,
  showTresholdRow,
  index,
  showPosition,
  expandRowConfig
}: AuctionListRowUIType) => {
  const { sort, order } = useGetSort();
  const isSortDesc = sort === 'auctionPosition' && order === SortOrderEnum.desc;

  const hasExpand = Boolean(
    expandRowConfig?.qualifiedExpandPosition ||
      expandRowConfig?.dangerZoneExpandPosition ||
      expandRowConfig?.notQualifiedExpandPosition
  );

  return (
    <>
      {isSortDesc && showTresholdRow && (
        <AuctionListTresholdRow key={nodeData.bls} isSortDesc />
      )}
      {hasExpand && index && expandRowConfig ? (
        <AuctionListExpandRow
          nodeData={nodeData}
          expandRowConfig={expandRowConfig}
          showPosition={showPosition}
          index={index}
        />
      ) : (
        <AuctionListBaseRow
          nodeData={nodeData}
          index={index}
          showPosition={showPosition}
        />
      )}
      {!isSortDesc && showTresholdRow && (
        <AuctionListTresholdRow key={nodeData.bls} />
      )}
    </>
  );
};
