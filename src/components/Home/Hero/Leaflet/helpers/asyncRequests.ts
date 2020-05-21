// import axios from 'axios';
import { object, string, number, InferType } from 'yup';
import markers from './markers';
import { validatorFunctions, blockFunctions } from 'helpers';
import { getBlocks } from 'components/Blocks/helpers/asyncRequests';

interface GetMarkersType {
  timeout: number;
}

const schema = object({
  ip: string(),
  city: string(),
  country: string(),
  loc: string(),
  org: string(),
  telegram: string(),
  nodeName: string(),
  shardID: number(),
});

export type MarkerType = InferType<typeof schema> & { publicKey: string };

export async function getMarkers({ timeout }: GetMarkersType) {
  try {
    // const response = await axios.get(
    //   `http://144.91.95.131:53135/geo`,

    //   { timeout }
    // );

    schema
      .validate((markers as any)[Object.keys(markers)[0]], { strict: true })
      .catch(({ errors }) => {
        console.error('Markers format errors: ', errors);
      });

    return new Promise(resolve => setTimeout(() => resolve(markers), 0));
  } catch {
    return {
      data: [],
      markersFetched: false,
    };
  }
}

export interface GetBlocksType {
  elasticUrl: string;
  nonce: number;
  shardId: number;
  timeout: number;
}

// async function getNonceBlocks({ elasticUrl, nonce, timeout, shardId }: GetBlocksType) {
//   try {
//     const {
//       data: {
//         hits: { hits },
//       },
//     } = await axios.post(
//       `${elasticUrl}/blocks/_search`,
//       {
//         query: {
//           bool: {
//             must: [{ match: { nonce } }, { match: { shardId } }],
//           },
//         },
//         size: 1,
//       },
//       { timeout }
//     );

//     if (hits[0]) {
//       return hits[0]._id;
//     }
//     return nonce;
//   } catch (err) {
//     return {
//       blocks: [],
//       blocksFetched: false,
//     };
//   }
// }

interface GetShardLeaderType {
  nodeUrl: string;
  elasticUrl: string;
  timeout: number;
  shardNumber: number;
}

// export const getShardLeader1 = async ({
//   nodeUrl,
//   timeout,
//   elasticUrl,
//   shardNumber,
// }: GetShardLeaderType) => {
//   const { epoch, roundAtEpochStart } = await validatorFunctions.getEpoch({
//     nodeUrl,
//     shardNumber,
//     timeout,
//   });
//   const props = {
//     elasticUrl,
//     timeout: Math.max(timeout, 10000),
//     shardNumber,
//     epoch,
//     roundAtEpochStart,
//     size: 1,
//   };
//   const { rounds } = await validatorFunctions.getRounds(props);

//   const nonceString =
//     rounds[0].key.indexOf('_') > 0 ? rounds[0].key.split('_').pop() : rounds[0].key;

//   const nonce = parseInt(nonceString || '-1');
//   // const firstProposedBlock = rounds.find({value} => round.value)
//   const blocks = await getNonceBlocks({
//     elasticUrl,
//     nonce /*: 92813*/,
//     timeout,
//     shardId: shardNumber,
//   });

//   // const data = await blockFunctions.getBlock({ elasticUrl, blockId, timeout });

//   // console.log(data);
// };

export const getShardLeader = async ({
  nodeUrl,
  timeout,
  elasticUrl,
  shardNumber,
}: GetShardLeaderType) => {
  try {
    const { epoch } = await validatorFunctions.getEpoch({
      nodeUrl,
      shardNumber,
      timeout,
    });
    const { blocks } = await getBlocks({
      elasticUrl,
      epochId: epoch,
      timeout,
      shardId: shardNumber,
    });

    const blockId: string = blocks[0].hash;

    const { proposer } = await blockFunctions.getBlock({ elasticUrl, timeout, blockId });

    return {
      proposer,
      shard: shardNumber,
    };
  } catch (err) {
    return {
      proposer: '',
      shard: shardNumber,
    };
  }
};
