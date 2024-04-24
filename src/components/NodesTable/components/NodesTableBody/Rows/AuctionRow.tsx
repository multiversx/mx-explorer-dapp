import { useGetSort } from 'hooks';
import { NodeType, SortOrderEnum, WithClassnameType } from 'types';

import { AuctionBaseRow } from './AuctionBaseRow';
import { AuctionThresholdRow } from './AuctionThresholdRow';

export interface AuctionRowUIType extends WithClassnameType {
  nodeData: NodeType;
  showThresholdRow?: boolean;
  index?: number;
  showPosition?: boolean;
}

export const AuctionRow = ({
  nodeData,
  showThresholdRow,
  index,
  showPosition
}: AuctionRowUIType) => {
  const { sort, order } = useGetSort();
  const isSortDesc =
    (sort === 'auctionPosition' && order === SortOrderEnum.desc) ||
    (sort === 'locked' && order === SortOrderEnum.asc);

  return (
    <>
      {isSortDesc && showThresholdRow && (
        <AuctionThresholdRow key={nodeData.bls} isSortDesc />
      )}
      <AuctionBaseRow
        nodeData={nodeData}
        index={index}
        showPosition={showPosition}
      />
      {!isSortDesc && showThresholdRow && (
        <AuctionThresholdRow key={nodeData.bls} />
      )}
    </>
  );
};
