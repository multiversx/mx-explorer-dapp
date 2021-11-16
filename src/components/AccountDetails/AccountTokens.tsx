import React from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { faCoins } from '@fortawesome/pro-solid-svg-icons/faCoins';
import {
  adapter,
  DetailItem,
  Loader,
  Pager,
  PageState,
  Denominate,
  NetworkLink,
} from 'sharedComponents';
import { useGlobalState } from 'context';
import AccountTabs from './AccountLayout/AccountTabs';
import { urlBuilder, useFilters, useNetworkRoute } from 'helpers';
import { TokenType, NftType } from 'helpers/types';

const AccountTokens = () => {
  const ref = React.useRef(null);
  const { activeNetwork, accountDetails } = useGlobalState();
  const { size } = useFilters();
  const networkRoute = useNetworkRoute();

  const {
    getAccountTokens,
    getAccountTokensCount,
    getAccountNfts,
    getAccountNftsCount,
  } = adapter();

  const { hash: address } = useParams() as any;
  const tokensActive = activeNetwork.adapter === 'api';

  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [accountTokens, setAccountTokens] = React.useState<TokenType[]>([]);
  const [accountTokensCount, setAccountTokensCount] = React.useState(0);
  const [accountNfts, setAccountNfts] = React.useState<NftType[]>([]);
  const [accountNftsCount, setAccountNftsCount] = React.useState(0);

  const fetchAccountTokens = () => {
    if (tokensActive) {
      const type = 'MetaESDT';
      Promise.all([
        getAccountTokens({
          size,
          address,
        }),
        getAccountTokensCount(address),
        getAccountNfts({
          size,
          address,
          type,
        }),
        getAccountNftsCount({ address, type }),
      ]).then(
        ([accountTokensData, accountTokensCountData, accountNftsData, accountNftsCountData]) => {
          if (ref.current !== null) {
            if (
              accountTokensData.success &&
              accountTokensCountData.success &&
              accountNftsData.success &&
              accountNftsCountData.success
            ) {
              setAccountTokens(accountTokensData.data);
              setAccountTokensCount(accountTokensCountData.data);
              setAccountNfts(accountNftsData.data);
              setAccountNftsCount(accountNftsCountData.data);
            }
            setDataReady(
              accountTokensData.success &&
                accountTokensCountData.success &&
                accountNftsData.success &&
                accountNftsCountData.success
            );
          }
        }
      );
    }
  };

  React.useEffect(() => {
    fetchAccountTokens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountDetails.txCount, activeNetwork.id, address, size]);

  return !tokensActive ? (
    <Redirect to={networkRoute(urlBuilder.accountDetails(address))} />
  ) : (
    <div className="card" ref={ref}>
      <div className="card-header">
        <div className="card-header-item d-flex justify-content-between align-items-center">
          <AccountTabs />
          {dataReady === true && (accountTokens.length > 0 || accountNfts.length > 0) && (
            <div className="d-none d-md-flex">
              <Pager
                itemsPerPage={25}
                page={String(size)}
                total={accountTokensCount}
                show={accountTokens.length > 0 || accountNfts.length > 0}
              />
            </div>
          )}
        </div>
      </div>
      <div className="card-body pt-0 px-lg-spacer py-lg-4">
        <div className="container-fluid">
          {dataReady === undefined && <Loader dataTestId="tokensLoader" />}
          {dataReady === false && (
            <PageState
              icon={faCoins}
              title="Unable to load tokens"
              className="py-spacer my-auto"
              dataTestId="errorScreen"
            />
          )}
          {dataReady === true && accountTokens.length === 0 && accountNfts.length === 0 && (
            <PageState icon={faCoins} title="No tokens" className="py-spacer my-auto" />
          )}

          {dataReady === true && (accountTokens.length > 0 || accountNfts.length > 0) && (
            <>
              {accountNfts.map(({ name, identifier, decimals, balance, assets }) => {
                return (
                  <DetailItem title={name} key={identifier}>
                    <div className="d-flex align-items-center">
                      <div className="mr-1">
                        <Denominate
                          showLabel={false}
                          value={balance ? balance : '0'}
                          denomination={decimals}
                        />
                      </div>

                      <NetworkLink
                        to={urlBuilder.nftDetails(identifier)}
                        className={`d-flex text-truncate ${assets?.svgUrl ? 'token-link' : ''}`}
                      >
                        <div className="d-flex align-items-center symbol text-truncate">
                          {assets?.svgUrl && (
                            <img src={assets.svgUrl} alt={name} className="token-icon mr-1" />
                          )}
                          <div className="text-truncate">
                            {name} ({identifier})
                          </div>
                        </div>
                      </NetworkLink>
                    </div>
                  </DetailItem>
                );
              })}
              {accountTokens.map(({ identifier, name, balance, decimals, assets }) => {
                return (
                  <DetailItem title={name} key={identifier}>
                    <div className="d-flex align-items-center">
                      <div className="mr-1">
                        <Denominate
                          showLabel={false}
                          value={balance ? balance : '0'}
                          denomination={decimals}
                        />
                      </div>

                      <NetworkLink
                        to={urlBuilder.tokenDetails(identifier)}
                        className={`d-flex text-truncate ${assets?.svgUrl ? 'token-link' : ''}`}
                      >
                        <div className="d-flex align-items-center symbol text-truncate">
                          {assets?.svgUrl && (
                            <img src={assets.svgUrl} alt={name} className="token-icon mr-1" />
                          )}
                          <div className="text-truncate">{assets ? name : identifier}</div>
                        </div>
                      </NetworkLink>
                    </div>
                  </DetailItem>
                );
              })}
            </>
          )}
        </div>
      </div>
      <div className="card-footer d-flex justify-content-end border-0 pt-0">
        {dataReady === true && (accountTokens.length > 0 || accountNfts.length > 0) && (
          <Pager
            itemsPerPage={25}
            page={String(size)}
            total={accountTokensCount}
            show={accountTokens.length > 0 || accountNfts.length > 0}
          />
        )}
      </div>
    </div>
  );
};

export default AccountTokens;
