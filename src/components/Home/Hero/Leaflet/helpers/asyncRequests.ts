import axios from 'axios';
import { object, string, number, InferType } from 'yup';

interface GetMarkersType {
  timeout: number;
  explorerApi: string;
}

const schema = object({
  ip: string().defined(),
  city: string().defined(),
  country: string().defined(),
  loc: string().defined(),
  org: string().defined(),
  telegram: string().defined(),
  nodeName: string().defined(),
  shardID: number().defined(),
}).defined();

export type MarkerType = InferType<typeof schema> & { publicKey: string };

export async function getMarkers({ timeout, explorerApi }: GetMarkersType) {
  try {
    const { data } = await axios.get(`${explorerApi}/markers`, { timeout });

    schema.validate((data as any)[Object.keys(data)[0]], { strict: true }).catch(({ errors }) => {
      console.error('Markers format errors: ', errors);
    });

    return {
      data,
      markersFetched: true,
    };
  } catch {
    return {
      data: [],
      markersFetched: false,
    };
  }
}

export async function getLeaders({
  timeout,
  explorerApi,
  shardsArray,
}: GetMarkersType & { shardsArray: number[] }): Promise<
  Array<{ proposer: string; shard: number }>
> {
  try {
    const { data } = await axios.post(`${explorerApi}/leaders`, shardsArray, {
      timeout,
    });

    return data;
  } catch {
    return [];
  }
}
