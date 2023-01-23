import * as React from 'react';

import { Loader, useAdapter } from 'components';
import { useSize, useGetHash } from 'helpers';
import { FailedCollectionDetails } from './FailedCollectionDetails';
import { CollectionDetailsCard } from './CollectionDetailsCard';

import { useSelector, useDispatch } from 'react-redux';
import { activeNetworkSelector } from 'redux/selectors';
import { setCollection } from 'redux/slices';

export const CollectionLayout = ({ children }: { children: React.ReactNode }) => {
  const ref = React.useRef(null);
  const { firstPageTicker } = useSize();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const dispatch = useDispatch();
  const { getCollection } = useAdapter();

  const collection = useGetHash();

  const [dataReady, setDataReady] = React.useState<boolean | undefined>();

  const fetchCollectionDetails = () => {
    if (collection) {
      getCollection(collection).then((collectionDetailsData) => {
        if (ref.current !== null) {
          if (collectionDetailsData.success && collectionDetailsData?.data) {
            dispatch(setCollection(collectionDetailsData.data));
            setDataReady(true);
          }

          if (dataReady === undefined) {
            setDataReady(collectionDetailsData.success);
          }
        }
      });
    }
  };

  React.useEffect(() => {
    fetchCollectionDetails();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPageTicker, activeNetworkId, collection]);

  React.useEffect(() => {
    setDataReady(undefined);
  }, [collection, activeNetworkId]);

  const loading = dataReady === undefined;
  const failed = dataReady === false;

  return (
    <>
      {loading && <Loader />}
      {!loading && failed && <FailedCollectionDetails collection={collection} />}

      <div ref={ref}>
        {!loading && !failed && (
          <div className="container page-content">
            <CollectionDetailsCard />
            {children}
          </div>
        )}
      </div>
    </>
  );
};
