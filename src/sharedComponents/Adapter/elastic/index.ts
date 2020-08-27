import axios from 'axios';
const response = ({ body }: any) => body;

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

const handler = async ({ path, queryStringParameters, elasticUrl: elastic }: any) => {
  const [, collection, id] = path.split('/');

  // @ts-ignore
  const elasticUrl = typeof elasticAddr === 'function' ? elasticAddr : () => elastic;

  if (typeof queryStringParameters === 'string') {
    const urlParams = new URLSearchParams(queryStringParameters);
    // @ts-ignore
    queryStringParameters = Object.fromEntries(urlParams);
  } else {
    queryStringParameters = queryStringParameters ? queryStringParameters : {};
  }

  let query: any = {};
  let boolQuery: any = {};
  let results;

  const {
    nonce,
    shardId,
    epoch,
    proposer,
    miniBlockHash,
    sender,
    receiver,
    senderShard,
    receiverShard,
    signersIndexes,
    round,
  } = queryStringParameters;

  boolQuery = createMustQuery({ nonce }, boolQuery);
  boolQuery = createMustQuery({ shardId }, boolQuery);
  boolQuery = createMustQuery({ epoch }, boolQuery);
  boolQuery = createMustQuery({ proposer }, boolQuery);
  boolQuery = createMustQuery({ signersIndexes }, boolQuery);

  boolQuery = createShouldQuery({ miniBlockHash }, boolQuery);
  boolQuery = createShouldQuery({ sender }, boolQuery);
  boolQuery = createShouldQuery({ receiver }, boolQuery);
  boolQuery = createShouldQuery({ senderShard }, boolQuery);
  boolQuery = createShouldQuery({ receiverShard }, boolQuery);

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
    const url = `${elasticUrl()}/${collection}/_count`;
    const params = { query };

    const {
      data: { count },
    } = await axios.post(url, params);

    results = { body: count };
  } else if (id) {
    const url = `${elasticUrl()}/${collection}/_doc/${id}`;

    try {
      const { data } = await axios.get(url);
      results = { body: { id: data._id, ...data._source } };
    } catch (err) {
      results = { code: 404 };
    }
  } else {
    const { from = 0, size = 25 } = queryStringParameters || {};

    const url = `${elasticUrl()}/${collection}/_search`;
    const params = {
      sort: { timestamp: { order: 'desc' } },
      query,
      from,
      size,
    };
    const {
      data: {
        hits: { hits },
      },
    } = await axios.post(url, params);

    const body: any = [];
    hits.map(({ _id, _source }: any) => {
      body.push({ id: _id, ..._source });
    });

    results = { body };
  }

  return response(results);
};

export default handler;
