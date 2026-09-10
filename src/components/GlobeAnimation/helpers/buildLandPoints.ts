import { latLngToVector3 } from './latLngToVector3';

interface GeometryType {
  type: string;
  arcs?: number[][] | number[][][];
  geometries?: GeometryType[];
}

interface TopologyType {
  transform: { scale: [number, number]; translate: [number, number] };
  arcs: number[][][];
  objects: Record<string, GeometryType>;
}

const MASK_WIDTH = 2048;
const MASK_HEIGHT = 1024;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

const decodeArcs = ({ arcs, transform }: TopologyType) =>
  arcs.map((arc) => {
    let x = 0;
    let y = 0;

    return arc.map(([dx, dy]) => {
      x += dx;
      y += dy;

      return [
        x * transform.scale[0] + transform.translate[0],
        y * transform.scale[1] + transform.translate[1]
      ];
    });
  });

const buildRing = (ringArcs: number[], decodedArcs: number[][][]) =>
  ringArcs.flatMap((index, i) => {
    const arc =
      index >= 0 ? decodedArcs[index] : decodedArcs[~index].slice().reverse();

    return i === 0 ? arc : arc.slice(1);
  });

const collectPolygons = (geometry: GeometryType): number[][][] => {
  switch (geometry.type) {
    case 'GeometryCollection':
      return (geometry.geometries ?? []).flatMap(collectPolygons);
    case 'Polygon':
      return [geometry.arcs as number[][]];
    case 'MultiPolygon':
      return geometry.arcs as number[][][];
    default:
      return [];
  }
};

const buildLandMask = (topology: TopologyType) => {
  const canvas = document.createElement('canvas');
  canvas.width = MASK_WIDTH;
  canvas.height = MASK_HEIGHT;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) {
    return undefined;
  }

  const decodedArcs = decodeArcs(topology);
  const polygons = collectPolygons(topology.objects.land);

  context.fillStyle = '#fff';
  polygons.forEach((polygon) => {
    context.beginPath();
    polygon.forEach((ringArcs) => {
      buildRing(ringArcs, decodedArcs).forEach(([lng, lat], i) => {
        const x = ((lng + 180) / 360) * MASK_WIDTH;
        const y = ((90 - lat) / 180) * MASK_HEIGHT;
        if (i === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      });
      context.closePath();
    });
    context.fill('evenodd');
  });

  return context.getImageData(0, 0, MASK_WIDTH, MASK_HEIGHT).data;
};

export const buildLandPoints = (
  topology: unknown,
  sampleCount: number,
  radius = 1
) => {
  const mask = buildLandMask(topology as TopologyType);
  if (!mask) {
    return new Float32Array(0);
  }

  const points: number[] = [];

  for (let i = 0; i < sampleCount; i++) {
    const y = 1 - (i / (sampleCount - 1)) * 2;
    const ringRadius = Math.sqrt(1 - y * y);
    const theta = GOLDEN_ANGLE * i;
    const x = Math.sin(theta) * ringRadius;
    const z = Math.cos(theta) * ringRadius;

    const latitude = (Math.asin(y) * 180) / Math.PI;
    const longitude = (Math.atan2(x, z) * 180) / Math.PI;
    const px = Math.min(
      MASK_WIDTH - 1,
      Math.floor(((longitude + 180) / 360) * MASK_WIDTH)
    );
    const py = Math.min(
      MASK_HEIGHT - 1,
      Math.floor(((90 - latitude) / 180) * MASK_HEIGHT)
    );

    if (mask[(py * MASK_WIDTH + px) * 4 + 3] > 0) {
      const point = latLngToVector3(latitude, longitude, radius);
      points.push(point.x, point.y, point.z);
    }
  }

  return new Float32Array(points);
};
