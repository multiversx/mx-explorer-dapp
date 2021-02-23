import axios from 'axios';
import { object, string, InferType, number } from 'yup';

interface GetMarkersType {
  timeout: number;
  apiUrl: string;
}

const schema = object({
  continent: string().defined(),
  city: string().defined(),
  country: string().defined(),
  latitude: number().defined(),
  longitude: number().defined(),
  validators: number().defined(),
}).defined();

export type MarkerType = InferType<typeof schema>;

export async function getMarkers({
  timeout,
  apiUrl,
}: GetMarkersType): Promise<{
  data: MarkerType[];
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

export interface LeaderType {
  city: string;
}

export async function getLeaders({ timeout, apiUrl }: GetMarkersType) {
  try {
    const { data } = await axios.get(`${apiUrl}/leaders`, {
      timeout,
    });

    return data;
  } catch {
    return [];
  }
}
