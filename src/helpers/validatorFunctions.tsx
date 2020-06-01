import moment from 'moment';
import axios from 'axios';
import { ValidatorType } from './../components/Validators';

export function getShardId(validator: ValidatorType, metaChainShardId: number) {
  let shardId: string;
  let star = false;
  const isValidator = validator.peerType && !validator.peerType.includes('observer');

  if (isValidator === true) {
    shardId = validator.computedShardID.toString();
    if (validator.isActive === true && validator.computedShardID !== validator.receivedShardID) {
      star = true;
    }
  } else {
    shardId = validator.receivedShardID.toString();
  }

  return {
    shardId: shardId === metaChainShardId.toString() ? 'Metachain' : shardId, // eslint-disable-line
    shardNumber: parseInt(shardId), // this is excluding the Metachain string, used for searching
    star,
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

export async function getEpoch({ nodeUrl, shardNumber, timeout }: GetEpochType) {
  try {
    const {
      data: { message },
    } = await axios.get(`${nodeUrl}/network/status/${shardNumber}`, {
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

export interface GetRoundsType {
  elasticUrl: string;
  shardNumber: number;
  signersIndex?: number;
  timeout: number;
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
  roundsFetched: boolean;
}

export async function getRounds({
  elasticUrl,
  shardNumber,
  signersIndex,
  timeout,
  roundAtEpochStart: round,
  size = 100,
}: GetRoundsType): Promise<GetRoundsReturnType> {
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
              ...(signersIndex !== undefined
                ? [
                    {
                      match: {
                        signersIndexes: signersIndex,
                      },
                    },
                  ]
                : []),
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
        size,
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
