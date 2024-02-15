import { useGetSort } from 'hooks';
import {
  NodeType,
  IdentityType,
  SortOrderEnum,
  WithClassnameType
} from 'types';

import { AuctionListBaseRow } from './AuctionListBaseRow';
import { AuctionListTresholdRow } from './AuctionListTresholdRow';

export interface AuctionListRowUIType extends WithClassnameType {
  nodeData: NodeType;
  identities?: IdentityType[];
  showTresholdRow?: boolean;
  expandRowDetails?: any;
}

export const AuctionListRow = ({
  nodeData,
  identities = [],
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
        <AuctionListBaseRow nodeData={nodeData} identities={identities} />
      </TresholdRowWrapper>
    </>
  );
};
