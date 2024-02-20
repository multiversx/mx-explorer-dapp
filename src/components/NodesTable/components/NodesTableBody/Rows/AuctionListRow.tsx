import { useGetSort } from 'hooks';
import { NodeType, SortOrderEnum, WithClassnameType } from 'types';

import { AuctionListBaseRow } from './AuctionListBaseRow';
import { AuctionListExpandRow } from './AuctionListExpandRow';
import { AuctionListTresholdRow } from './AuctionListTresholdRow';

export interface AuctionListRowUIType extends WithClassnameType {
  nodeData: NodeType;
  showTresholdRow?: boolean;
  expandRowDetails?: any;
}

export const AuctionListRow = ({
  nodeData,
  showTresholdRow,
  expandRowDetails
}: AuctionListRowUIType) => {
  const { sort, order } = useGetSort();
  const isSortDesc = sort === 'auctionPosition' && order === SortOrderEnum.desc;

  const hasExpand =
    expandRowDetails?.qualifiedExpandPosition ||
    expandRowDetails?.dangerZoneExpandPosition ||
    expandRowDetails?.notQualifiedExpandPosition;

  return (
    <>
      {isSortDesc && showTresholdRow && (
        <AuctionListTresholdRow key={nodeData.bls} isSortDesc />
      )}
      {expandRowDetails?.qualifiedExpandPosition && (
        <AuctionListExpandRow
          nodeData={nodeData}
          expandPosition={expandRowDetails.qualifiedExpandPosition}
          closePosition={expandRowDetails.qualifiedExpandClosePosition}
          remainingQualifiedValidators={
            expandRowDetails?.remainingQualifiedValidators
          }
        />
      )}
      {expandRowDetails?.dangerZoneExpandPosition && (
        <AuctionListExpandRow
          nodeData={nodeData}
          expandPosition={expandRowDetails.dangerZoneExpandPosition}
          closePosition={expandRowDetails.dangerZoneExpandClosePosition}
          remainingDangerZoneValidators={
            expandRowDetails?.remainingDangerZoneValidators
          }
        />
      )}
      {expandRowDetails?.notQualifiedExpandPosition && (
        <AuctionListExpandRow
          nodeData={nodeData}
          expandPosition={expandRowDetails.notQualifiedExpandPosition}
          closePosition={expandRowDetails.notQualifiedExpandClosePosition}
          remainingNotQualifiedValidators={
            expandRowDetails?.remainingNotQualifiedValidators
          }
        />
      )}
      {!hasExpand && <AuctionListBaseRow nodeData={nodeData} />}
      {!isSortDesc && showTresholdRow && (
        <AuctionListTresholdRow key={nodeData.bls} />
      )}
    </>
  );
};
