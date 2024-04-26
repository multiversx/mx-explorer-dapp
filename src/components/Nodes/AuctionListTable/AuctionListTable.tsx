import { useState } from 'react';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { PageState, FormatNumber } from 'components';
import { getStringPlural } from 'helpers';
import { useGetSort } from 'hooks';
import { faCogs } from 'icons/regular';
import { stakeSelector } from 'redux/selectors';
import { AuctionValidatorType, SortOrderEnum, WithClassnameType } from 'types';

import { AuctionListRow } from './AuctionListRow';
import { getExpandRowDetails, hasThresholdRow } from './helpers';
import { ExpandRowConfigType } from './types';

export interface AuctionListTableUIType extends WithClassnameType {
  auctionListValidators?: AuctionValidatorType[];
  showPosition?: boolean;
}

export const AuctionListTable = ({
  showPosition = true,
  className
}: AuctionListTableUIType) => {
  const [searchParams] = useSearchParams();
  const { sort, order } = useGetSort();
  const { isQualified, isAuctionDangerZone } = Object.fromEntries(searchParams);

  const {
    unprocessed: { minimumAuctionQualifiedStake }
  } = useSelector(stakeSelector);

  const [qualifiedExpanded, setQualifiedExpanded] = useState(false);
  const [notQualifiedExpanded, setNotQualifiedExpanded] = useState(false);

  let filterText = '';
  if (isQualified !== undefined) {
    if (isQualified) {
      filterText = 'Qualified';
    }
    filterText = 'Not Qualified';
  }
  if (isAuctionDangerZone) {
    filterText = 'Qualified in Danger Zone';
  }

  const hasNoFilters =
    isQualified === undefined && isAuctionDangerZone === undefined;

  const filteredValidators = hasNoFilters
    ? auctionListValidators
    : auctionListValidators.filter((validator) => {
        if (
          isQualified === 'true' &&
          isAuctionDangerZone === undefined &&
          new BigNumber(
            validator.qualifiedAuctionValidators ?? 0
          ).isGreaterThan(0)
        ) {
          return true;
        }
        if (
          isAuctionDangerZone === 'true' &&
          new BigNumber(
            validator.qualifiedAuctionValidators ?? 0
          ).isGreaterThan(0) &&
          new BigNumber(validator.dangerZoneValidators ?? 0).isGreaterThan(0)
        ) {
          return true;
        }

        if (
          isQualified === 'false' &&
          new BigNumber(validator.qualifiedAuctionValidators ?? 0).isZero()
        ) {
          return true;
        }

        return false;
      });

  const isAuctionSortDesc = sort === 'locked' && order === SortOrderEnum.desc; // TODO: replace locked with qualifiedStake

  const expandRowConfig = {
    ...getExpandRowDetails(filteredValidators),
    qualifiedExpanded,
    notQualifiedExpanded,
    setQualifiedExpanded,
    setNotQualifiedExpanded
  } as ExpandRowConfigType;

  const thresholdIndex = isAuctionSortDesc
    ? filteredValidators.findIndex((validator) =>
        hasThresholdRow(validator, minimumAuctionQualifiedStake)
      )
    : filteredValidators.findLastIndex((validator) =>
        hasThresholdRow(validator, minimumAuctionQualifiedStake)
      );

  const tableTotalAuction = filteredValidators.reduce(
    (accumulator, currentValue) =>
      accumulator.plus(new BigNumber(currentValue?.auctionValidators ?? 0)),
    new BigNumber(0)
  );
  const tableTotalDropped = filteredValidators.reduce(
    (accumulator, currentValue) =>
      accumulator.plus(
        new BigNumber(
          currentValue?.droppedValidators ??
            (currentValue?.auctionValidators ?? 0) -
              (currentValue?.qualifiedAuctionValidators ?? 0)
        )
      ),
    new BigNumber(0)
  );
  const tableTotalQualified = filteredValidators.reduce(
    (accumulator, currentValue) =>
      accumulator.plus(
        new BigNumber(currentValue?.qualifiedAuctionValidators ?? 0)
      ),
    new BigNumber(0)
  );

  const qualifiedValidators = filteredValidators.filter((validator) =>
    new BigNumber(validator.qualifiedAuctionValidators ?? 0).isGreaterThan(0)
  );
  const notQualifiedValidators = filteredValidators.filter((validator) =>
    new BigNumber(validator.qualifiedAuctionValidators ?? 0).isZero()
  );

  if (filteredValidators.length === 0) {
    return (
      <PageState
        icon={faCogs}
        title={`No ${
          filterText ? `${filterText} ` : ''
        }Validators in Auction List`}
      />
    );
  }

  return (
    <div className={classNames('auction-list-table table-wrapper', className)}>
      <table className='table mb-0'>
        <thead>
          <tr>
            {showPosition && <th className='th-rank'>#</th>}
            <th className='th-identity'>Identity</th>
            <th className='th-auction-nodes'>Auction List Nodes</th>
            <th className='th-dropped'>Dropped</th>
            <th className='th-qualified'>Qualified</th>
            <th className='th-stake'>Qualified Stake / Node</th>
            <th className='th-delta'>Delta</th>
          </tr>
        </thead>
        <tbody>
          {filteredValidators.map((validator, index) => {
            const showThresholdRow = Boolean(
              thresholdIndex && index === thresholdIndex && hasNoFilters
            );

            return (
              <AuctionListRow
                validator={validator}
                index={index}
                key={index}
                expandRowConfig={expandRowConfig}
                thresholdRowConfig={{
                  showThresholdRow,
                  qualifiedValidators: qualifiedValidators.length,
                  notQualifiedValidators: notQualifiedValidators.length
                }}
              />
            );
          })}
          <tr>
            {showPosition && <td></td>}
            <td></td>
            <td className='text-neutral-300'>
              <FormatNumber value={tableTotalAuction} />{' '}
              {getStringPlural(tableTotalAuction, { string: 'node' })}
            </td>
            <td className='text-neutral-300'>
              <FormatNumber value={tableTotalDropped} />{' '}
              {getStringPlural(tableTotalDropped, { string: 'node' })}
            </td>
            <td className='text-neutral-300'>
              <FormatNumber value={tableTotalQualified} />{' '}
              {getStringPlural(tableTotalQualified, { string: 'node' })}
            </td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
