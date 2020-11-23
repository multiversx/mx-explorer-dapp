import axios from 'axios';
import { ProviderType, ProviderPropsType } from './../../functions';
import getNodes from './getNodes';
import * as bech32 from './bech32';
import computeShard from './computeShard';

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

const publicKeysCache: any = {};

const getPublicKeys = async ({
  shard,
  epoch,
  elasticUrl,
}: {
  shard: any;
  epoch: any;
  elasticUrl: () => string;
}) => {
  if (publicKeysCache[`${shard}_${epoch}`]) {
    return publicKeysCache[`${shard}_${epoch}`];
  }

  const url = `${elasticUrl()}/validators/_doc/${shard}_${epoch}`;

  const {
    data: {
      _source: { publicKeys },
    },
  } = await axios.get(url);

  publicKeysCache[`${shard}_${epoch}`] = publicKeys;

  return publicKeys;
};

const getValidatorIndex = async ({
  validator,
  proxyUrl = () => '',
  elasticUrl,
}: {
  validator: any;
  proxyUrl: () => string;
  elasticUrl: () => string;
}) => {
  const nodes = await getNodes({ proxyUrl });

  const { shard } = nodes.find(({ publicKey }: any) => publicKey === validator);

  const {
    data: {
      data: {
        status: { erd_epoch_number: epoch },
      },
    },
  } = await axios.get(`${proxyUrl}/network/status/${shard}`);

  const publicKeys = await getPublicKeys({ shard, epoch, elasticUrl });

  return [publicKeys.findIndex((publicKey: any) => publicKey === validator), shard];
};

