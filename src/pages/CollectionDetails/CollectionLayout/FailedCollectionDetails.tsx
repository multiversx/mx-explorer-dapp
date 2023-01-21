import * as React from 'react';
import { PageState } from 'components';
import { faCoins } from '@fortawesome/pro-regular-svg-icons/faCoins';

export const FailedCollectionDetails = ({ collection }: { collection: string | undefined }) => {
  return (
    <PageState
      icon={faCoins}
      title="Unable to locate this collection"
      description={
        <div className="px-spacer">
          <span className="text-break-all">{collection}</span>
        </div>
      }
      className="py-spacer my-auto"
      dataTestId="errorScreen"
    />
  );
};
