import axios from 'axios';
import bech32 from 'bech32';
import { addressIsBech32 } from 'helpers';

interface ParamsType {
  elasticUrl: string;
  size?: number;
  addressId?: string;
  shardType: 'senderShard' | 'receiverShard' | undefined;
  shardId: number | undefined;
  timeout: number;
}

const getAddressParams = (addressId: string | undefined) =>
  addressId
    ? {
        sender: addressId,
        receiver: addressId,
      }
    : {};

const getShardTypeParams = (
  shardId: number | undefined,
  shardType: 'senderShard' | 'receiverShard' | undefined
) =>
  shardId && shardType
    ? {
        [shardType]: shardId,
      }
    : {};

export async function getTransactions({
  elasticUrl,
  addressId = '',
  size = 1,
  shardId,
  shardType,
  timeout,
}: ParamsType) {
  const params = {
    from: (size - 1) * 50,
    size: 50,
    ...getAddressParams(addressId),
    ...getShardTypeParams(shardId, shardType),
  };

  try {
    let { data } = await axios.get(`${elasticUrl}/transactions`, { params, timeout });

    data = data.map((entry: any) => ({ hash: entry.id, ...entry }));

    return {
      data,
      success: data.length > 0,
    };
  } catch {
    return {
      data: [],
      success: false,
    };
  }
}

export async function getTotalTransactions({
  elasticUrl,
  addressId = '',
  size = 1,
  shardId,
  shardType,
  timeout,
}: ParamsType) {
  try {
    const params = {
      ...getAddressParams(addressId),
      ...getShardTypeParams(shardId, shardType),
    };

    const { data } = await axios.get(`${elasticUrl}/transactions/count`, { params, timeout });

    return {
      count: data,
      success: true,
    };
  } catch {
    return {
      count: 0,
      success: false,
    };
  }
}

interface DetailsType {
  nodeUrl: string;
  addressId: string;
  timeout: number;
}

export async function getAddressDetails({ nodeUrl, addressId, timeout }: DetailsType) {
  try {
    const {
      data: {
        data: {
          account: { balance, code, nonce },
        },
        code: responseCode,
        error,
      },
    } = await axios.get(`${nodeUrl}/address/${addressId}`, { timeout });

    if (responseCode === 'successful') {
      return {
        addressId,
        balance,
        nonce,
        code,
        detailsFetched: true,
      };
    } else {
      throw new Error(error);
    }
  } catch (err) {
    return {
      addressId: '',
      balance: '0',
      nonce: 0,
      code: '',
      detailsFetched: addressIsBech32(addressId),
    };
  }
}

function hexPublicKeyFromAddress(bech32addr: string) {
  const dec = bech32.decode(bech32addr, 256);
  return Buffer.from(bech32.fromWords(dec.words)).toString('hex');
}

export async function getRewards({
  timeout,
  addressId,
  func,
}: {
  func: 'getClaimableRewards' | 'getUserStake';
  timeout: number;
  addressId: string;
}) {
  try {
    const {
      data: { data, code: responseCode, error },
    } = await axios.post(
      `http://18.157.134.171:8080/vm-values/int`,
      JSON.stringify({
        ScAddress: 'erd1qqqqqqqqqqqqqpgqxwakt2g7u9atsnr03gqcgmhcv38pt7mkd94q6shuwt',
        FuncName: func,
        Args: [hexPublicKeyFromAddress(addressId)],
      }),
      { timeout }
    );
    if (responseCode === 'successful') {
      return data.data;
    } else {
      throw new Error(error);
    }
  } catch (err) {
    return 0;
  }
}
