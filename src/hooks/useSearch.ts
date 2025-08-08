import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  DEFAULT_HRP,
  HEROTAG_SUFFIX,
  NATIVE_TOKEN_IDENTIFIER
} from 'appConstants';
import {
  urlBuilder,
  isHash,
  isContract,
  addressIsBech32,
  bech32,
  formatHerotag,
  isProof
} from 'helpers';
import { useAdapter, useGetHrp, useNetworkRoute } from 'hooks';
import { Address } from 'lib';
import { activeNetworkSelector } from 'redux/selectors';
import { TokenTypeEnum } from 'types';

export const useSearch = (hash: string) => {
  const searchHash = String(hash).trim();

  const networkRoute = useNetworkRoute();
  const hrp = useGetHrp();
  const {
    getAccount,
    getBlock,
    getTransaction,
    getTransactionInPool,
    getNode,
    getMiniBlock,
    getToken,
    getTokens,
    getNft,
    getScResult,
    getCollection,
    getCollections,
    getUsername,
    getAccounts
  } = useAdapter();
  const [searchRoute, setSearchRoute] = useState('');
  const [isSearching, setIsSearching] = useState<undefined | boolean>();

  const { egldLabel } = useSelector(activeNetworkSelector);
  const notFoundRoute = networkRoute(`/search/${searchHash}`);

  const search = async () => {
    if (Boolean(searchHash)) {
      setIsSearching(true);
      const validHashChars = /^[0-9A-Fa-f]+$/i;

      const defaultQueryParams = { size: 2 };

      const tokenQueryFields = ['type', 'identifier'].join(',');
      const collectionQueryFields = ['type', 'collection'].join(',');
      const accountQueryFields = ['address', 'ownerAddress'].join(',');

      const isAccount = addressIsBech32(searchHash);

      const isValidHash = isHash(searchHash);
      const isNode =
        validHashChars.test(searchHash) === true && searchHash.length === 192;
      const isToken =
        searchHash.includes('-') &&
        searchHash.split('-')[1].length === 6 &&
        validHashChars.test(searchHash.split('-')[1]) === true;
      const isUsername =
        searchHash.startsWith('@') || searchHash.endsWith(HEROTAG_SUFFIX);
      const isNativeToken = NATIVE_TOKEN_IDENTIFIER === searchHash;

      let isPubKeyAccount = false;
      try {
        isPubKeyAccount =
          searchHash.length < 65 &&
          addressIsBech32(bech32.encode(searchHash, hrp));
      } catch {}
      let isErdAddress = false;
      try {
        const erdAddress = Address.newFromBech32(searchHash);
        isErdAddress = erdAddress.getHrp() === DEFAULT_HRP;
      } catch {}

      switch (true) {
        case isNativeToken:
          const newRoute = networkRoute(
            urlBuilder.nativeTokenDetails(egldLabel ?? 'EGLD')
          );
          setSearchRoute(newRoute);

          break;
        case isUsername:
          getUsername(formatHerotag(searchHash)).then((account) => {
            const newRoute = account?.data?.address
              ? networkRoute(urlBuilder.accountDetails(account.data.address))
              : notFoundRoute;
            setSearchRoute(newRoute);
          });
          break;

        case isErdAddress:
        case isAccount:
          let searchAddress = searchHash;
          if (isErdAddress) {
            try {
              const erdAddress = new Address(
                Address.newFromBech32(searchHash).getPublicKey(),
                hrp
              ).toBech32();
              searchAddress = erdAddress;
            } catch {}
          }

          getAccount({ address: searchAddress }).then((account) => {
            const newRoute = account.success
              ? networkRoute(urlBuilder.accountDetails(searchAddress))
              : notFoundRoute;
            setSearchRoute(newRoute);
          });
          break;

        case isNode:
          getNode(searchHash).then((node) => {
            const newRoute = node.success
              ? networkRoute(urlBuilder.nodeDetails(searchHash))
              : notFoundRoute;
            setSearchRoute(newRoute);
          });
          break;

        case isToken:
          Promise.all([
            getToken(searchHash),
            getNft(searchHash),
            getCollection(searchHash)
          ]).then(([token, nft, collection]) => {
            switch (true) {
              case token.success:
                setSearchRoute(
                  networkRoute(urlBuilder.tokenDetails(searchHash))
                );
                break;
              case nft.success:
                const isNftProof = isProof(nft.data);
                const nftRoute = isNftProof
                  ? urlBuilder.proofDetails(searchHash)
                  : urlBuilder.nftDetails(searchHash);
                setSearchRoute(networkRoute(nftRoute));
                break;
              case collection.success:
                setSearchRoute(
                  networkRoute(urlBuilder.collectionDetails(searchHash))
                );
                break;
              default:
                setSearchRoute(notFoundRoute);
                break;
            }
          });

          break;

        case isValidHash:
          Promise.all([
            getBlock(searchHash),
            getScResult(searchHash),
            getTransaction(searchHash),
            getTransactionInPool(searchHash),
            getMiniBlock(searchHash)
          ]).then(
            ([block, scResult, transaction, transactionInPool, miniblock]) => {
              switch (true) {
                case block.success:
                  setSearchRoute(
                    networkRoute(urlBuilder.blockDetails(searchHash))
                  );
                  break;
                case Boolean(
                  scResult.success && scResult?.data?.originalTxHash
                ):
                  setSearchRoute(
                    networkRoute(
                      urlBuilder.transactionDetails(
                        `${scResult.data.originalTxHash}#${searchHash}`
                      )
                    )
                  );
                  break;
                case transaction.success:
                  setSearchRoute(
                    networkRoute(urlBuilder.transactionDetails(searchHash))
                  );
                  break;
                case transactionInPool.success:
                  setSearchRoute(
                    networkRoute(
                      urlBuilder.transactionInPoolDetails(searchHash)
                    )
                  );
                  break;
                case miniblock.success:
                  setSearchRoute(
                    networkRoute(urlBuilder.miniblockDetails(searchHash))
                  );
                  break;
                default:
                  if (isPubKeyAccount) {
                    const address = bech32.encode(searchHash, hrp);
                    getAccount({ address }).then((account) => {
                      if (account.success) {
                        if (isContract(searchHash) || account.data.nonce > 0) {
                          const newRoute = networkRoute(
                            urlBuilder.accountDetails(address)
                          );
                          setSearchRoute(newRoute);
                        }
                      }
                    });
                  }
                  setSearchRoute(notFoundRoute);
                  break;
              }
            }
          );

          break;

        default:
          Promise.all([
            getTokens({
              search: searchHash,
              includeMetaESDT: true,
              fields: tokenQueryFields,
              ...defaultQueryParams
            }),
            getCollections({
              search: searchHash,
              excludeMetaESDT: true,
              fields: collectionQueryFields,
              ...defaultQueryParams
            }),
            getAccounts({
              search: searchHash,
              isSmartContract: true,
              fields: accountQueryFields,
              ...defaultQueryParams
            }),
            getUsername(formatHerotag(searchHash)),
            getAccounts({
              search: searchHash,
              isSmartContract: false,
              fields: accountQueryFields,
              ...defaultQueryParams
            })
          ]).then(([tokens, collections, applications, username, accounts]) => {
            switch (true) {
              case Boolean(tokens.success && tokens?.data?.[0]):
                const isFirstMetaESDT =
                  tokens.data[0].type === TokenTypeEnum.MetaESDT;

                if (tokens.data.length === 1) {
                  const isNftProof = isProof(tokens.data[0]);
                  const metaRoute = isNftProof
                    ? urlBuilder.proofDetails(tokens.data[0].identifier)
                    : urlBuilder.tokenMetaEsdtDetails(
                        tokens.data[0].identifier
                      );
                  const route = isFirstMetaESDT
                    ? metaRoute
                    : urlBuilder.tokenDetails(tokens.data[0].identifier);
                  setSearchRoute(networkRoute(route));
                } else {
                  const route = isFirstMetaESDT
                    ? urlBuilder.tokensMetaESDT({ search: searchHash })
                    : urlBuilder.tokens({ search: searchHash });
                  setSearchRoute(networkRoute(route));
                }
                break;

              case Boolean(applications.success && applications?.data?.[0]):
                const applicationRoute =
                  applications.data.length === 1
                    ? urlBuilder.accountDetails(applications.data[0].address)
                    : urlBuilder.applications({ search: searchHash });

                setSearchRoute(networkRoute(applicationRoute));
                break;

              case Boolean(collections.success && collections?.data?.[0]):
                const collectionRoute =
                  collections.data.length === 1
                    ? urlBuilder.collectionDetails(
                        collections.data[0].collection
                      )
                    : urlBuilder.collections({ search: searchHash });

                setSearchRoute(networkRoute(collectionRoute));
                break;

              case Boolean(username.success && username?.data?.address):
                setSearchRoute(
                  networkRoute(urlBuilder.accountDetails(username.data.address))
                );
                break;

              case Boolean(accounts.success && accounts?.data?.[0]):
                const accountRoute =
                  accounts.data.length === 1
                    ? urlBuilder.accountDetails(accounts.data[0].address)
                    : urlBuilder.accounts({ search: searchHash });

                setSearchRoute(networkRoute(accountRoute));
                break;

              default:
                setSearchRoute(notFoundRoute);
                break;
            }
          });

          break;
      }
    }
  };

  useEffect(() => {
    if (searchRoute) {
      setIsSearching(false);
    }
  }, [searchRoute]);

  return { search, isSearching, searchRoute, setSearchRoute };
};
