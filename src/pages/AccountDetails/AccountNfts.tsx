import React from 'react';
import { faCoins } from '@fortawesome/pro-solid-svg-icons/faCoins';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useAdapter,
  DetailItem,
  Loader,
  Pager,
  PageState,
  CollectionBlock,
  Denominate,
  NftBadge,
  NetworkLink
} from 'components';

import { urlBuilder, useGetFilters, useNetworkRoute } from 'helpers';
import { activeNetworkSelector, accountSelector } from 'redux/selectors';
import { NftType } from 'types';
import { AccountTabs } from './AccountLayout/AccountTabs';

export const AccountNfts = () => {
  const ref = React.useRef(null);
  const navigate = useNavigate();

  const { size } = useGetFilters();
  const networkRoute = useNetworkRoute();
  const { adapter, id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { txCount } = useSelector(accountSelector);

  const { getAccountNfts, getAccountNftsCount } = useAdapter();

  const { hash: address } = useParams() as any;
  const nftsActive = adapter === 'api';

  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [accountNfts, setAccountNfts] = React.useState<NftType[]>([]);
  const [accountNftsCount, setAccountNftsCount] = React.useState(0);

  const fetchAccountNfts = () => {
    if (nftsActive) {
      const type = 'SemiFungibleESDT,NonFungibleESDT';
      Promise.all([
        getAccountNfts({
          size,
          address,
          type
        }),
        getAccountNftsCount({ address, type })
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
  }, [txCount, activeNetworkId, address, size]);

  return !nftsActive ? (
    navigate(networkRoute(urlBuilder.accountDetails(address)))
  ) : (
    <div className='card' ref={ref}>
      <div className='card-header'>
        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap'>
          <AccountTabs />

          {dataReady === true && accountNfts.length > 0 && (
            <Pager
              itemsPerPage={25}
              page={String(size)}
              total={accountNftsCount}
              show={accountNfts.length > 0}
              className='d-none d-sm-flex ms-auto'
            />
          )}
        </div>
      </div>
      <div className='card-body pt-0 px-lg-spacer py-lg-4'>
        <div className='container-fluid'>
          {dataReady === undefined && <Loader dataTestId='nftsLoader' />}
          {dataReady === false && (
            <PageState
              icon={faCoins}
              title='Unable to load NFTs'
              className='py-spacer my-auto'
              dataTestId='errorScreen'
            />
          )}
          {dataReady === true && accountNfts.length === 0 && (
            <PageState
              icon={faCoins}
              title='No NFTs'
              className='py-spacer my-auto'
            />
          )}

          {dataReady === true && accountNfts.length > 0 && (
            <>
              {accountNfts.map((nft) => {
                return (
                  <DetailItem
                    title={<CollectionBlock nft={nft} />}
                    key={nft.identifier}
                  >
                    <div className='d-flex align-items-center'>
                      {nft.balance !== undefined && (
                        <div className='me-1'>
                          {nft.decimals ? (
                            <Denominate
                              showLabel={false}
                              value={nft.balance ? nft.balance : '0'}
                              denomination={nft.decimals}
                            />
                          ) : (
                            Number(nft.balance).toLocaleString('en')
                          )}
                        </div>
                      )}
                      <div className='d-flex text-truncate'>
                        <NetworkLink
                          to={urlBuilder.nftDetails(nft.identifier)}
                          className={`d-flex text-truncate ${
                            nft?.assets?.svgUrl ? 'side-link' : ''
                          }`}
                        >
                          <div className='d-flex align-items-center symbol text-truncate'>
                            {nft?.assets?.svgUrl && (
                              <img
                                src={nft.assets.svgUrl}
                                alt={nft.identifier}
                                className='side-icon me-1'
                              />
                            )}
                            <div className='text-truncate'>
                              {nft.identifier}
                            </div>
                          </div>
                        </NetworkLink>
                      </div>
                      <NftBadge type={nft.type} className='ms-2' />
                    </div>
                  </DetailItem>
                );
              })}
            </>
          )}
        </div>
      </div>

      {dataReady === true && accountNfts.length > 0 && (
        <div className='card-footer px-1 px-sm-spacer d-flex justify-content-center justify-content-sm-end'>
          <Pager
            itemsPerPage={25}
            page={String(size)}
            total={accountNftsCount}
            show={accountNfts.length > 0}
          />
        </div>
      )}
    </div>
  );
};
