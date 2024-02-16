import { useGetSort } from 'hooks';
import { NodeType, SortOrderEnum, WithClassnameType } from 'types';

import { AuctionListBaseRow } from './AuctionListBaseRow';
import { AuctionListTresholdRow } from './AuctionListTresholdRow';

export interface AuctionListRowUIType extends WithClassnameType {
  nodeData: NodeType;
  showTresholdRow?: boolean;
  expandRowDetails?: any;
}

export const AuctionListRow = ({
  nodeData,
  showTresholdRow
}: AuctionListRowUIType) => {
  const { sort, order } = useGetSort();
  const isSortDesc = sort === 'auctionPosition' && order === SortOrderEnum.desc;

  const TresholdRowWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <>
        {isSortDesc && showTresholdRow && (
          <AuctionListTresholdRow key={nodeData.bls} isSortDesc />
        )}
        {children}
        {!isSortDesc && showTresholdRow && (
          <AuctionListTresholdRow key={nodeData.bls} />
        )}
      </>
    );
  };

  return (
    <>
      <TresholdRowWrapper>
        <AuctionListBaseRow nodeData={nodeData} />
      </TresholdRowWrapper>
    </>
  );
};
