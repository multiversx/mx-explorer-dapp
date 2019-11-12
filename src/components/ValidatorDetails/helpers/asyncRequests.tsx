import axios from 'axios';
import { ValidatorType } from './../../Validators';
import { getShardId, getUptimeDowntime } from './../../../helpers';
import { BlockType } from './../../Blocks';
import { initialState } from './../index';

type GetValidatorType = {
  nodeUrl: string;
  elasticUrl: string;
  hexPublicKey: string;
  timeout: number;
  metaChainShardId: number;
};

function getBlocks(response: any) {
  const { hits } = response.data;
  const blocks: BlockType[] = hits.hits.map((block: any) => block._source);

  let min = blocks[0].nonce;
  let max = min;
  for (let block in blocks) {
    if (blocks[block].nonce < min) min = blocks[block].nonce;

    if (blocks[block].nonce > max) max = blocks[block].nonce;
  }

  const startBlockNr = min;
  const endBlockNr = max;
  return {
    blocks,
    startBlockNr,
    endBlockNr,
  };
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

    const { totalDownTimePercentege, totalUpTimePercentege } = getUptimeDowntime(currentValidator);
    // $('#upTimePercentegeBar').tooltip({ title: upTimeDownTime.totalUpTimeLabel }); // eslint-disable-line
    // $('#downTimePercentegeBar').tooltip({ title: upTimeDownTime.totalDownTimeLabel }); // eslint-disable-line

    const instanceType = currentValidator.isValidator ? 'Validator' : 'Observer';

    if (currentValidator.isValidator) {
      const {
        data: {
          hits: { hits },
        },
      } = await axios.get(`${elasticUrl}/validators/_search`, { timeout });

      const {
        _source: { publicKeys: consensusArray },
      } = hits.filter((hit: any) => hit['_id'].toString() === shardNumber.toString()).pop();

      const signersIndex = consensusArray.indexOf(hexPublicKey);

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
            key: round['_id'],
            value: round['_source'].blockWasProposed,
          }));

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
            instanceType,
            blocks,
            startBlockNr,
            endBlockNr,
            rounds,
            publicKey: hexPublicKey,
            success: true,
          };
        } catch {
          console.error('Failed rounds');
        }
      } catch {
        console.error('Failed validators');
      }
    }
  } catch {
    console.error('Failed heartbeatstatus');
    return {
      data: initialState,
      success: false,
    };
  }
}
