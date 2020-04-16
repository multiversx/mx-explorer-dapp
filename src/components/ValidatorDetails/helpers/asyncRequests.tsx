import axios from 'axios';
import { getShardId, getUptimeDowntime } from './../../../helpers';
import { BlockType } from './../../Blocks';
import { ValidatorType } from './../../Validators';
import { getPeerType } from './../../Validators/helpers/validatorHelpers';
import { initialState } from './../index';

interface GetValidatorType {
  nodeUrl: string;
  elasticUrl: string;
  publicKey: string;
  timeout: number;
  metaChainShardId: number;
}

function getBlocks(response: any) {
  const { hits } = response.data;
  const blocks: BlockType[] = hits.hits.map((block: any) => ({
    hash: block._id,
    ...block._source,
  }));

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
  roundAtEpochStart: number;
  epoch: number;
}

export async function getRounds({
  elasticUrl,
  shardNumber,
  signersIndex,
  timeout,
  roundAtEpochStart: round,
}: GetRoundsType) {
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
              {
                range: {
                  round: {
                    gte: round,
                  },
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
    if (process.env.NODE_ENV !== 'test') {
      console.error('Failed rounds');
    }
    return {
      rounds: [],
      roundsFetched: false,
    };
  }
}

interface GetEpochType {
  nodeUrl: string;
  shardNumber: number;
  timeout: number;
}

export async function getEpoch({ nodeUrl, shardNumber, timeout }: GetEpochType) {
  try {
    const {
      data: { message },
    } = await axios.get(`${nodeUrl}/node/epoch/${shardNumber}`, {
      timeout,
    });

    return {
      epoch: message.epochData.erd_epoch_number,
      roundAtEpochStart: message.epochData.erd_round_at_epoch_start,
      epochSuccess: true,
    };
  } catch {
    return {
      epoch: 0,
      roundAtEpochStart: 0,
      epochSuccess: false,
    };
  }
}

export async function searchBlocks({
  elasticUrl,
  shardNumber,
  signersIndex,
  timeout,
  epoch,
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
              {
                match: {
                  epoch,
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
    if (process.env.NODE_ENV !== 'test') {
      console.error('Failed blocks');
    }
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
  publicKey,
}: GetValidatorType) {
  try {
    const {
      data: { message },
    } = await axios.get(`${nodeUrl}/node/heartbeatstatus?key=${publicKey}`, { timeout });

    const currentValidator = message
      .filter((validator: ValidatorType) => validator.publicKey === publicKey)
      .pop();

    const { shardId, shardNumber } = getShardId(currentValidator, metaChainShardId);

    const { versionNumber, isActive, nodeDisplayName, publicKeyBlockSign } = currentValidator;

    const {
      totalDownTimePercentege,
      totalUpTimePercentege,
      totalUpTimeLabel,
      totalDownTimeLabel,
    } = getUptimeDowntime(currentValidator);

    const isValidator =
      currentValidator.isValidator ||
      (currentValidator.peerType && !currentValidator.peerType.includes('observer'));

    const peerType = currentValidator.peerType
      ? getPeerType(currentValidator.peerType)
      : getPeerType(currentValidator.isValidator ? 'eligible' : 'observer');

    const instanceType = isValidator ? `Validator (${peerType})` : 'Observer';

    if (isValidator) {
      const { epoch, roundAtEpochStart } = await getEpoch({
        nodeUrl,
        shardNumber,
        timeout,
      });

      const {
        data: {
          _source: { publicKeys: consensusArray },
        },
      } = await axios.get(`${elasticUrl}/validators/_doc/${shardNumber}_${epoch}`, { timeout });

      const signersIndex = consensusArray.indexOf(publicKey);

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
        publicKey,
        epoch,
        roundAtEpochStart,
        success: true,
      };
    }
  } catch {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Failed heartbeatstatus');
    }
    return {
      data: initialState,
      success: false,
    };
  }
}
