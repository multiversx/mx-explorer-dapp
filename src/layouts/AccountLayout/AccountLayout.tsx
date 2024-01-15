import { useEffect, useRef, useState } from 'react';
import BigNumber from 'bignumber.js';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';

import { MAX_ACOUNT_TOKENS_BALANCE } from 'appConstants';
import { Loader } from 'components';
import { addressIsBech32, getTotalTokenUsdValue, isContract } from 'helpers';
import { useAdapter, useGetPage, useFetchAccountStakingDetails } from 'hooks';
import { activeNetworkSelector } from 'redux/selectors';
import { setAccount, setAccountExtra } from 'redux/slices';
import { SortOrderEnum } from 'types';

import { AccountDetailsCard } from './AccountDetailsCard';
import { ApplicationDetailsCard } from './ApplicationDetailsCard';
import { FailedAccount } from './FailedAccount';

export const AccountLayout = () => {
  const ref = useRef(null);

  const { firstPageRefreshTrigger } = useGetPage();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const dispatch = useDispatch();
  const { hash: address } = useParams();

  const { getAccount, getAccountTokens, getAccountTransfers } = useAdapter();
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

  const fetchExtraDetails = () => {
    if (address) {
      if (isContract(address)) {
        getAccountTokens({
          address,
          size: MAX_ACOUNT_TOKENS_BALANCE,
          fields: 'valueUsd',
          includeMetaESDT: false
        }).then(({ data, success }) => {
          let tokenBalance = new BigNumber(0).toString();
          if (success && data) {
            const totalTokenUsdValue = getTotalTokenUsdValue(data);
            tokenBalance = totalTokenUsdValue;
          }
          dispatch(
            setAccountExtra({
              accountExtra: {
                tokenBalance
              },
              isFetched: success
            })
          );
        });
      } else {
        fetchAccountStakingDetails({ address });
        getAccountTransfers({
          address,
          size: 1,
          order: SortOrderEnum.asc,
          fields: 'timestamp'
        }).then(({ data, success }) => {
          let firstTransactionDate = undefined;
          if (success && data && data.length > 0) {
            firstTransactionDate = data[0]?.['timestamp'];
          }
          dispatch(
            setAccountExtra({
              accountExtra: {
                firstTransactionDate
              },
              isFetched: success
            })
          );
        });
      }
    }
  };

  useEffect(() => {
    fetchExtraDetails();
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
