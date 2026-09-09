import { MathUtils, Vector3 } from 'three';

export const latLngToVector3 = (
  latitude: number,
  longitude: number,
  radius = 1,
  target = new Vector3()
) => {
  const lat = MathUtils.degToRad(latitude);
  const lng = MathUtils.degToRad(longitude);
  const cosLat = Math.cos(lat);

  return target.set(
    radius * cosLat * Math.sin(lng),
    radius * Math.sin(lat),
    radius * cosLat * Math.cos(lng)
  );
};
