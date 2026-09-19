import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

import { NativeTokenLogo, NetworkLink } from 'components';
import { pagerHelper } from 'components/Pager/helpers/pagerHelper';
import { formatBigNumber } from 'helpers';
import {
  useGetPage,
  useGetSearch,
  useGetSort,
  useIsNativeTokenSearched,
  useGetNativeTokenDetails
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
  const { egldLabel } = useSelector(activeNetworkSelector);
  const {
    isDataReady: isEconomicsFetched,
    price,
    marketCap,
    circulatingSupply,
    unprocessed: unProcessedEconomics
  } = useSelector(economicsSelector);
  const { isDataReady: isStatsFetched } = useSelector(statsSelector);
  const { assets, accounts, transactions } = useGetNativeTokenDetails();
  const { page, size } = useGetPage();
  const { search } = useGetSearch();
  const { sort, order } = useGetSort();
  const showOnSearch = useIsNativeTokenSearched();

  const nativeTokenLink = `/${egldLabel?.toLowerCase()}`;

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
            <NetworkLink to={nativeTokenLink} className='side-link'>
              <div className='side-icon side-icon-md-large d-flex align-items-center justify-content-center'>
                <NativeTokenLogo />
              </div>
            </NetworkLink>
          </div>
          <div className='d-flex flex-column justify-content-center'>
            <NetworkLink to={nativeTokenLink} className='d-block token-ticker'>
              {egldLabel}
            </NetworkLink>
            {assets?.description && (
              <div
                className='token-description text-wrap text-neutral-400 small d-none d-md-block'
                title={assets.description}
              >
                {assets.description}
              </div>
            )}
          </div>
        </div>
      </td>
      <td>{assets?.name ?? egldLabel}</td>
      <td>{price}</td>
      <td>{circulatingSupply}</td>
      <td>{marketCap}</td>
      <td>{formatBigNumber({ value: accounts })}</td>
      <td>{formatBigNumber({ value: transactions })}</td>
    </tr>
  );
};
