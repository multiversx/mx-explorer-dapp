import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';

import {
  DetailItem,
  Loader,
  Pager,
  PageSize,
  PageState,
  CollectionBlock,
  FormatAmount,
  NftBadge,
  NetworkLink
} from 'components';
import { isProof, urlBuilder } from 'helpers';
import { useAdapter, useGetPage } from 'hooks';
import { faCoins } from 'icons/solid';
import { AccountTabs } from 'layouts/AccountLayout/AccountTabs';
import { activeNetworkSelector, accountSelector } from 'redux/selectors';
import { NftType } from 'types';

export const AccountNfts = () => {
  const ref = useRef(null);
  const { page, size } = useGetPage();

  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const [searchParams] = useSearchParams();
  const { account } = useSelector(accountSelector);
  const { txCount } = account;

  const { getAccountNfts, getAccountNftsCount } = useAdapter();

  const { hash: address } = useParams() as any;

  const [dataReady, setDataReady] = useState<boolean | undefined>();
  const [accountNfts, setAccountNfts] = useState<NftType[]>([]);
  const [accountNftsCount, setAccountNftsCount] = useState(0);

  const fetchAccountNfts = () => {
    Promise.all([
      getAccountNfts({
        page,
        size,
        address,
        excludeMetaESDT: true
      }),
      getAccountNftsCount({ address, excludeMetaESDT: true })
    ]).then(([accountNftsData, accountNftsCountData]) => {
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
  }, [txCount, activeNetworkId, address, searchParams]);

  return (
    <div className='card' ref={ref}>
      <div className='card-header'>
        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
          <AccountTabs />
          {dataReady === true && accountNfts.length > 0 && (
            <Pager
              total={accountNftsCount}
              show={accountNfts.length > 0}
              className='d-flex ms-auto me-auto me-sm-0'
            />
          )}
        </div>
      </div>
      <div className='card-body pt-0 px-lg-spacer py-lg-4'>
        <div className='px-0'>
          {dataReady === undefined && <Loader data-testid='nftsLoader' />}
          {dataReady === false && (
            <PageState icon={faCoins} title='Unable to load NFTs' isError />
          )}
          {dataReady === true && accountNfts.length === 0 && (
            <PageState icon={faCoins} title='No NFTs' />
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
                            <FormatAmount
                              showLabel={false}
                              showSymbol={false}
                              value={nft.balance ? nft.balance : '0'}
                              decimals={nft.decimals}
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
                                className='side-icon me-1'
                                alt=''
                                role='presentation'
                              />
                            )}
                            <div className='text-truncate'>
                              {nft.identifier}
                            </div>
                          </div>
                        </NetworkLink>
                      </div>
                      <NftBadge
                        type={nft.type}
                        subType={nft.subType}
                        isProof={isProof(nft)}
                        className='ms-2'
                      />
                    </div>
                  </DetailItem>
                );
              })}
            </>
          )}
        </div>
      </div>

      {dataReady === true && accountNfts.length > 0 && (
        <div className='card-footer table-footer'>
          <PageSize />
          <Pager total={accountNftsCount} show={accountNfts.length > 0} />
        </div>
      )}
    </div>
  );
};
