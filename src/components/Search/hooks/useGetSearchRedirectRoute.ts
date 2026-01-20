import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { urlBuilder } from 'helpers';
import { useNetworkRoute } from 'hooks';
import { searchSelector } from 'redux/selectors';
import { NftTypeEnum, TokenTypeEnum } from 'types';

export const useGetSearchRedirectRoute = () => {
  const networkRoute = useNetworkRoute();
  const { search } = useSelector(searchSelector);

  const redirectRoute = useMemo(() => {
    const { accounts, tokens, collections, nfts, ...redirectResults } = search;
    const suggestionResults = {
      ...accounts,
      ...tokens,
      ...collections,
      ...nfts
    };
    const hasSuggestionsResults = Object.keys(suggestionResults).length > 0;
    const hasRedirectResults = Object.keys(redirectResults).length > 0;

    if (!hasRedirectResults || hasSuggestionsResults) {
      return;
    }

    const {
      account,
      token,
      collection,
      nft,
      node,
      block,
      miniblock,
      transaction,
      scResult,
      transactionInPool
    } = redirectResults;

    if (account) {
      return networkRoute(urlBuilder.accountDetails(account.address));
    }

    if (node) {
      return networkRoute(urlBuilder.nodeDetails(node.bls));
    }

    if (block) {
      return networkRoute(urlBuilder.blockDetails(block.hash));
    }

    if (miniblock) {
      return networkRoute(urlBuilder.miniblockDetails(miniblock.miniBlockHash));
    }

    if (scResult) {
      return networkRoute(
        urlBuilder.transactionDetails(
          `${scResult.originalTxHash}#${scResult.hash}`
        )
      );
    }

    if (transactionInPool) {
      return networkRoute(
        urlBuilder.transactionInPoolDetails(transactionInPool.txHash)
      );
    }

    if (transaction) {
      return networkRoute(urlBuilder.transactionDetails(transaction.txHash));
    }

    if (collection) {
      if (collection.type === NftTypeEnum.MetaESDT) {
        return networkRoute(
          urlBuilder.tokenMetaEsdtDetails(collection.collection)
        );
      }

      return networkRoute(urlBuilder.collectionDetails(collection.collection));
    }

    if (token) {
      if (token.type === TokenTypeEnum.MetaESDT) {
        return networkRoute(urlBuilder.tokenMetaEsdtDetails(token.identifier));
      }

      return networkRoute(urlBuilder.tokenDetails(token.identifier));
    }

    if (nft) {
      return networkRoute(urlBuilder.nftDetails(nft.identifier));
    }
  }, [search]);

  return redirectRoute;
};
