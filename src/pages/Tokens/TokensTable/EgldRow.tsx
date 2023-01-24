import * as React from 'react';
import BigNumber from 'bignumber.js';

import { useSelector } from 'react-redux';
import { PAGE_SIZE } from 'appConstants';
import { ReactComponent as EgldSymbol } from 'assets/img/egld-token-logo.svg';
import { pagerHelper } from 'components/Pager/pagerHelper';

import { useGetFilters, useURLSearchParams } from 'helpers';
import {
  economicsSelector,
  statsSelector,
  activeNetworkSelector
} from 'redux/selectors';
import { TokenType, SortOrderEnum, TokenSortEnum } from 'types';

interface DummyTokenType {
  price: number;
  marketCap: number;
  circulatingSupply: number;
  accounts: number;
  transactions: number;
}

export const EgldRow = ({
  tokens,
  index,
  totalTokens
}: {
  tokens: TokenType[];
  index: number;
  totalTokens: number;
}) => {
  const { egldLabel } = useSelector(activeNetworkSelector);
  const { economicsFetched, price, marketCap, circulatingSupply } =
    useSelector(economicsSelector);
  const { statsFetched, accounts, transactions } = useSelector(statsSelector);

  const { page } = useURLSearchParams();
  const { getQueryObject } = useGetFilters();
  const queryObject = getQueryObject();
  const description = `The MultiversX (Elrond) eGold (${egldLabel}) Token is native to the MultiversX (previously Elrond) Network and will be used for everything from staking, governance, transactions, smart contracts and validator rewards.`;

  const { search, sort, order } = queryObject;

  const showOnSearch =
    search &&
    ['egld', 'elrond', 'multiversx', egldLabel].includes(search.toLowerCase());
  let showOnFilter = !page && index === 0;

  const previousToken = tokens[index > 0 ? index - 1 : 0];
  const currentToken = tokens[index];
  const nextToken = tokens[index < tokens.length - 1 ? index + 1 : index];

  const { lastPage } = pagerHelper({
    total: totalTokens,
    itemsPerPage: PAGE_SIZE,
    page: String(page)
  });
  const isLastPage = lastPage === page;

  if (
    sort &&
    order &&
    Object.keys(TokenSortEnum).includes(sort) &&
    Object.keys(SortOrderEnum).includes(order) &&
    statsFetched &&
    economicsFetched
  ) {
    const egldToken: DummyTokenType = {
      price,
      marketCap,
      circulatingSupply,
      accounts,
      transactions
    };

    const tokenValue = currentToken[sort as keyof TokenType];
    const previousTokenValue = previousToken[sort as keyof TokenType];
    const nextTokenValue = nextToken[sort as keyof TokenType];
    const egldValue = egldToken[sort as keyof DummyTokenType];

    if (
      egldValue !== undefined &&
      ((tokenValue !== undefined || previousTokenValue) !== undefined ||
        nextTokenValue !== undefined)
    ) {
      showOnFilter = false;
      if (order === SortOrderEnum.desc) {
        const egldIsGreaterThanNext =
          new BigNumber(egldValue).isGreaterThanOrEqualTo(
            tokenValue as string | number
          ) &&
          new BigNumber(egldValue).isGreaterThanOrEqualTo(
            nextTokenValue as string | number
          );
        const egldIsGreater =
          egldIsGreaterThanNext &&
          new BigNumber(egldValue).isLessThanOrEqualTo(
            previousTokenValue as string | number
          );
        showOnFilter =
          previousToken === currentToken && !page
            ? egldIsGreaterThanNext
            : egldIsGreater;
      }
      if (order === SortOrderEnum.asc) {
        const egldIsGreaterThanPrevious =
          new BigNumber(egldValue).isGreaterThanOrEqualTo(
            previousTokenValue as string | number
          ) &&
          new BigNumber(egldValue).isGreaterThanOrEqualTo(
            tokenValue as string | number
          );
        const egldIsLess =
          new BigNumber(egldValue).isLessThanOrEqualTo(
            nextTokenValue as string | number
          ) && egldIsGreaterThanPrevious;
        showOnFilter =
          nextToken === currentToken && isLastPage
            ? egldIsGreaterThanPrevious
            : egldIsLess;
      }
    }
  }

  const show = (!search || showOnSearch) && showOnFilter;

  if (!show) {
    return null;
  }

  return (
    <tr className='egld-row'>
      <td>
        <div className='token-identity d-flex flex-row'>
          <div className='d-flex align-items-center me-3'>
            <span className='side-link'>
              <div className='side-icon d-flex align-items-center justify-content-center'>
                <EgldSymbol />
              </div>
            </span>
          </div>
          <div className='d-flex flex-column justify-content-center'>
            <span className='d-block token-ticker'>{egldLabel}</span>
            <div
              className='token-description text-wrap text-neutral-400 small d-none d-md-block'
              title={description}
            >
              {description}
            </div>
          </div>
        </div>
      </td>
      <td>MultiversX (Elrond) {egldLabel}</td>
      <td>
        {economicsFetched ? `$${new BigNumber(price).toFormat(2)}` : '...'}
      </td>
      <td>
        {economicsFetched
          ? new BigNumber(circulatingSupply).toFormat(0)
          : '...'}
      </td>
      <td>
        {economicsFetched ? `$${new BigNumber(marketCap).toFormat()}` : '...'}
      </td>
      <td>{statsFetched ? new BigNumber(accounts).toFormat(0) : '...'}</td>
      <td>{statsFetched ? new BigNumber(transactions).toFormat(0) : '...'}</td>
    </tr>
  );
};
