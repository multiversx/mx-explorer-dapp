import { useEffect, useState } from 'react';
import { HEROTAG_SUFFIX } from 'appConstants';
import {
  urlBuilder,
  isHash,
  isContract,
  addressIsBech32,
  bech32,
  formatHerotag
} from 'helpers';
import { useAdapter, useNetworkRoute } from 'hooks';
import { TokenTypeEnum } from 'types';

export const useSearch = (searchHash: string) => {
  const networkRoute = useNetworkRoute();
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
    getUsername
  } = useAdapter();
  const [searchRoute, setSearchRoute] = useState('');
  const [isSearching, setIsSearching] = useState<undefined | boolean>();

  const notFoundRoute = networkRoute(`/search/${searchHash}`);

  const search = async () => {
    if (Boolean(searchHash)) {
      setIsSearching(true);
      const validHashChars = /^[0-9A-Fa-f]+$/i;

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

      let isPubKeyAccount = false;
      try {
        isPubKeyAccount =
          searchHash.length < 65 && addressIsBech32(bech32.encode(searchHash));
      } catch {}

      switch (true) {
        case isUsername:
          getUsername(formatHerotag(searchHash)).then((account) => {
            const newRoute = account?.data?.address
              ? networkRoute(urlBuilder.accountDetails(account.data.address))
              : notFoundRoute;
            setSearchRoute(newRoute);
          });
          break;

        case isAccount:
          getAccount({ address: searchHash }).then((account) => {
            const newRoute = account.success
              ? networkRoute(urlBuilder.accountDetails(searchHash))
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
                setSearchRoute(networkRoute(urlBuilder.nftDetails(searchHash)));
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
                case scResult.success && scResult?.data?.originalTxHash:
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
                    getAccount({ address: bech32.encode(searchHash) }).then(
                      (account) => {
                        if (account.success) {
                          if (
                            isContract(searchHash) ||
                            account.data.nonce > 0
                          ) {
                            const newRoute = networkRoute(
                              urlBuilder.accountDetails(
                                bech32.encode(searchHash)
                              )
                            );
                            setSearchRoute(newRoute);
                          }
                        }
                      }
                    );
                  }
                  setSearchRoute(notFoundRoute);
                  break;
              }
            }
          );

          break;

        default:
          Promise.all([
            getTokens({ search: searchHash, includeMetaESDT: true }),
            getCollections({ search: searchHash, excludeMetaESDT: true }),
            getUsername(formatHerotag(searchHash))
          ]).then(([tokens, collections, account]) => {
            switch (true) {
              case Boolean(tokens.success && tokens?.data?.[0]):
                const isFirstMetaESDT =
                  tokens.data[0].type === TokenTypeEnum.MetaESDT;

                if (tokens.data.length === 1) {
                  const route = isFirstMetaESDT
                    ? urlBuilder.tokenMetaEsdtDetails(tokens.data[0].identifier)
                    : urlBuilder.tokenDetails(tokens.data[0].identifier);
                  setSearchRoute(networkRoute(route));
                } else {
                  const route = isFirstMetaESDT
                    ? urlBuilder.tokensMetaESDT({ search: searchHash })
                    : urlBuilder.tokens({ search: searchHash });
                  setSearchRoute(networkRoute(route));
                }

                break;
              case Boolean(collections.success && collections?.data?.[0]):
                const route =
                  collections.data.length === 1
                    ? urlBuilder.collectionDetails(
                        collections.data[0].collection
                      )
                    : urlBuilder.collections({ search: searchHash });

                setSearchRoute(networkRoute(route));

                break;
              case account.success:
                setSearchRoute(
                  networkRoute(
                    urlBuilder.accountDetails(account?.data?.address)
                  )
                );
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
