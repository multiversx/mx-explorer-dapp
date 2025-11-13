import { useSelector } from 'react-redux';

import { PageState } from 'components';
import { faSearch } from 'icons/regular';
import { searchSelector } from 'redux/selectors';

export const SearchAccounts = () => {
  const { search, searchQuery } = useSelector(searchSelector);

  const { account, accounts } = search;

  return <></>;
};
