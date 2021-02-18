import { CityType } from './asyncRequests';

export interface MarkerPoint {
  name: string;
  country: string;
  lat: number;
  lon: number;
  shard?: number;
  offset?: number;
}

export interface MapDisplayType {
  cities: CityType[];
  leaders: MarkerPoint[];
  metaChainShardId: number;
  shardsArray: number[];
}

const maxLineLength = 20;
const min = 10;
const lineLen = (x: number, max: number) =>
  (maxLineLength * Math.log(x + min)) / Math.log(max + min);

const getRadius = (groupedCities: CityType[]) => {
  const totalNodesArray = groupedCities.map((city) => city.validators.length);
  const uniqueTotalNodes = [...new (Set as any)(totalNodesArray)];

  const max = Math.max.apply(null, uniqueTotalNodes);
  const radiuses = uniqueTotalNodes.reduce((y, x) => {
    y.push(lineLen(x, max) as any);
    return y;
  }, []);

  const mapping: {
    [key: string]: number;
  } = {};

  uniqueTotalNodes.map((node, i) => {
    const newCities = groupedCities.filter((city) => city.validators.length === node) || [];
    newCities.map((city) => {
      mapping[city.city] = Math.round(radiuses[i]);
      return null;
    });
    return null;
  });
  return mapping;
};

export { getRadius };
