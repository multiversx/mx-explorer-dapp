import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

import { BRAND_NAME } from 'appConstants';
import { NativeTokenLogo } from 'components';
import { pagerHelper } from 'components/Pager/helpers/pagerHelper';
import {
  useGetPage,
  useGetSearch,
  useGetSort,
  useIsSovereign,
  useIsNativeTokenSearched
} from 'hooks';
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

export const NativeTokenRow = ({
  tokens,
  index,
  totalTokens
}: {
  tokens: TokenType[];
  index: number;
  totalTokens: number;
}) => {
  const { egldLabel, name } = useSelector(activeNetworkSelector);
  const {
    isFetched: isEconomicsFetched,
    price,
    marketCap,
    circulatingSupply,
    unprocessed: unProcessedEconomics
  } = useSelector(economicsSelector);
  const {
    isFetched: isStatsFetched,
    accounts,
    transactions,
    unprocessed: unProcessedStats
  } = useSelector(statsSelector);

  const { page, size } = useGetPage();
  const { search } = useGetSearch();
  const { sort, order } = useGetSort();
  const isSovereign = useIsSovereign();

  const description = isSovereign
    ? `${egldLabel} Token is native to ${name ?? BRAND_NAME}`
    : `The ${BRAND_NAME} eGold (${egldLabel}) Token is native to the ${BRAND_NAME} Network and will be used for everything from staking, governance, transactions, smart contracts and validator rewards.`;

  const showOnSearch = useIsNativeTokenSearched();
  let showOnFilter = (!page || page === 1) && index === 0;

  const previousToken = tokens[index > 0 ? index - 1 : 0];
  const currentToken = tokens[index];
  const nextToken = tokens[index < tokens.length - 1 ? index + 1 : index];

  const { lastPage } = pagerHelper({
    total: totalTokens,
    itemsPerPage: size,
    page: Number(page)
  });
  const isLastPage = lastPage === page;

  if (
    sort &&
    order &&
    Object.keys(TokenSortEnum).includes(sort) &&
    Object.keys(SortOrderEnum).includes(order) &&
    isEconomicsFetched &&
    isStatsFetched
  ) {
    const egldToken: DummyTokenType = {
      price: unProcessedEconomics.price,
      marketCap: unProcessedEconomics.marketCap,
      circulatingSupply: unProcessedEconomics.circulatingSupply,
      accounts: unProcessedStats.accounts,
      transactions: unProcessedStats.transactions
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
          previousToken?.identifier === currentToken?.identifier &&
          (!page || page === 1)
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
          nextToken?.identifier === currentToken?.identifier && isLastPage
            ? egldIsGreaterThanPrevious
            : egldIsLess;
      }
    }
  }

  const show =
    (!search || showOnSearch) && (showOnFilter || tokens.length === 0);

  if (!show) {
    return null;
  }

  return (
    <tr className='egld-row'>
      <td>
        <div className='token-identity d-flex flex-row'>
          <div className='d-flex align-items-center me-3'>
            <span className='side-link'>
              <div className='side-icon side-icon-md-large d-flex align-items-center justify-content-center'>
                <NativeTokenLogo />
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
      <td>
        {isSovereign ? name : BRAND_NAME} {egldLabel}
      </td>
      <td>{price}</td>
      <td>{circulatingSupply}</td>
      <td>{marketCap}</td>
      <td>{accounts}</td>
      <td>{transactions}</td>
    </tr>
  );
};
