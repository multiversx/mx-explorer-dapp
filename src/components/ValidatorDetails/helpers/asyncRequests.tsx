import axios from 'axios';
import { getShardId, getUptimeDowntime } from './../../../helpers';
import { BlockType } from './../../Blocks';
import { ValidatorType } from './../../Validators';
import { initialState } from './../index';

interface GetValidatorType {
  nodeUrl: string;
  elasticUrl: string;
  hexPublicKey: string;
  timeout: number;
  metaChainShardId: number;
}

function getBlocks(response: any) {
  const { hits } = response.data;
  const blocks: BlockType[] = hits.hits.map((block: any) => block._source);

  let min = blocks[0].nonce;
  let max = min;

  for (const block in blocks) {
    // tslint:disable-line
    if (blocks[block].nonce < min) {
      min = blocks[block].nonce;
    }

    if (blocks[block].nonce > max) {
      max = blocks[block].nonce;
    }
  }

  const startBlockNr = min;
  const endBlockNr = max;
  return {
    blocks,
    startBlockNr,
    endBlockNr,
  };
}

interface GetRoundsType {
  elasticUrl: string;
  shardNumber: number;
  signersIndex: number;
  timeout: number;
}

export async function getRounds({ elasticUrl, shardNumber, signersIndex, timeout }: GetRoundsType) {
  try {
    const resp = await axios.post(
      `${elasticUrl}/rounds/_search`,
      {
        query: {
          bool: {
            must: [
              {
                match: {
                  shardId: shardNumber,
                },
              },
              {
                match: {
                  signersIndexes: signersIndex,
                },
              },
            ],
          },
        },
        sort: {
          timestamp: {
            order: 'desc',
          },
        },
        from: 0,
        size: 100,
      },
      {
        timeout,
      }
    );

    const rounds = resp.data.hits.hits.map((round: any) => ({
      key: round._id,
      value: round._source.blockWasProposed,
    }));
    return {
      rounds,
      roundsFetched: rounds.length > 0,
    };
  } catch {
    console.error('Failed rounds');
    return {
      rounds: [],
      roundsFetched: false,
    };
  }
}

export async function searchBlocks({
  elasticUrl,
  shardNumber,
  signersIndex,
  timeout,
}: GetRoundsType) {
  try {
    const response = await axios.post(
      `${elasticUrl}/blocks/_search`,
      {
        query: {
          bool: {
            must: [
              {
                match: {
                  proposer: signersIndex,
                },
              },
              {
                match: {
                  shardId: shardNumber,
                },
              },
            ],
          },
        },
        sort: {
          timestamp: {
            order: 'desc',
          },
        },
        from: 0,
        size: 25,
      },
      {
        timeout,
      }
    );

    const { blocks, startBlockNr, endBlockNr } = getBlocks(response);
    return {
      blocks,
      startBlockNr,
      endBlockNr,
      blocksFetched: true,
    };
  } catch {
    console.error('Failed rounds');
    return {
      blocks: [],
      startBlockNr: 0,
      endBlockNr: 0,
      blocksFetched: false,
    };
  }
}

export async function getValidator({
  nodeUrl,
  elasticUrl,
  metaChainShardId,
  timeout,
  hexPublicKey,
}: GetValidatorType) {
  try {
    const {
      data: { message },
    } = await axios.get(`${nodeUrl}/node/heartbeatstatus`, { timeout });

    const currentValidator = message
      .filter((validator: ValidatorType) => validator.hexPublicKey === hexPublicKey)
      .pop();

    const { shardId, shardNumber } = getShardId(currentValidator, metaChainShardId);

    const {
      versionNumber,
      isActive,
      nodeDisplayName,
      isValidator,
      publicKeyBlockSign,
    } = currentValidator;

    const {
      totalDownTimePercentege,
      totalUpTimePercentege,
      totalUpTimeLabel,
      totalDownTimeLabel,
    } = getUptimeDowntime(currentValidator);

    const instanceType = currentValidator.isValidator ? 'Validator' : 'Observer';

    if (currentValidator.isValidator) {
      const {
        data: {
          hits: { hits },
        },
      } = await axios.get(`${elasticUrl}/validators/_search`, { timeout });

      const {
        _source: { publicKeys: consensusArray },
      } = hits.filter((hit: any) => hit._id.toString() === shardNumber.toString()).pop();

      const signersIndex = consensusArray.indexOf(hexPublicKey);

      return {
        shardId,
        shardNumber,
        versionNumber,
        isActive,
        nodeDisplayName,
        isValidator,
        publicKeyBlockSign,
        totalDownTimePercentege,
        totalUpTimePercentege,
        totalUpTimeLabel,
        totalDownTimeLabel,
        instanceType,
        signersIndex,
        publicKey: hexPublicKey,
        success: true,
      };
    }
  } catch {
    console.error('Failed heartbeatstatus');
    return {
      data: initialState,
      success: false,
    };
  }
}
