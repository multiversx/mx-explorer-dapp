import { ExpandRowDetailsType } from 'helpers/getValue/getExpandRowDetails';
import { useGetSort } from 'hooks';
import { NodeType, SortOrderEnum, WithClassnameType } from 'types';

import { AuctionListBaseRow } from './AuctionListBaseRow';
import { AuctionListTresholdRow } from './AuctionListTresholdRow';

export interface AuctionListRowUIType extends WithClassnameType {
  nodeData: NodeType;
  showTresholdRow?: boolean;
  expandRowDetails?: ExpandRowDetailsType;
  index?: number;
}

export const AuctionListRow = ({
  nodeData,
  showTresholdRow,
  index
}: AuctionListRowUIType) => {
  const { sort, order } = useGetSort();
  const isSortDesc = sort === 'auctionPosition' && order === SortOrderEnum.desc;

  return (
    <>
      {isSortDesc && showTresholdRow && (
        <AuctionListTresholdRow key={nodeData.bls} isSortDesc />
      )}
      <AuctionListBaseRow nodeData={nodeData} index={index} />
      {!isSortDesc && showTresholdRow && (
        <AuctionListTresholdRow key={nodeData.bls} />
      )}
    </>
  );
};
