import { Vector3 } from 'three';

/**
 * Returns a random float between on [-a, a).
 * With no arguments, assumes a = 1
 */
export function randScale(a = 1) {
  return (Math.random() * 2 - 1) * a;
}

/**
 * Returns a random Vector3 between on [-a, a).
 * With no arguments, assumes a = 1
 */
export function randVector3(a = 1) {
  return new Vector3(randScale(a), randScale(a), randScale(a));
}
