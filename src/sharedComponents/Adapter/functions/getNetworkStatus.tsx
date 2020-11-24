import axios from 'axios';
import { object, number, InferType } from 'yup';

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

type NetworkStatusType = InferType<typeof schema>;

interface GetNetworkStatus {
  proxyUrl: string;
  metaChainShardId: number;
  timeout: number;
}

export default async function getNetworkStatus({
  proxyUrl,
  metaChainShardId,
  timeout,
}: GetNetworkStatus) {
  try {
    const {
      data: { data, code, error },
    } = await axios.get(`${proxyUrl}/network/status/${metaChainShardId}`, {
      timeout,
    });

    if (code === 'successful') {
      const message: NetworkStatusType = data;

      schema.validate(message, { strict: true }).catch(({ errors }) => {
        console.error('network/status response format errors: ', errors);
      });

      const epoch = message.status.erd_epoch_number;
      const roundsPassed = message.status.erd_rounds_passed_in_current_epoch;
      const roundsPerEpoch = message.status.erd_rounds_per_epoch;

      return {
        data: {
          roundsPassed,
          roundsPerEpoch,
          epoch,
        },
        success: true,
      };
    } else {
      throw new Error(error);
    }
  } catch {
    return {
      success: false,
    };
  }
}
