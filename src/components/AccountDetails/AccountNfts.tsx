import React from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { faCoins } from '@fortawesome/pro-solid-svg-icons/faCoins';
import { adapter, DetailItem, Loader, Pager, PageState } from 'sharedComponents';
import { useGlobalState } from 'context';
import AccountTabs from './AccountLayout/AccountTabs';
import { urlBuilder, useFilters, useNetworkRoute } from 'helpers';
import { NftType } from 'helpers/types';

const AccountNfts = () => {
  const ref = React.useRef(null);
  const { activeNetwork, accountDetails } = useGlobalState();
  const { size } = useFilters();
  const networkRoute = useNetworkRoute();

  const { getAccountNfts, getAccountNftsCount } = adapter();

  const { hash: address } = useParams() as any;
  const nftsActive = activeNetwork.adapter === 'api';

  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [accountNfts, setAccountNfts] = React.useState<NftType[]>([]);
  const [accountNftsCount, setAccountNftsCount] = React.useState(0);

  const fetchAccountNfts = () => {
    if (nftsActive) {
      Promise.all([
        getAccountNfts({
          size,
          address,
        }),
        getAccountNftsCount(address),
      ]).then(([accountNftsData, accountNftsCountData]) => {
        if (ref.current !== null) {
          if (accountNftsData.success && accountNftsCountData.success) {
            setAccountNfts(accountNftsData.data);
            setAccountNftsCount(accountNftsCountData.data);
          }
          setDataReady(accountNftsData.success && accountNftsCountData.success);
        }
      });
    }
  };

  React.useEffect(() => {
    fetchAccountNfts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountDetails.txCount, activeNetwork.id, address, size]);

  return !nftsActive ? (
    <Redirect to={networkRoute(urlBuilder.accountDetails(address))} />
  ) : (
    <div className="card" ref={ref}>
      <div className="card-header">
        <div className="card-header-item d-flex justify-content-between align-items-center">
          <AccountTabs />
        </div>
      </div>
      <div className="card-body pt-0 px-lg-spacer py-lg-4">
        <div className="container-fluid">
          {dataReady === undefined && <Loader dataTestId="nftsLoader" />}
          {dataReady === false && (
            <PageState
              icon={faCoins}
              title="Unable to load NFTs"
              className="py-spacer my-auto"
              dataTestId="errorScreen"
            />
          )}
          {dataReady === true && accountNfts.length === 0 && (
            <PageState icon={faCoins} title="No NFTs" className="py-spacer my-auto" />
          )}

          {dataReady === true && accountNfts.length > 0 && (
            <>
              {accountNfts.map(({ identifier, name, balance, type }) => {
                return (
                  <DetailItem title={name} key={identifier}>
                    {Number(balance) > 1 ? <span className="mr-2">{balance}</span> : null}
                    <span className="mr-2 text-muted">{identifier}</span>
                    <div className="badge badge-secondary font-weight-light">
                      {type === 'SemiFungibleESDT' ? 'SFT' : 'NFT'}
                    </div>
                  </DetailItem>
                );
              })}
              <div className="card-footer d-flex justify-content-end border-0">
                <Pager
                  itemsPerPage={25}
                  page={String(size)}
                  total={accountNftsCount}
                  show={accountNfts.length > 0}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountNfts;
