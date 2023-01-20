import * as React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { collectionRoutes } from 'routes';
import { useGlobalDispatch, useGlobalState } from 'context';
import { Loader, adapter } from 'sharedComponents';
import { useSize, useNetworkRoute } from 'helpers';
import FailedCollectionDetails from './FailedCollectionDetails';
import CollectionDetailsCard from './CollectionDetailsCard';

const CollectionLayout = ({ children }: { children: React.ReactNode }) => {
  const ref = React.useRef(null);
  const { firstPageTicker } = useSize();
  const { activeNetwork } = useGlobalState();
  const dispatch = useGlobalDispatch();
  const { getCollection } = adapter();
  const networkRoute = useNetworkRoute();

  const match: any = useRouteMatch(networkRoute(collectionRoutes.collectionDetails));
  const collection = match ? match.params.hash : undefined;

  const [dataReady, setDataReady] = React.useState<boolean | undefined>();

  const fetchCollectionDetails = () => {
    getCollection(collection).then((collectionDetailsData) => {
      const details = collectionDetailsData.success ? collectionDetailsData.data : {};

      if (ref.current !== null) {
        if (collectionDetailsData.success) {
          dispatch({
            type: 'setCollectionDetails',
            collectionDetails: {
              ...details,
            },
          });
          setDataReady(true);
        }

        if (dataReady === undefined) {
          setDataReady(collectionDetailsData.success);
        }
      }
    });
  };

  React.useEffect(() => {
    fetchCollectionDetails();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPageTicker, activeNetwork.id, collection]);

  React.useEffect(() => {
    setDataReady(undefined);
  }, [collection, activeNetwork.id]);

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

export default CollectionLayout;
