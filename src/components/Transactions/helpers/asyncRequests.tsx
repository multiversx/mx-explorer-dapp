import axios from 'axios';

type ParamsType = {
  elasticUrl: string;
  size?: number;
  addressId?: string;
  timeout: number;
};

//TODO: control asupra timeoutului, si daca e prea lung sa dam noi failed manual

const setAddressQuery = (addressId: string | undefined) =>
  addressId
    ? {
        query: {
          bool: {
            should: [{ match: { sender: addressId } }, { match: { receiver: addressId } }],
          },
        },
      }
    : {
        query: { match_all: {} },
      };

export async function getTransactions({
  elasticUrl,
  addressId = '',
  size = 1,
  timeout,
}: ParamsType) {
  let data = [];
  try {
    const {
      data: { hits },
    } = await axios.post(
      `${elasticUrl}/transactions/_search`,
      {
        sort: { timestamp: { order: 'desc' } },
        from: (size - 1) * 50,
        size: 50,
        ...setAddressQuery(addressId),
      },
      { timeout }
    );

    data = hits.hits.map((entry: any) => entry._source);

    return {
      data,
      success: data.length > 0,
    };
  } catch {
    return {
      data,
      success: false,
    };
  }
}

export async function getTotalTransactions({ elasticUrl, addressId = '', timeout }: ParamsType) {
  try {
    const { data } = await axios.post(
      `${elasticUrl}/transactions/_count`,
      setAddressQuery(addressId),
      {
        timeout,
      }
    );

    return data.count;
  } catch {
    return 0;
  }
}

type DetailsType = {
  nodeUrl: string;
  addressId: string;
  timeout: number;
};

export async function getAddressDetails({ nodeUrl, addressId, timeout }: DetailsType) {
  try {
    const {
      data: {
        account: { balance, code },
      },
    } = await axios.get(`${nodeUrl}/address/${addressId}`, { timeout });

    return {
      balance,
      code,
      detailsFetched: true,
    };
  } catch {
    return {
      balance: '',
      code: '',
      detailsFetched: false,
    };
  }
}
