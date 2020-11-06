import { AdapterFunctionType } from './index';
import { object, number, string, InferType } from 'yup';

const schema = object({
  name: string().required(),
  twitter: string(),
  website: string(),
  location: string(),
  avatar: string(),
  identity: string().required(),
  nodes: number().required(),
  score: number().required(),
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
