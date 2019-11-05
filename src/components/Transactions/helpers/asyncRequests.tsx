import axios from 'axios';

type ParamsType = {
  elasticUrl: string;
  size?: number;
  addressId?: string;
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

export async function getTransactions({ elasticUrl, addressId = '', size = 1 }: ParamsType) {
  let data = [];
  try {
    const {
      data: { hits },
    } = await axios.post(`${elasticUrl}/transactions/_search`, {
      sort: { timestamp: { order: 'desc' } },
      from: (size - 1) * 50,
      size: 50,
      ...setAddressQuery(addressId),
    });

    data = hits.hits.map((entry: any) => entry._source);

    return {
      data,
      success: true,
    };
  } catch {
    return {
      data,
      success: false,
    };
  }
}

export async function getTotalTransactions({ elasticUrl, addressId = '' }: ParamsType) {
  try {
    const { data } = await axios.post(
      `${elasticUrl}/transactions/_count`,
      setAddressQuery(addressId)
    );

    return data.count;
  } catch {
    return 0;
  }
}

type DetailsType = {
  nodeUrl: string;
  addressId: string;
};

export async function getAddressDetails({ nodeUrl, addressId }: DetailsType) {
  try {
    const {
      data: { balance, code },
    } = await axios.get(`${nodeUrl}/address/${addressId}`);

    return {
      balance,
      code,
      detailsFetched: true,
    };
  } catch {
    return {
      balance: 0,
      code: 0,
      detailsFetched: false,
    };
  }
}
