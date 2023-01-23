import axios from 'axios';
import { object, string, InferType, number } from 'yup';

interface GetMarkersType {
  timeout: number;
  apiAddress: string;
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

export async function getMarkers({ timeout, apiAddress }: GetMarkersType): Promise<{
  data: MarkerType[];
  success: boolean;
}> {
  try {
    // const { data } = await axios.get(`${apiAddress}/markers`, { timeout });
    const { data } = await axios.get(`***REMOVED***`, { timeout });

    schema.validate((data as any)[Object.keys(data)[0]], { strict: true }).catch(({ errors }) => {
      console.error('Markers format errors: ', errors);
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
