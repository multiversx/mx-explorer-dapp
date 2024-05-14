import { useGetSort } from 'hooks';
import { SortOrderEnum } from 'types';

import { AuctionListBaseRow } from './AuctionListBaseRow';
import { AuctionListExpandRow } from './AuctionListExpandRow';
import { AuctionListThresholdRow } from './AuctionListThresholdRow';

import {
  AuctionListBaseRowUIType,
  ExpandRowConfigType,
  ThresholdRowConfigType
} from './types';

export interface AuctionListRowUIType extends AuctionListBaseRowUIType {
  thresholdRowConfig?: ThresholdRowConfigType;
  expandRowConfig?: ExpandRowConfigType;
}

export const AuctionListRow = ({
  validator,
  details,
  thresholdRowConfig,
  index,
  showPosition,
  expandRowConfig
}: AuctionListRowUIType) => {
  const { sort, order } = useGetSort();
  const isSortDesc = sort === 'qualifiedStake' && order === SortOrderEnum.desc;

  const hasExpand = Boolean(
    expandRowConfig?.qualifiedExpandPosition ||
      expandRowConfig?.notQualifiedExpandPosition
  );

  return (
    <>
      {isSortDesc && thresholdRowConfig?.showThresholdRow && (
        <AuctionListThresholdRow
          key={`${validator.name}-${index}`}
          thresholdRowConfig={thresholdRowConfig}
          isSortDesc
        />
      )}
      {hasExpand && index && expandRowConfig ? (
        <AuctionListExpandRow
          validator={validator}
          details={details}
          expandRowConfig={expandRowConfig}
          showPosition={showPosition}
          index={index}
        />
      ) : (
        <AuctionListBaseRow
          validator={validator}
          details={details}
          index={index}
          showPosition={showPosition}
        />
      )}
      {!isSortDesc && thresholdRowConfig?.showThresholdRow && (
        <AuctionListThresholdRow
          thresholdRowConfig={thresholdRowConfig}
          key={`${validator.name}-${index}`}
        />
      )}
    </>
  );
};
