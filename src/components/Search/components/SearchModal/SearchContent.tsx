import { SearchFooter } from '../SearchFooter/SearchFooter';
import { SearchSuggestions } from '../SearchSuggestions/SearchSuggestions';

export const SearchContent = () => {
  return (
    <div className='search-content'>
      <SearchSuggestions />
      <SearchFooter />
    </div>
  );
};
