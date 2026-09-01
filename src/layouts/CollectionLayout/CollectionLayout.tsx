import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Outlet } from 'react-router';

import { Loader } from 'components';
import { useAdapter, useGetPage } from 'hooks';
import { activeNetworkSelector, collectionSelector } from 'redux/selectors';
import { setCollection } from 'redux/slices';

import { CollectionDetailsCard } from './CollectionDetailsCard';
import { FailedCollectionDetails } from './FailedCollectionDetails';

export const CollectionLayout = () => {
  const dispatch = useDispatch();
  const { getCollection } = useAdapter();
  const { hash: collection } = useParams();
  const { poolingFirstPageRefreshTrigger } = useGetPage();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { collectionState } = useSelector(collectionSelector);

  const [isDataReady, setIsDataReady] = useState<boolean | undefined>();

  const fetchCollectionDetails = () => {
    if (collection) {
      getCollection(collection).then(({ success, data }) => {
        if (success && data) {
          dispatch(setCollection({ isDataReady: true, collectionState: data }));
        }

        setIsDataReady(success);
      });
    }
  };

  useEffect(() => {
    fetchCollectionDetails();
  }, [poolingFirstPageRefreshTrigger, activeNetworkId, collection]);

  const loading =
    isDataReady === undefined ||
    (collection && collection !== collectionState.collection);
  const failed = isDataReady === false;

  if (failed) {
    return <FailedCollectionDetails collection={collection} />;
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className='container page-content'>
      <CollectionDetailsCard />
      <Outlet />
    </div>
  );
};
