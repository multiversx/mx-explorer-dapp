import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';

import { Loader } from 'components';
import { addressIsBech32, isContract } from 'helpers';
import { useAdapter, useGetPage, useFetchAccountStakingDetails } from 'hooks';
import { activeNetworkSelector } from 'redux/selectors';
import { setAccount } from 'redux/slices';

import { AccountDetailsCard } from './AccountDetailsCard';
import { ApplicationDetailsCard } from './ApplicationDetailsCard';
import { FailedAccount } from './FailedAccount';

export const AccountLayout = () => {
  const ref = useRef(null);

  const { firstPageRefreshTrigger } = useGetPage();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const dispatch = useDispatch();
  const { hash: address } = useParams();

  const { getAccount } = useAdapter();
  const { fetchAccountStakingDetails } = useFetchAccountStakingDetails();

  const [dataReady, setDataReady] = useState<boolean | undefined>();

  const fetchBalanceAndCount = () => {
    if (address) {
      getAccount({ address, withGuardianInfo: true }).then(
        ({ success, data }) => {
          if (success && data) {
            dispatch(setAccount({ ...data }));
          }
          setDataReady(success);
        }
      );
    }
  };

  useEffect(() => {
    if (address && !isContract(address)) {
      fetchAccountStakingDetails({ address });
    }
  }, [address, activeNetworkId]);

  useEffect(() => {
    fetchBalanceAndCount();
  }, [firstPageRefreshTrigger, activeNetworkId, address]);

  useEffect(() => {
    setDataReady(undefined);
  }, [address, activeNetworkId]);

  const loading = dataReady === undefined;
  const failed = dataReady === false || !addressIsBech32(address);

  return (
    <>
      {loading && <Loader />}
      {!loading && failed && <FailedAccount address={address} />}

      <div ref={ref}>
        {!loading && !failed && (
          <div className='container page-content'>
            {address && isContract(address) ? (
              <ApplicationDetailsCard />
            ) : (
              <AccountDetailsCard />
            )}
            <Outlet />
          </div>
        )}
      </div>
    </>
  );
};
