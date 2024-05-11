import { useState } from 'react';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { ELLIPSIS } from 'appConstants';
import { PageState, FormatNumber } from 'components';
import { getStringPlural } from 'helpers';
import { useGetNodeFilters, useGetSort } from 'hooks';
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
  auctionListValidators = [],
  showPosition = true,
  className
}: AuctionListTableUIType) => {
  const { sort, order } = useGetSort();
  const { isQualified, isAuctionDangerZone } = useGetNodeFilters();

  const {
    unprocessed: {
      minimumAuctionQualifiedStake,
      auctionValidators,
      qualifiedAuctionValidators,
      notQualifiedAuctionValidators
    }
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
          isQualified &&
          isAuctionDangerZone === undefined &&
          new BigNumber(
            validator.qualifiedAuctionValidators ?? 0
          ).isGreaterThan(0)
        ) {
          return true;
        }
        if (
          isAuctionDangerZone &&
          new BigNumber(
            validator.qualifiedAuctionValidators ?? 0
          ).isGreaterThan(0) &&
          new BigNumber(validator.dangerZoneValidators ?? 0).isGreaterThan(0)
        ) {
          return true;
        }

        if (
          isQualified === false &&
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

  const tableTotalQualified = filteredValidators.reduce(
    (accumulator, currentValue) =>
      accumulator.plus(
        new BigNumber(currentValue?.qualifiedAuctionValidators ?? 0)
      ),
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

  const qualifiedValidators = filteredValidators.filter((validator) =>
    new BigNumber(validator.qualifiedAuctionValidators ?? 0).isGreaterThan(0)
  );
  const notQualifiedValidators = filteredValidators.filter((validator) =>
    new BigNumber(validator.qualifiedAuctionValidators ?? 0).isZero()
  );

  const footerTotalAuction = hasNoFilters
    ? auctionValidators
    : tableTotalAuction;
  const footerTotalQualified = hasNoFilters
    ? qualifiedAuctionValidators
    : tableTotalQualified;
  const footerTotalDropped = hasNoFilters
    ? notQualifiedAuctionValidators
    : tableTotalDropped;

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
            <th className='th-identity'>Validator</th>
            <th className='th-auction-nodes'>Auction List</th>
            <th className='th-qualified'>Qualified</th>
            <th className='th-dropped'>Not Qualified</th>
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
        </tbody>
        <tfoot>
          <tr>
            {showPosition && <td></td>}
            <td></td>
            <td className='text-neutral-300'>
              {footerTotalAuction !== undefined ? (
                <>
                  <FormatNumber value={footerTotalAuction} />{' '}
                  {getStringPlural(footerTotalAuction, { string: 'node' })}
                </>
              ) : (
                ELLIPSIS
              )}
            </td>
            <td className='text-neutral-300'>
              {footerTotalQualified !== undefined ? (
                <>
                  <FormatNumber value={footerTotalQualified} />{' '}
                  {getStringPlural(footerTotalQualified, {
                    string: 'node'
                  })}
                </>
              ) : (
                ELLIPSIS
              )}
            </td>
            <td className='text-neutral-300'>
              {footerTotalDropped !== undefined ? (
                <>
                  <FormatNumber value={tableTotalDropped} />{' '}
                  {getStringPlural(tableTotalDropped, { string: 'node' })}
                </>
              ) : (
                ELLIPSIS
              )}
            </td>
            <td></td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
