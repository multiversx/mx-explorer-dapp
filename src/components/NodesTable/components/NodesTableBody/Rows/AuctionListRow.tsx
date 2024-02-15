import { useGetSort } from 'hooks';
import {
  NodeType,
  IdentityType,
  SortOrderEnum,
  WithClassnameType
} from 'types';

import { AuctionListBaseRow } from './AuctionListBaseRow';
import { AuctionListExpandRow } from './AuctionListExpandRow';
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
  showTresholdRow,
  expandRowDetails
}: AuctionListRowUIType) => {
  const { sort, order } = useGetSort();
  const isSortDesc = sort === 'auctionPosition' && order === SortOrderEnum.desc;

  return (
    <>
      {expandRowDetails?.qualifiedExpandPosition ===
        nodeData.auctionPosition && (
        <AuctionListExpandRow
          remainingQualifiedValidators={
            expandRowDetails?.remainingQualifiedValidators
          }
        />
      )}
      {expandRowDetails?.dangerZoneExpandPosition ===
        nodeData.auctionPosition && (
        <AuctionListExpandRow
          remainingDangerZoneValidators={
            expandRowDetails?.remainingDangerZoneValidators
          }
        />
      )}
      {expandRowDetails?.notQualifiedExpandPosition ===
        nodeData.auctionPosition && (
        <AuctionListExpandRow
          remainingNotQualifiedValidators={
            expandRowDetails?.remainingNotQualifiedValidators
          }
        />
      )}
      {isSortDesc && showTresholdRow && (
        <AuctionListTresholdRow key={nodeData.bls} isSortDesc />
      )}
      <AuctionListBaseRow nodeData={nodeData} identities={identities} />
      {!isSortDesc && showTresholdRow && (
        <AuctionListTresholdRow key={nodeData.bls} />
      )}
    </>
  );
};
