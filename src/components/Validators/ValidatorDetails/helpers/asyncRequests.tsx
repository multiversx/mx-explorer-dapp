import axios from 'axios';
import { validatorFunctions } from 'helpers';
import { BlockType } from 'components/Blocks';
import { ValidatorType } from 'context/validators';
import { initialState } from './../index';

interface GetValidatorType {
  currentValidator: ValidatorType;
  nodeUrl: string;
  elasticUrl: string;
  publicKey: string;
  explorerApi: string;
  timeout: number;
}

function getBlocks(data: any) {
  const blocks: BlockType[] = data.map((block: any) => ({
    hash: block.id,
    ...block,
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
    const params = {
      from: 0,
      size: 25,
      proposer: signersIndex,
      shardId: shardNumber,
      epoch,
    };

    const { data } = await axios.get(`${elasticUrl}/blocks`, { params, timeout });
    const { blocks, startBlockNr, endBlockNr } = getBlocks(data);

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
  currentValidator,
  nodeUrl,
  elasticUrl,
  timeout,
  explorerApi,
  publicKey,
}: GetValidatorType) {
  try {
    const { shardId, shardNumber } = currentValidator;
    const { versionNumber, isActive, nodeDisplayName } = currentValidator;

    const {
      totalDownTimePercentege,
      totalUpTimePercentege,
      totalUpTimeLabel,
      totalDownTimeLabel,
    } = validatorFunctions.getUptimeDowntime(currentValidator);

    const isValidator =
      currentValidator.isValidator ||
      (currentValidator.peerType && !currentValidator.peerType.includes('observer'));

    const instanceType = isValidator ? `Validator (${currentValidator.peerType})` : 'Observer';

    if (isValidator) {
      const { epoch, roundAtEpochStart } = await validatorFunctions.getEpoch({
        nodeUrl,
        shardNumber,
        timeout,
      });

      const {
        data: { publicKeys: consensusArray },
      } = await axios.get(`${elasticUrl}/validators/${shardNumber}_${epoch}`, { timeout });

      const signersIndex = consensusArray.indexOf(publicKey);

      const historicRatings: { epoch: number; rating: string }[] = await getHistoricRatings({
        explorerApi,
        timeout,
        publicKey,
      });

      return {
        shardId,
        shardNumber,
        versionNumber,
        isActive,
        nodeDisplayName,
        isValidator,
        publicKeyBlockSign: undefined,
        totalDownTimePercentege,
        totalUpTimePercentege,
        totalUpTimeLabel,
        totalDownTimeLabel,
        instanceType,
        signersIndex,
        publicKey,
        epoch,
        roundAtEpochStart,
        historicRatings,
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

interface HistoricRatingsType {
  explorerApi: string;
  timeout: number;
  publicKey: string;
}

export async function getHistoricRatings({ explorerApi, timeout, publicKey }: HistoricRatingsType) {
  try {
    const { data } = await axios.get(`${explorerApi}/ratingshistory/${publicKey}`, { timeout });
    return data;
  } catch {
    return [];
  }
}
