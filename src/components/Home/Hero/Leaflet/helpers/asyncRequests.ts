// import axios from 'axios';
import { object, string, number, InferType } from 'yup';
import markers from './markers';

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

export async function getLeaders({ timeout }: GetMarkersType) {
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

    const randomFiveKeys = Object.keys(markers)
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);

    const leaderMarkers: any = {};
    randomFiveKeys.forEach((element, i) => {
      leaderMarkers[element] = (markers as any)[element] as any;
    });

    return new Promise(resolve => setTimeout(() => resolve(leaderMarkers), 0));
  } catch {
    return {
      data: [],
      markersFetched: false,
    };
  }
}
