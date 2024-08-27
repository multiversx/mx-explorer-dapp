import classNames from 'classnames';
import { useSearchParams } from 'react-router-dom';

import { Pager, TableSearch } from 'components';
import { TokenType, TokenTypeEnum } from 'types';

export interface AccountTokensTableHeaderUIType {
  accountTokensCount?: number;
  accountTokens?: TokenType[];
}

export const AccountTokensTableHeader = ({
  accountTokens = [],
  accountTokensCount
}: AccountTokensTableHeaderUIType) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { type } = Object.fromEntries(searchParams);

  const updateTokenType = (typeValue?: TokenTypeEnum) => {
    const { type, page, size, ...rest } = Object.fromEntries(searchParams);
    const nextUrlParams = {
      ...rest,
      ...(typeValue ? { type: typeValue } : {})
    };

    setSearchParams(nextUrlParams);
  };

  return (
    <>
      <div className='filters d-flex align-items-start align-items-md-center justify-content-md-between flex-column flex-md-row gap-3'>
        <menu className='list-inline m-0 d-flex flex-wrap gap-2'>
          <li className='list-inline-item me-0'>
            <button
              type='button'
              onClick={() => {
                updateTokenType();
              }}
              className={classNames(
                'badge badge-outline badge-outline-grey py-2 px-3 br-lg',
                {
                  active: !type
                }
              )}
            >
              All
            </button>
          </li>
          <li className='list-inline-item me-0'>
            <button
              type='button'
              onClick={() => {
                updateTokenType(TokenTypeEnum.FungibleESDT);
              }}
              className={classNames(
                'badge badge-outline badge-outline-grey py-2 px-3 br-lg',
                {
                  active: type === TokenTypeEnum.FungibleESDT
                }
              )}
            >
              Tokens
            </button>
          </li>
          <li className='list-inline-item me-0'>
            <button
              type='button'
              onClick={() => {
                updateTokenType(TokenTypeEnum.MetaESDT);
              }}
              className={classNames(
                'badge badge-outline badge-outline-grey py-2 px-3 br-lg',
                {
                  active: type === TokenTypeEnum.MetaESDT
                }
              )}
            >
              Meta-ESDT
            </button>
          </li>
        </menu>
        <div className='filters tokens-filters d-flex align-items-start align-items-md-center justify-content-md-between flex-column flex-md-row gap-3'>
          <TableSearch
            searchValue={accountTokensCount}
            placeholderText='token'
            className='input-group-sm'
          />
        </div>
      </div>
      {accountTokens.length > 0 && (
        <Pager
          total={accountTokensCount}
          show={accountTokens.length > 0}
          className='d-flex ms-auto me-auto me-sm-0'
        />
      )}
    </>
  );
};
