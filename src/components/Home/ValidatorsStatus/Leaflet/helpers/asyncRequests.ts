import axios from 'axios';
import { object, string, InferType, number, array } from 'yup';

interface GetMarkersType {
  timeout: number;
  apiUrl: string;
}

const schema = object({
  city: string().defined(),
  country: string().defined(),
  latitude: number().defined(),
  longitude: number().defined(),
  validators: array().of(string()).defined(),
}).defined();

export type CityType = InferType<typeof schema>;

export async function getCities({
  timeout,
  apiUrl,
}: GetMarkersType): Promise<{
  data: CityType[];
  markersFetched: boolean;
}> {
  try {
    const { data } = await axios.get(`${apiUrl}/markers`, { timeout });

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
  apiUrl,
  shardsArray,
}: GetMarkersType & { shardsArray: number[] }): Promise<{ proposer: string; shard: number }[]> {
  try {
    const { data } = await axios.post(`${apiUrl}/leaders`, shardsArray, {
      timeout,
    });

    return data;
  } catch {
    return [];
  }
}
