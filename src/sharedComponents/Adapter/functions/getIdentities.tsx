import { AdapterFunctionType } from './index';
import { object, number, string, InferType } from 'yup';

const schema = object({
  name: string().required(),
  score: number().required(),
  stake: number().required(),
  stakePercent: number().required(),
  validators: number().required(),
  identity: string(),
  twitter: string(),
  website: string(),
  location: string(),
  avatar: string(),
}).required();

export type IdentityDataType = InferType<typeof schema>;

export default async function getIdentities({
  provider,
  baseUrl,
  timeout,
}: AdapterFunctionType): Promise<{
  data: IdentityDataType[];
  success: boolean;
}> {
  try {
    const { data } = await provider({
      baseUrl,
      url: `/identities`,
      timeout,
    });

    schema.validate(data[0], { strict: true }).catch(({ errors }) => {
      console.error('Identity format errors: ', errors);
    });

    return {
      data,
      success: true,
    };
  } catch {
    return {
      data: [],
      success: false,
    };
  }
}
