import axios from 'axios';
import { validatorFunctions } from 'helpers';
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

export async function searchBlocks({
  elasticUrl,
  shardNumber,
  signersIndex,
  timeout,
  epoch,
}: validatorFunctions.GetRoundsType) {
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

    const { shardId, shardNumber } = validatorFunctions.getShardId(
      currentValidator,
      metaChainShardId
    );

    const { versionNumber, isActive, nodeDisplayName, publicKeyBlockSign } = currentValidator;

    const {
      totalDownTimePercentege,
      totalUpTimePercentege,
      totalUpTimeLabel,
      totalDownTimeLabel,
    } = validatorFunctions.getUptimeDowntime(currentValidator);

    const isValidator =
      currentValidator.isValidator ||
      (currentValidator.peerType && !currentValidator.peerType.includes('observer'));

    const peerType = currentValidator.peerType
      ? getPeerType(currentValidator.peerType)
      : getPeerType(currentValidator.isValidator ? 'eligible' : 'observer');

    const instanceType = isValidator ? `Validator (${peerType})` : 'Observer';

    if (isValidator) {
      const { epoch, roundAtEpochStart } = await validatorFunctions.getEpoch({
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