const wrapper = async ({
  baseUrl,
  nodeUrl = '',
  url,
  params = {},
}: ProviderPropsType & { url: string; nodeUrl?: string }) => {
  const elasticUrl = () => baseUrl;
  const proxyUrl = () => nodeUrl;
  const [, collection, hash] = url.split('/');

  const queryStringParameters = params ? params : {};

  let query: any = {};
  let boolQuery: any = {};

  const {
    nonce,
    epoch,
    miniBlockHash,
    sender,
    receiver,
    senderShard,
    receiverShard,
    round,
    condition,
    validator,
  } = queryStringParameters;

  let { shard, fields, proposer, signersIndexes } = queryStringParameters;

  if (fields) {
    fields = fields.split(',');

    if (fields.includes('shard')) {
      fields.splice(fields.indexOf('shard'), 1);
      fields.push('shardId');
    }
  }

  if (proposer && collection === 'blocks') {
    [proposer, shard] = await getValidatorIndex({
      validator: proposer,
      proxyUrl,
      elasticUrl,
    });
  }

  if (validator && collection === 'rounds') {
    [signersIndexes, shard] = await getValidatorIndex({ validator, proxyUrl, elasticUrl });
  }

  boolQuery = createMustQuery({ nonce }, boolQuery);
  boolQuery = createMustQuery({ shardId: shard }, boolQuery);
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

  let key: any;
  switch (collection) {
    case 'blocks':
      key = 'hash';
      break;
    case 'miniblocks':
      key = 'miniBlockHash';
      break;
    case 'transactions':
      key = 'txHash';
      break;
    case 'rounds':
      key = false;
      break;
    case 'accounts':
      key = 'address';
      break;
    default:
      key = 'id';
  }

  switch (hash) {
    case 'count': {
      const url = `${elasticUrl}/${collection}/_count`;
      const params = { query };

      return axios({
        method: 'POST',
        url,
        data: { ...params },
        transformResponse: [
          function transform(resp) {
            const { count } = JSON.parse(resp);
            return { data: count };
          },
        ],
      });
    }

    case 'last': {
      const url = `${elasticUrl()}/${collection}/_search`;

      const params = {
        sort: { timestamp: { order: 'asc' } },
        query,
        size: 25,
      };

      return axios({
        method: 'POST',
        url,
        data: { ...params },
        transformResponse: [
          function transform(resp) {
            const {
              hits: { hits },
            } = JSON.parse(resp);
            const data: any = [];
            hits.map(({ _id, _source }: any) => {
              data.unshift({ id: _id, ..._source });
            });

            return { data };
          },
        ],
      });
    }

    default:
      if (hash) {
        if (collection === 'accounts') {
          return axios({
            method: 'GET',
            url: `${proxyUrl()}/address/${hash}`,
            transformResponse: [
              function transform(resp) {
                const {
                  data: {
                    account: { address, nonce, balance, code, codeHash, rootHash },
                  },
                } = JSON.parse(resp);
                const data = { address, nonce, balance, code, codeHash, rootHash };
                return { data };
              },
            ],
          });
        } else {
          const url = `${elasticUrl()}/${collection}/_doc/${hash}`;
          try {
            return axios({
              method: 'GET',
              url,
              validateStatus: (status) => {
                return status >= 200 && status < 300;
              },
              transformResponse: [
                async function transform(resp) {
                  let { _id, _source }: any = JSON.parse(resp);
                  const hash: any = {};
                  if (key) {
                    hash[key] = _id;
                  }

                  if (
                    collection === 'blocks' &&
                    (!fields || fields.includes('proposer') || fields.includes('validators'))
                  ) {
                    const { shardId: shard, epoch } = _source;

                    const publicKeys = await getPublicKeys({ shard, epoch, elasticUrl });

                    _source.proposer = publicKeys[_source.proposer];
                    _source.validators = _source.validators.map((index: any) => publicKeys[index]);
                  }

                  if (collection === 'rounds') {
                    delete _source.signersIndexes;
                  }

                  if (fields) {
                    Object.keys(_source).forEach((key) => {
                      if (!fields.includes(key)) {
                        delete _source[key];
                      }
                    });
                  }

                  if (_source.shardId !== undefined) {
                    _source.shard = _source.shardId;
                    delete _source.shardId;
                  }

                  if (_source.searchOrder !== undefined) {
                    delete _source.searchOrder;
                  }

                  _source = Object.keys(_source)
                    .sort()
                    .reduce((result: any, key) => {
                      result[key] = _source[key];
                      return result;
                    }, {});

                  return { data: { ...hash, ..._source } };
                },
              ],
            });
          } catch (error) {
            // if transaction not found in elastic
            if (collection === 'transactions' && error.response) {
              return axios({
                method: 'GET',
                url: `${proxyUrl()}/transaction/${hash}`,
                transformResponse: [
                  function transform(resp) {
                    const {
                      data: { transaction },
                    } = JSON.parse(resp);
                    const {
                      gasLimit,
                      gasPrice,
                      miniblockHash: miniBlockHash,
                      nonce,
                      receiver,
                      sender,
                      signature,
                      status,
                      value,
                    } = transaction;

                    // TODO: pending alignment
                    const receiverShard = computeShard(bech32.decode(receiver));
                    const senderShard = computeShard(bech32.decode(sender));

                    return {
                      data: {
                        txHash: hash,
                        gasLimit,
                        gasPrice,
                        miniBlockHash,
                        nonce,
                        receiver,
                        receiverShard,
                        sender,
                        senderShard,
                        signature,
                        status,
                        value,
                      },
                    };
                  },
                ],
              });
            }
          }
        }
      } else {
        const { from = 0, size = 25 } = queryStringParameters || {};

        const url = `${elasticUrl()}/${collection}/_search`;
        const params: any = {
          sort: { timestamp: { order: 'desc' } },
          query,
          from,
          size,
        };

        if (collection === 'transactions') {
          params.sort = [{ timestamp: { order: 'desc' } }, { nonce: { order: 'desc' } }];
        }

        if (collection === 'accounts') {
          params.sort = [{ balanceNum: { order: 'desc' } }];
        }

        return axios({
          method: 'POST',
          url,
          data: { ...params },
          transformResponse: [
            async function transform(resp) {
              try {
                const {
                  hits: { hits },
                } = JSON.parse(resp);

                const data: any = [];

                // tslint:disable-next-line
                for (const index in hits) {
                  let { _id, _source } = hits[index];
                  const hash: any = {};
                  if (key) {
                    hash[key] = _id;
                  }

                  if (
                    collection === 'blocks' &&
                    (!fields || fields.includes('proposer') || fields.includes('validators'))
                  ) {
                    const { shardId: shard, epoch } = _source;

                    const publicKeys = await getPublicKeys({ shard, epoch, elasticUrl });

                    _source.proposer = publicKeys[_source.proposer];
                    _source.validators = _source.validators.map((index: any) => publicKeys[index]);
                  }

                  if (collection === 'rounds') {
                    delete _source.signersIndexes;
                  }

                  if (collection === 'accounts') {
                    delete _source.balanceNum;
                  }

                  if (fields) {
                    Object.keys(_source).forEach((key) => {
                      if (!fields.includes(key)) {
                        delete _source[key];
                      }
                    });
                  }

                  if (_source.shardId !== undefined) {
                    _source.shard = _source.shardId;
                    delete _source.shardId;
                  }

                  if (_source.searchOrder !== undefined) {
                    delete _source.searchOrder;
                  }

                  _source = Object.keys(_source)
                    .sort()
                    .reduce((result: any, key) => {
                      result[key] = _source[key];
                      return result;
                    }, {});

                  data.push({ ...hash, ..._source });
                }

                return data;
              } catch (err) {
                return 112; // TODO: undo
              }
            },
          ],
        });
      }
  }
};

const elastic: ProviderType = async ({ baseUrl, url, params, timeout, proxyUrl = '' }) => {
  return wrapper({
    baseUrl,
    proxyUrl,
    url,
    params,
    timeout,
  });
};

export default elastic;
