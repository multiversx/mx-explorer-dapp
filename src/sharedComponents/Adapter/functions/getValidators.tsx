import axios from 'axios';
import { AdapterFunctionType } from './index';
import { ValidatorType } from 'context/validators';
import moment from 'moment';
import { object, number, InferType } from 'yup';

interface BlockType {
  hash: string;
  nonce: number;
  epoch: number;
  prevHash: string;
  proposer: number;
  pubKeyBitmap: string;
  round: number;
  shardId: number;
  size: number;
  sizeTxs: number;
  stateRootHash: string;
  timestamp: number;
  txCount: number;
  validators: number[];
  miniBlocksHashes: string[];
  notarizedBlocksHashes: string[];
}

export const initialState = {
  shardId: '0',
  publicKey: '',
  shardNumber: 0,
  versionNumber: '0',
  isActive: false,
  nodeDisplayName: '0',
  isValidator: false,
  publicKeyBlockSign: '0',
  totalDownTimePercentege: 0,
  totalUpTimePercentege: 0,
  totalUpTimeLabel: '',
  totalDownTimeLabel: '',
  instanceType: '0',
  startBlockNr: 0,
  endBlockNr: 0,
  signersIndex: -1,
  success: true,
  rating: 0,
  ratingModifier: 0,
  historicRatings: [],
};

export interface GetRoundsType {
  shardNumber: number;
  signersIndex?: number;
  roundAtEpochStart: number;
  epoch: number;
  size?: number;
}

interface RoundType {
  key: string;
  value: boolean;
}

export interface GetRoundsReturnType {
  rounds: RoundType[];
  roundsFetched: boolean | undefined;
}

// TODO: remove
export async function getRounds({
  provider,
  baseUrl,
  shardNumber,
  signersIndex,
  timeout,
  roundAtEpochStart: round,
  size = 100,
}: AdapterFunctionType & GetRoundsType): Promise<GetRoundsReturnType> {
  const params = {
    from: 0,
    size,
    round,
    shardId: shardNumber,
    signersIndexes: signersIndex,
  };

  try {
    const { data } = await provider({
      baseUrl,
      url: `/rounds`,
      params,
      timeout,
    });

    const rounds = data.map((round: any) => ({
      key: round.id,
      value: round.blockWasProposed,
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

export interface GetValidatorType {
  currentValidator: ValidatorType;
  publicKey: string;
  explorerApi: string;
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
  provider,
  baseUrl,
  shardNumber,
  signersIndex,
  epoch,
  timeout,
}: AdapterFunctionType & GetRoundsType) {
  try {
    const { data } = await provider({
      baseUrl,
      url: `/blocks`,
      params: {
        from: 0,
        size: 25,
        proposer: signersIndex,
        shardId: shardNumber,
        epoch,
      },
      timeout,
    });

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
  provider,
  currentValidator,
  proxyUrl,
  baseUrl,
  timeout,
  explorerApi,
  publicKey,
}: AdapterFunctionType &
  GetValidatorType & {
    proxyUrl: string;
    baseUrl: string;
  }) {
  try {
    const { shardId, shardNumber } = currentValidator;
    const { versionNumber, isActive, nodeDisplayName } = currentValidator;

    const {
      totalDownTimePercentege,
      totalUpTimePercentege,
      totalUpTimeLabel,
      totalDownTimeLabel,
    } = getUptimeDowntime(currentValidator);

    const isValidator =
      currentValidator.isValidator ||
      (currentValidator.peerType && !currentValidator.peerType.includes('observer'));

    const instanceType = isValidator ? `Validator (${currentValidator.peerType})` : 'Observer';

    if (isValidator) {
      const { epoch, roundAtEpochStart } = await getEpoch({
        nodeUrl: proxyUrl,
        shardNumber,
        timeout,
      });

      const {
        data: { publicKeys: consensusArray },
      } = await provider({
        baseUrl,
        url: `/validators/${shardNumber}_${epoch}`,
        timeout,
      });

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
  } catch (err) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Failed heartbeatstatus', err);
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

export function getShardId(validator: ValidatorType, metaChainShardId: number) {
  let shardId: string;
  const isValidator = validator.peerType && !validator.peerType.includes('observer');

  if (isValidator === true) {
    shardId = validator.computedShardID.toString();
  } else {
    shardId = validator.receivedShardID.toString();
  }

  return {
    shardId: shardId === metaChainShardId.toString() ? 'Metachain' : shardId, // eslint-disable-line
    shardNumber: parseInt(shardId), // this is excluding the Metachain string, used for searching
  };
}

export function getUptimeDowntime(validator: ValidatorType) {
  const totalTime = validator.totalDownTimeSec + validator.totalUpTimeSec;
  const totalDownTimePercentege = (validator.totalDownTimeSec * 100) / totalTime;
  const totalUpTimePercentege = (validator.totalUpTimeSec * 100) / totalTime;

  const totalUpTimeLabel =
    totalUpTimePercentege.toFixed(2) +
    '% (' +
    moment.duration({ seconds: validator.totalUpTimeSec }).humanize() +
    ')'; // eslint-disable-line

  const totalDownTimeLabel =
    totalDownTimePercentege.toFixed(2) +
    '% (' +
    moment.duration({ seconds: validator.totalDownTimeSec }).humanize() +
    ')'; // eslint-disable-line

  return { totalDownTimePercentege, totalUpTimePercentege, totalUpTimeLabel, totalDownTimeLabel };
}

interface GetEpochType {
  nodeUrl: string;
  shardNumber: number;
  timeout: number;
}

const schema = object({
  status: object({
    erd_current_round: number().required(),
    erd_epoch_number: number().required(),
    erd_nonce: number().required(),
    erd_nonce_at_epoch_start: number().required(),
    erd_nonces_passed_in_current_epoch: number().required(),
    erd_round_at_epoch_start: number().required(),
    erd_rounds_passed_in_current_epoch: number().required(),
    erd_rounds_per_epoch: number().required(),
  }).required(),
}).defined();

export type NetworkStatusType = InferType<typeof schema>;

export async function getEpoch({ nodeUrl, shardNumber, timeout }: GetEpochType) {
  try {
    const {
      data: { data, code, error },
    } = await axios.get(`${nodeUrl}/network/status/${shardNumber}`, {
      timeout,
    });

    if (code === 'successful') {
      const message: NetworkStatusType = data;

      schema.validate(message, { strict: true }).catch(({ errors }) => {
        console.error('network/status response format errors: ', errors);
      });

      return {
        epoch: message.status.erd_epoch_number,
        roundAtEpochStart: message.status.erd_round_at_epoch_start,
        epochSuccess: true,
      };
    } else {
      throw new Error(error);
    }
  } catch {
    return {
      epoch: 0,
      roundAtEpochStart: 0,
      epochSuccess: false,
    };
  }
}
