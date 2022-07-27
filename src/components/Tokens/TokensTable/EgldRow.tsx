import * as React from 'react';
import BigNumber from 'bignumber.js';

import { useGlobalState } from 'context';
import { EconomicsType, StatsType } from 'context/state';
import pagerHelper from 'sharedComponents/Pager/pagerHelper';

import { useFilters, useURLSearchParams, validDisplayValue } from 'helpers';
import { TokenType, SortOrderEnum, TokenSortEnum } from 'helpers/types';
import { pageSize } from 'appConfig';
import { ReactComponent as ElrondSymbol } from 'assets/images/elrond-symbol.svg';

export const EgldRow = ({
  tokens,
  index,
  totalTokens,
}: {
  tokens: TokenType[];
  index: number;
  totalTokens: number;
}) => {
  const {
    economics,
    stats,
    activeNetwork: { erdLabel },
  } = useGlobalState();

  const { page } = useURLSearchParams();
  const { getQueryObject } = useFilters();
  const queryObject = getQueryObject();
  const description = `The Elrond eGold (${erdLabel}) Token is native to the Elrond Network and will be used for everything from staking, governance, transactions, smart contracts and validator rewards.`;

  const { search, sort, order } = queryObject;

  const showOnSearch = search && ['egld', 'elrond', erdLabel].includes(search.toLowerCase());
  let showOnFilter = !page && index === 0;

  const previousToken = tokens[index > 0 ? index - 1 : 0];
  const currentToken = tokens[index];
  const nextToken = tokens[index < tokens.length - 1 ? index + 1 : index];

  const { lastPage } = pagerHelper({
    total: totalTokens,
    itemsPerPage: pageSize,
    page: String(page),
  });
  const isLastPage = lastPage === page;

  if (
    sort &&
    order &&
    Object.keys(TokenSortEnum).includes(sort) &&
    Object.keys(SortOrderEnum).includes(order)
  ) {
    const statsValue = stats[sort as keyof StatsType];
    const economicsValue = economics[sort as keyof EconomicsType];
    const tokenValue = currentToken[sort as keyof TokenType];
    const previousTokenValue = previousToken[sort as keyof TokenType];
    const nextTokenValue = nextToken[sort as keyof TokenType];
    const egldValue =
      sort === TokenSortEnum.price || sort === TokenSortEnum.marketCap
        ? economicsValue
        : statsValue;

    if (
      egldValue !== undefined &&
      ((tokenValue !== undefined || previousTokenValue) !== undefined ||
        nextTokenValue !== undefined)
    ) {
      showOnFilter = false;
      if (order === SortOrderEnum.desc) {
        const egldIsGreaterThanNext =
          new BigNumber(egldValue).isGreaterThanOrEqualTo(tokenValue as string | number) &&
          new BigNumber(egldValue).isGreaterThanOrEqualTo(nextTokenValue as string | number);
        const egldIsGreater =
          egldIsGreaterThanNext &&
          new BigNumber(egldValue).isLessThanOrEqualTo(previousTokenValue as string | number);
        showOnFilter =
          previousToken === currentToken && !page ? egldIsGreaterThanNext : egldIsGreater;
      }
      if (order === SortOrderEnum.asc) {
        const egldIsGreaterThanPrevious =
          new BigNumber(egldValue).isGreaterThanOrEqualTo(previousTokenValue as string | number) &&
          new BigNumber(egldValue).isGreaterThanOrEqualTo(tokenValue as string | number);
        const egldIsLess =
          new BigNumber(egldValue).isLessThanOrEqualTo(nextTokenValue as string | number) &&
          egldIsGreaterThanPrevious;
        showOnFilter =
          nextToken === currentToken && isLastPage ? egldIsGreaterThanPrevious : egldIsLess;
      }
    }
  }

  const show = (!search || showOnSearch) && showOnFilter;

  if (!show) {
    return null;
  }

  return (
    <tr className="egld-row">
      <td>
        <div className="token-identity d-flex flex-row">
          <div className="d-flex align-items-center mr-3">
            <span className="side-link">
              <div className="egld-icon side-icon d-flex align-items-center justify-content-center">
                <ElrondSymbol />
              </div>
            </span>
          </div>
          <div className="d-flex flex-column justify-content-center">
            <span className="d-block token-ticker">{erdLabel}</span>
            <div
              className="token-description text-wrap text-secondary small d-none d-md-block"
              title={description}
            >
              {description}
            </div>
          </div>
        </div>
      </td>
      <td>Elrond {erdLabel}</td>
      <td>${validDisplayValue(economics.price, 2)}</td>
      <td>{economics.circulatingSupply}</td>
      <td>${validDisplayValue(economics.marketCap, 0)}</td>
      <td>{validDisplayValue(stats.accounts)}</td>
      <td>{validDisplayValue(stats.transactions)}</td>
    </tr>
  );
};

export default EgldRow;
