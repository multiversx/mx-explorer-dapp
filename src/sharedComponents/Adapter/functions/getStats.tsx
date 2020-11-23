import { object, number, InferType } from 'yup';

const schema = object({
  shards: number().required(),
  blocks: number().required(),
  accounts: number().required(),
  transactions: number().required(),
  epoch: number().required(),
  refreshRate: number().required(),
  roundsPassed: number().required(),
  roundsPerEpoch: number().required(),
}).required();

export default async function getStats(asyncRequest: () => Promise<any>) {
  try {
    const { data } = await asyncRequest();

    const source: InferType<typeof schema> = data;

    schema.validate(source, { strict: true }).catch(({ errors }) => {
      console.error('Stats _source format errors: ', errors);
    });
    return {
      data,
      success: true,
    };
  } catch (err) {
    return {
      data: {},
      success: false,
    };
  }
}
