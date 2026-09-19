import { CubicBezierCurve3, Vector3 } from 'three';

const LIFT_FACTOR = 0.35;
const MIN_LIFT = 0.08;

const controlPoint = (
  start: Vector3,
  end: Vector3,
  t: number,
  lift: number
) => {
  const point = new Vector3().copy(start).lerp(end, t);
  if (point.lengthSq() < 1e-6) {
    point.set(0, 1, 0);
  }

  return point.normalize().multiplyScalar(lift);
};

export const arcCurve = (start: Vector3, end: Vector3) => {
  const angle = start.angleTo(end);
  const lift = 1 + Math.max(MIN_LIFT, angle * LIFT_FACTOR);

  return new CubicBezierCurve3(
    start.clone(),
    controlPoint(start, end, 1 / 3, lift),
    controlPoint(start, end, 2 / 3, lift),
    end.clone()
  );
};
