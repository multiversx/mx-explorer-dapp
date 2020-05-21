// @ts-ignore
import kendo from 'kendo-ui-core/js/kendo.data';
import { MarkerType } from './asyncRequests';

export interface MarkerPoint {
  name: string;
  country: string;
  lat: number;
  lon: number;
  markerOffset: number;
  publicKey: string;
  shard?: number;
  offset?: number;
}

export interface MapDisplayType {
  markers: MarkerPoint[];
  leaders: MarkerPoint[];
  metaChainShardId: number;
  shardsArray: number[];
}

const getGroupedCities = (markers: MarkerPoint[]) => {
  const dataSource = new kendo.data.DataSource({
    data: markers,
  });
  dataSource.group({ field: 'name' });
  return dataSource.view();
};

const maxLineLength = 20;
const lineLen = (x: number, max: number) => (maxLineLength * Math.log(x + 15)) / Math.log(max + 15);
const getRadius = (groupedCities: Array<{ items: number[] }>) => {
  const totalNodesArray = groupedCities.map((city: any) => city.items.length);
  const uniqueTotalNodes = [...new (Set as any)(totalNodesArray)];

  const max = Math.max.apply(null, uniqueTotalNodes);
  const radiuses = uniqueTotalNodes.reduce((y: any, x) => {
    y.push(lineLen(x, max) as any);
    return y;
  }, []);

  const mapping: {
    [key: string]: number;
  } = {};

  uniqueTotalNodes.map((node, i) => {
    const cities = groupedCities.filter(item => item.items.length === node) || [];
    cities.map((city: any) => {
      mapping[city.value] = Math.round(radiuses[i]);
      return null;
    });
    return null;
  });
  return mapping;
};

export const processMarkers = (data: any) => {
  const locationsArray: MarkerType[] = Object.keys(data).map(id => ({
    ...data[id],
    publicKey: id,
  }));

  const markersArray = locationsArray
    .map(loc => {
      const lat = parseFloat(loc.loc.split(',')[0]);
      const lon = parseFloat(loc.loc.split(',')[1]);
      if (!isNaN(lat) && !isNaN(lon)) {
        return {
          name: loc.city,
          lat,
          lon,
          markerOffset: 0,
          publicKey: loc.publicKey,
          country: loc.country,
        };
      }
      return null;
    })
    .filter(Boolean);
  return markersArray;
};

export { getRadius, getGroupedCities };
