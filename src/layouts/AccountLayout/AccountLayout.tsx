import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';

import { Loader } from 'components';
import { addressIsBech32, isContract } from 'helpers';
import {
  useAbortSignal,
  useAdapter,
  useGetPage,
  useFetchAccountStakingDetails
} from 'hooks';
import { activeNetworkSelector, accountSelector } from 'redux/selectors';
import {
  setAccount,
  setAccountStaking,
  setAccountExtra,
  getInitialAccountStakingState,
  getInitialAccountExtraState
} from 'redux/slices';

import { AccountDetailsCard } from './AccountDetailsCard';
import { ApplicationDetailsCard } from './ApplicationDetailsCard';
import { FailedAccount } from './FailedAccount';

export const AccountLayout = () => {
  const dispatch = useDispatch();
  const { getAccount } = useAdapter();
  const getAbortSignal = useAbortSignal();
  const { fetchAccountStakingDetails } = useFetchAccountStakingDetails();
  const { hash: address } = useParams();
  const { poolingFirstPageRefreshTrigger } = useGetPage();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { account } = useSelector(accountSelector);

  const [isDataReady, setIsDataReady] = useState<boolean | undefined>();

  const fetchBalanceAndCount = () => {
    if (address) {
      const signal = getAbortSignal();

      getAccount({
        address,
        withGuardianInfo: true,
        withAssets: true,
        withTxCount: true,
        signal
      }).then(({ success, data }) => {
        if (signal.aborted) {
          return;
        }

        if (success && data) {
          dispatch(setAccount({ isDataReady: true, account: data }));
        }

        setIsDataReady(success);
      });
    }
  };

  useEffect(() => {
    setIsDataReady(undefined);
    dispatch(setAccountExtra(getInitialAccountExtraState()));
    dispatch(setAccountStaking(getInitialAccountStakingState()));
    if (address && !isContract(address)) {
      fetchAccountStakingDetails({ address });
    }
  }, [address, activeNetworkId]);

  useEffect(() => {
    fetchBalanceAndCount();
  }, [poolingFirstPageRefreshTrigger, activeNetworkId, address]);

  const loading =
    isDataReady === undefined || (address && account.address !== address);
  const failed = !address || isDataReady === false || !addressIsBech32(address);

  if (failed) {
    return <FailedAccount address={address} />;
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className='container page-content'>
      {isContract(address) ? (
        <ApplicationDetailsCard />
      ) : (
        <AccountDetailsCard />
      )}
      <Outlet />
    </div>
  );
};
