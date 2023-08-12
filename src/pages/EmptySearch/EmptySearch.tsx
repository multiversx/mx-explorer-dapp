import React from 'react';
import { faSearch } from '@fortawesome/pro-regular-svg-icons';
import { useParams } from 'react-router-dom';

import { PageState } from 'components';

export const EmptySearch = () => {
  const { hash: query } = useParams() as any;

  return (
    <PageState
      icon={faSearch}
      title="Your search does not match anything we've got"
      description={
        <div className='px-spacer'>
          <span className='text-break-all'>{query}</span>
        </div>
      }
      className='py-spacer m-auto'
      dataTestId='errorScreen'
    />
  );
};
