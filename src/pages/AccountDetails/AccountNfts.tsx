import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';

import {
  Loader,
  Pager,
  PageSize,
  PageState,
  AccountNftTable,
  NftDisplayToggle,
  NftList
} from 'components';
import {
  useAbortSignal,
  useAdapter,
  useGetNftDisplay,
  useGetPage
} from 'hooks';
import { faCoins } from 'icons/solid';
import { AccountTabs } from 'layouts/AccountLayout/AccountTabs';
import { activeNetworkSelector, accountSelector } from 'redux/selectors';
import { NftDisplayEnum, NftType } from 'types';

export const AccountNfts = () => {
  const ref = useRef(null);
  const { page, size } = useGetPage();
  const { nftDisplay } = useGetNftDisplay();

  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { account } = useSelector(accountSelector);
  const { txCount } = account;

  const { getAccountNfts, getAccountNftsCount } = useAdapter();
  const getAbortSignal = useAbortSignal();

  const { hash: address } = useParams() as any;

  const [dataReady, setDataReady] = useState<boolean | undefined>();
  const [accountNfts, setAccountNfts] = useState<NftType[]>([]);
  const [accountNftsCount, setAccountNftsCount] = useState(0);

  const fetchAccountNfts = () => {
    const signal = getAbortSignal();

    Promise.all([
      getAccountNfts({
        page,
        size,
        address,
        excludeMetaESDT: true,
        signal
      }),
      getAccountNftsCount({ address, excludeMetaESDT: true, signal })
    ]).then(([accountNftsData, accountNftsCountData]) => {
      if (signal.aborted) {
        return;
      }

      if (ref.current !== null) {
        if (accountNftsData.success && accountNftsCountData.success) {
          setAccountNfts(accountNftsData.data);
          setAccountNftsCount(accountNftsCountData.data);
        }
        setDataReady(accountNftsData.success && accountNftsCountData.success);
      }
    });
  };

  useEffect(() => {
    fetchAccountNfts();
  }, [txCount, activeNetworkId, address, page, size]);

  const showAccountNfts = dataReady === true && accountNfts.length > 0;
  const isTableDisplay = nftDisplay === NftDisplayEnum.table;

  return (
    <div className='card' ref={ref}>
      <div className='card-header'>
        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
          <AccountTabs />
          {showAccountNfts && (
            <div className='d-flex align-items-center flex-wrap gap-3 ms-auto me-auto me-sm-0'>
              <NftDisplayToggle />
              <Pager
                total={accountNftsCount}
                show={accountNfts.length > 0}
                className='d-flex'
              />
            </div>
          )}
        </div>
      </div>
      <div
        className={
          isTableDisplay ? 'card-body' : 'card-body pt-0 px-lg-spacer py-lg-4'
        }
      >
        <div className='px-0'>
          {dataReady === undefined && <Loader data-testid='nftsLoader' />}
          {dataReady === false && (
            <PageState icon={faCoins} title='Unable to load NFTs' isError />
          )}
          {dataReady === true && accountNfts.length === 0 && (
            <PageState icon={faCoins} title='No NFTs' />
          )}

          {showAccountNfts &&
            (isTableDisplay ? (
              <AccountNftTable nfts={accountNfts} />
            ) : (
              <NftList nfts={accountNfts} />
            ))}
        </div>
      </div>

      {showAccountNfts && (
        <div className='card-footer table-footer'>
          <PageSize />
          <Pager total={accountNftsCount} show={accountNfts.length > 0} />
        </div>
      )}
    </div>
  );
};
