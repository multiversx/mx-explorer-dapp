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

  const hasExpand =
    expandRowDetails?.qualifiedExpandPosition ||
    expandRowDetails?.dangerZoneExpandPosition ||
    expandRowDetails?.notQualifiedExpandPosition;

  return (
    <>
      <TresholdRowWrapper>
        {expandRowDetails?.qualifiedExpandPosition && (
          <AuctionListExpandRow
            nodeData={nodeData}
            identities={identities}
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
            identities={identities}
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
            identities={identities}
            expandPosition={expandRowDetails.notQualifiedExpandPosition}
            closePosition={expandRowDetails.notQualifiedExpandClosePosition}
            remainingNotQualifiedValidators={
              expandRowDetails?.remainingNotQualifiedValidators
            }
          />
        )}
        {!hasExpand && (
          <AuctionListBaseRow nodeData={nodeData} identities={identities} />
        )}
      </TresholdRowWrapper>
    </>
  );
};
