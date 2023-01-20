import { faSearch } from '@fortawesome/pro-regular-svg-icons/faSearch';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { PageState } from 'sharedComponents';

const EmptySearch = () => {
  const { hash: query } = useParams() as any;

  return (
    <PageState
      icon={faSearch}
      title="Your search does not match anything we've got"
      description={
        <div className="px-spacer">
          <span className="text-break-all">{query}</span>
        </div>
      }
      className="py-spacer m-auto"
      dataTestId="errorScreen"
    />
  );
};

export default EmptySearch;
