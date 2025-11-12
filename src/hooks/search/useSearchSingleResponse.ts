import { isContract, bech32, formatHerotag } from 'helpers';
import { useAdapter, useGetHrp } from 'hooks';
import { Address } from 'lib';

import { SearchSingleResponseType } from 'types';
import { useGetSearchQueryType } from './useGetSearchQueryType';

export const useSearchSingleResponse = (hash: string) => {
  const hrp = useGetHrp();
  const getSearchQueryType = useGetSearchQueryType();
  const {
    getAccount,
    getBlock,
    getTransaction,
    getTransactionInPool,
    getNode,
    getMiniBlock,
    getToken,
    getNft,
    getScResult,
    getCollection,
    getUsername
  } = useAdapter();

  const searchHash = String(hash).trim();

  const searchSingleResponse = async (): Promise<SearchSingleResponseType> => {
    if (searchHash === undefined) {
      return {};
    }

    const {
      isAccount,
      isValidHash,
      isNode,
      isToken,
      isUsername,
      isErdAddress,
      isPubKeyAccount
    } = getSearchQueryType(searchHash);

    if (isUsername) {
      const { data } = await getUsername(formatHerotag(searchHash));
      if (data?.address) {
        return { account: data };
      }
    }

    if (isAccount) {
      const { data } = await getAccount({ address: searchHash });
      if (data?.address) {
        return { account: data };
      }
    }

    // Search for erd HRP on custom HRP
    if (isErdAddress) {
      try {
        const erdAddress = new Address(
          Address.newFromBech32(searchHash).getPublicKey(),
          hrp
        ).toBech32();
        const { data } = await getAccount({ address: erdAddress });
        if (data?.address) {
          return { account: data };
        }
      } catch {}
    }

    if (isNode) {
      const { data } = await getNode(searchHash);
      if (data?.bls) {
        return { node: data };
      }
    }

    if (isToken) {
      const [tokenResponse, nftResponse, collectionResponse] =
        await Promise.all([
          getToken(searchHash),
          getNft(searchHash),
          getCollection(searchHash)
        ]);

      if (tokenResponse?.data?.identifier) {
        return { token: tokenResponse?.data };
      }
      if (nftResponse?.data?.identifier) {
        return { token: nftResponse?.data };
      }
      if (collectionResponse?.data?.collection) {
        return { collection: collectionResponse?.data };
      }
    }

    if (isValidHash) {
      const [
        blockResponse,
        miniblockResponse,
        scResultResponse,
        transactionResponse,
        transactionInPoolResponse
      ] = await Promise.all([
        getBlock(searchHash),
        getMiniBlock(searchHash),
        getScResult(searchHash),
        getTransaction(searchHash),
        getTransactionInPool(searchHash)
      ]);

      if (blockResponse?.data?.hash) {
        return { block: blockResponse?.data };
      }
      if (miniblockResponse?.data?.miniBlockHash) {
        return { miniblock: miniblockResponse?.data };
      }
      if (scResultResponse?.data?.originalTxHash) {
        return { scResult: scResultResponse?.data };
      }
      if (transactionResponse?.data?.hash) {
        return { transaction: transactionResponse?.data };
      }
      if (transactionInPoolResponse?.data?.hash) {
        return { transactionInPool: transactionInPoolResponse?.data };
      }

      // Might be an account
      if (isPubKeyAccount) {
        const address = bech32.encode(searchHash, hrp);
        const { data } = await getAccount({ address: address });
        if (data?.address && (isContract(data.address) || data.nonce > 0)) {
          return { account: data };
        }
      }
    }

    return {};
  };

  return searchSingleResponse;
};
