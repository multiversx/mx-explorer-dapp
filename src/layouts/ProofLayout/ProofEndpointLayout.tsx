import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Outlet, Navigate } from 'react-router-dom';

import { Loader, PageState } from 'components';
import { useAdapter, useGetPage, useIsMainnet, useNetworkRoute } from 'hooks';
import { faReceipt } from 'icons/regular';
import { activeNetworkSelector, proofSelector } from 'redux/selectors';
import { setProof } from 'redux/slices';

import { ProofDetailsCard } from './ProofDetailsCard';

export const ProofEndpointLayout = () => {
  const dispatch = useDispatch();
  const isMainnet = useIsMainnet();
  const networkRoute = useNetworkRoute();
  const { getProof } = useAdapter();
  const { hash: identifier } = useParams();
  const { firstPageRefreshTrigger } = useGetPage();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { proofState } = useSelector(proofSelector);

  const [isDataReady, setIsDataReady] = useState<boolean | undefined>();

  const fetchProofDetails = () => {
    if (identifier) {
      getProof(identifier).then(({ success, data }) => {
        if (success && data) {
          dispatch(setProof({ isFetched: true, proofState: data }));
        }

        setIsDataReady(success);
      });
    }
  };

  useEffect(() => {
    fetchProofDetails();
  }, [firstPageRefreshTrigger, activeNetworkId, identifier]);

  const loading =
    isDataReady === undefined ||
    (identifier && identifier !== proofState.identifier);
  const failed = isDataReady === false;

  if (failed) {
    return (
      <PageState
        icon={faReceipt}
        title='Unable to locate this Proof'
        description={
          <div className='px-spacer'>
            <span className='text-break-all'>{identifier}</span>
          </div>
        }
        isError
      />
    );
  }

  if (loading) {
    return <Loader />;
  }

  // Redirect to not-found page until route/api structure final on mainnet
  if (isMainnet) {
    return <Navigate replace to={networkRoute('/not-found')} />;
  }

  return (
    <div className='container page-content'>
      <ProofDetailsCard />
      <Outlet />
    </div>
  );
};
