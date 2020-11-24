import axios from 'axios';
import { ProviderType, ProviderPropsType } from './../functions';

const createMustQuery = (value: any, boolQuery: any) => {
  const firstKey = Object.keys(value)[0];

  if (value[firstKey] === undefined) {
    return boolQuery;
  }

  if (!boolQuery.must) {
    boolQuery.must = [];
  }
  boolQuery.must.push({ match: { ...value } });
  return boolQuery;
};

const createShouldQuery = (value: any, boolQuery: any) => {
  const firstKey = Object.keys(value)[0];
  if (value[firstKey] === undefined) {
    return boolQuery;
  }

  if (!boolQuery.should) {
    boolQuery.should = [];
  }
  boolQuery.should.push({ match: { ...value } });
  return boolQuery;
};

const wrapper = ({ baseUrl, url, params = {}, timeout }: ProviderPropsType & { url: string }) => {
  const [, collection, id] = url.split('/');

  let query: any = {};
  let boolQuery: any = {};

  const {
    nonce,
    shard,
    epoch,
    proposer,
    miniBlockHash,
    sender,
    receiver,
    senderShard,
    receiverShard,
    signersIndexes,
    round,
    condition,
  } = params;

  boolQuery = createMustQuery({ nonce }, boolQuery);
  boolQuery = createMustQuery({ shard }, boolQuery);
  boolQuery = createMustQuery({ epoch }, boolQuery);
  boolQuery = createMustQuery({ proposer }, boolQuery);
  boolQuery = createMustQuery({ signersIndexes }, boolQuery);

  boolQuery = createShouldQuery({ miniBlockHash }, boolQuery);
  boolQuery = createShouldQuery({ senderShard }, boolQuery);
  boolQuery = createShouldQuery({ receiverShard }, boolQuery);

  switch (condition) {
    case 'must':
      boolQuery = createMustQuery({ sender }, boolQuery);
      boolQuery = createMustQuery({ receiver }, boolQuery);
      break;

    default:
      boolQuery = createShouldQuery({ sender }, boolQuery);
      boolQuery = createShouldQuery({ receiver }, boolQuery);
      break;
  }

  //#region EXCEPTIONS
  if (round) {
    if (!boolQuery.must) {
      boolQuery.must = [];
    }
    boolQuery.must.push({
      range: {
        round: { gte: round },
      },
    });
  }
  //#endregion

  if (Object.keys(boolQuery).length > 0) {
    query.bool = boolQuery;
  } else {
    query = { match_all: {} };
  }

  if (id === 'count') {
    return axios.post(
      `${baseUrl}/${collection}/_count`,
      {
        query,
      },
      {
        timeout,
        transformResponse: [
          (data) => {
            const { count } = JSON.parse(data);
            return count;
          },
        ],
      }
    );
  } else if (id !== undefined) {
    return axios.get(`${baseUrl}/${collection}/_doc/${id}`, {
      timeout,
      transformResponse: [
        (resp) => {
          const data = JSON.parse(resp);
          return { id: data._id, ...data._source };
        },
      ],
    });
  } else {
    const { from = 0, size = 25 } = params || {};

    return axios.post(
      `${baseUrl}/${collection}/_search`,
      {
        sort: { timestamp: { order: 'desc' } },
        query,
        from,
        size,
      },
      {
        timeout,
        transformResponse: [
          (data) => {
            const {
              hits: { hits },
            } = JSON.parse(data);
            const body: any = [];
            hits.map(({ _id, _source }: any) => {
              body.push({ id: _id, ..._source });
              return null;
            });
            return body;
          },
        ],
      }
    );
  }
};

const elastic: ProviderType = async ({ baseUrl, url, params, timeout }) => {
  return wrapper({
    baseUrl,
    url,
    params,
    timeout,
  });
};

export default elastic;
