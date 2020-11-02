import { faSearch } from '@fortawesome/pro-regular-svg-icons/faSearch';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { PageState } from 'sharedComponents';

const EmptySearch = () => {
  const { query } = useParams() as any;

  return (
    <PageState
      icon={faSearch}
      title="Your search does not match anything we've got"
      description={query}
      className="py-spacer m-auto"
      dataTestId="errorScreen"
    />
  );
};

export default EmptySearch;
