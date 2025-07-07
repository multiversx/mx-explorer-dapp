import { useState, ReactElement, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { components, GroupBase } from 'react-select';
import Creatable, { CreatableProps } from 'react-select/creatable';
import {
  withAsyncPaginate,
  UseAsyncPaginateParams,
  ComponentProps
} from 'react-select-async-paginate';

import { NATIVE_TOKEN_SEARCH_LABEL } from 'appConstants';
import { SelectOptionType, NativeTokenLogo } from 'components';
import { useAdapter, useGetHash, useActiveRoute } from 'hooks';
import { activeNetworkSelector } from 'redux/selectors';
import { accountsRoutes } from 'routes';
import { CollectionType, TokenType, WithClassnameType } from 'types';

type AsyncPaginateCreatableProps<
  OptionType,
  Group extends GroupBase<OptionType>,
  Additional,
  IsMulti extends boolean
> = CreatableProps<OptionType, IsMulti, Group> &
  UseAsyncPaginateParams<OptionType, Group, Additional> &
  ComponentProps<OptionType, Group, IsMulti>;

type AsyncPaginateCreatableType = <
  OptionType,
  Group extends GroupBase<OptionType>,
  Additional,
  IsMulti extends boolean = false
>(
  props: AsyncPaginateCreatableProps<OptionType, Group, Additional, IsMulti>
) => ReactElement;

const CreatableAsyncPaginate = withAsyncPaginate(
  Creatable
) as AsyncPaginateCreatableType;

type AdditionalType = {
  page: number;
};

const defaultAdditional: AdditionalType = {
  page: 1
};

export interface TokenSelectOptionType extends SelectOptionType {
  svgUrl?: string;
}

export interface TokenSelectFilterUIType extends WithClassnameType {
  name: string;
  filter: string;
  options?: TokenSelectOptionType[];
  placeholder?: string;
  hasCustomSearch?: boolean;
  hasShowAllOption?: boolean;
  showAllPlaceholder?: string;
  isMulti?: boolean;
  isClearable?: boolean;
  defaultToken?: string;
  validation?: 'address' | 'hash';
  noOptionsMessage?: string;
}

const Option: typeof components.Option = (props) => {
  return (
    <components.Option {...props}>
      <div className='d-flex align-items-center symbol text-truncate'>
        {(props?.data as TokenSelectOptionType)?.svgUrl && (
          <img
            src={(props.data as TokenSelectOptionType).svgUrl}
            className='side-icon me-1'
            alt=''
            role='presentation'
          />
        )}
        {(props.data as TokenSelectOptionType).value ===
          NATIVE_TOKEN_SEARCH_LABEL && (
          <NativeTokenLogo className='side-icon me-1' role='presentation' />
        )}
        <span className='text-truncate'>{props.label}</span>
      </div>
    </components.Option>
  );
};

export const TokenSelectFilter = ({
  name,
  filter,
  options = [],
  placeholder = 'Select...',
  className = '',
  defaultToken,
  hasShowAllOption = true,
  isMulti = false,
  isClearable = true,
  showAllPlaceholder = 'Show All',
  noOptionsMessage
}: TokenSelectFilterUIType) => {
  const { egldLabel } = useSelector(activeNetworkSelector);
  const [defaultValue, setDefaultValue] = useState<SelectOptionType>();
  const activeRoute = useActiveRoute();
  const address = useGetHash();

  const {
    getTokens,
    getCollections,
    getToken,
    getCollection,
    getAccountTokens
  } = useAdapter();

  const [searchParams, setSearchParams] = useSearchParams();

  const unique = (options: SelectOptionType[], set = new Set()) =>
    options.filter(({ value }) => (set.has(value) ? false : set.add(value)));

  const existingValues = useMemo(() => {
    const paramsObject = Object.fromEntries(searchParams);
    if (paramsObject[filter]) {
      return paramsObject[filter].split(',');
    }
    if (defaultToken) {
      return [defaultToken];
    }
    return [];
  }, [defaultToken, searchParams]);

  const defaultOptions = useMemo(() => {
    const appendedDefaultOptions = [...options];
    const hasExistingShowAllOption = appendedDefaultOptions.find(
      (option) => option.label === showAllPlaceholder
    );

    const hasExistingEgldOption = appendedDefaultOptions.find(
      (option) => option.label === egldLabel
    );

    if (hasShowAllOption && !hasExistingShowAllOption) {
      appendedDefaultOptions.push({ value: '', label: showAllPlaceholder });
    }

    if (!hasExistingEgldOption && egldLabel) {
      appendedDefaultOptions.push({
        value: NATIVE_TOKEN_SEARCH_LABEL,
        label: egldLabel
      });
    }

    if (defaultValue) {
      appendedDefaultOptions.push(defaultValue);
    }

    const set = new Set();
    appendedDefaultOptions.filter(({ value }) =>
      set.has(value) ? false : set.add(value)
    );

    return unique(appendedDefaultOptions);
  }, [options, egldLabel, showAllPlaceholder, defaultValue]);

  useEffect(() => {
    if (defaultValue || existingValues.length === 0) {
      return;
    }
    const searchedToken = existingValues[0];
    const isEgld = searchedToken === NATIVE_TOKEN_SEARCH_LABEL;
    if (isEgld && egldLabel) {
      const defaultVal = {
        value: NATIVE_TOKEN_SEARCH_LABEL,
        label: egldLabel
      };
      setDefaultValue(defaultVal);
      return;
    }

    // get only for first

    getToken(searchedToken).then(({ data, success }) => {
      if (data && success) {
        const { identifier, assets, ticker } = data as TokenType;
        const label = assets && ticker ? ticker : identifier;
        const defaultVal = {
          value: identifier,
          label,
          ...(assets?.svgUrl ? { svgUrl: assets.svgUrl } : {})
        };
        setDefaultValue(defaultVal);
      } else {
        getCollection(searchedToken).then(({ data, success }) => {
          if (data && success) {
            const { collection, assets, ticker } = data as CollectionType;
            const label = assets && ticker ? ticker : collection;
            const defaultVal = {
              value: collection,
              label,
              ...(assets?.svgUrl ? { svgUrl: assets.svgUrl } : {})
            };
            setDefaultValue(defaultVal);
          } else {
            const defaultVal = {
              value: searchedToken,
              label: searchedToken
            };
            setDefaultValue(defaultVal);
          }
        });
      }
    });
  }, [existingValues, defaultValue, egldLabel]);

  const updateSelectValue = (selectValue: string) => {
    const paramsObject = Object.fromEntries(searchParams);
    delete paramsObject[filter];
    const { page, size, ...rest } = paramsObject;

    const nextUrlParams = {
      ...rest,
      ...(selectValue ? { [filter]: selectValue } : {})
    };

    setSearchParams(nextUrlParams);
    document.body.click();
  };

  const loadOptions = async (search: string, page: number) => {
    let tokenOptions: SelectOptionType[] = [];
    let collectionsOptions: SelectOptionType[] = [];
    let tokenResponse = undefined;

    if (
      (activeRoute(accountsRoutes.accountDetails) ||
        activeRoute(accountsRoutes.accountAnalytics)) &&
      address
    ) {
      tokenResponse = await getAccountTokens({
        address,
        page,
        search,
        fields: 'identifier,ticker,assets'
      });
    } else {
      tokenResponse = await getTokens({
        page,
        search,
        fields: 'identifier,ticker,assets'
      });
    }

    if (tokenResponse.success && tokenResponse.data) {
      tokenOptions = tokenResponse.data
        .filter(({ identifier }: TokenType) => {
          return identifier !== defaultValue?.value;
        })
        .map(({ identifier, assets, ticker }: TokenType) => {
          const label = assets ? ticker : identifier;
          return {
            value: identifier,
            label,
            ...(assets?.svgUrl ? { svgUrl: assets.svgUrl } : {})
          };
        });
    }
    if (search) {
      const collectionsResponse = await getCollections({
        page,
        search,
        fields: 'collection,ticker,assets'
      });
      if (collectionsResponse.success && collectionsResponse.data) {
        collectionsOptions = collectionsResponse.data
          .filter(({ collection }: CollectionType) => {
            return collection !== defaultValue?.value;
          })
          .map(({ collection, assets, ticker }: CollectionType) => {
            const label = assets ? ticker : collection;
            return {
              value: collection,
              label,
              ...(assets?.svgUrl ? { svgUrl: assets.svgUrl } : {})
            };
          });
      }
    }

    const options = [...tokenOptions, ...collectionsOptions];
    const hasMore = options.length > 0;

    return {
      options,
      hasMore
    };
  };

  const loadPageOptions = async (
    search: string,
    _prevOptions: unknown,
    { page }: AdditionalType
  ) => {
    const { options, hasMore } = await loadOptions(search, page);

    return {
      options,
      hasMore,
      additional: {
        page: page + 1
      }
    };
  };

  if (
    defaultOptions.length === 0 ||
    (existingValues.length > 0 && !defaultValue)
  ) {
    return null;
  }

  return (
    <CreatableAsyncPaginate
      debounceTimeout={700}
      additional={defaultAdditional}
      loadOptions={loadPageOptions as any}
      defaultValue={defaultValue}
      defaultOptions={defaultOptions}
      name={name}
      data-testid={name}
      className={`styled-select ${className}`}
      classNamePrefix='styled-select'
      placeholder={placeholder}
      createOptionPosition='first'
      formatCreateLabel={(inputValue: string) => `Search for ${inputValue}`}
      isClearable={isClearable}
      components={{
        Option
      }}
      onChange={(e) => {
        if (Array.isArray(e) && isMulti) {
          const values = e.map((value) => value.value).join(',');
          updateSelectValue(values);
        } else {
          if ((e as any)?.value !== undefined) {
            updateSelectValue((e as any).value.toString());
          } else {
            updateSelectValue('');
            document.body.click();
          }
        }
      }}
      noOptionsMessage={(message) => {
        return noOptionsMessage ? <>{noOptionsMessage}</> : <>{message}</>;
      }}
      {...(isMulti ? { isMulti: true } : {})}
    />
  );
};
