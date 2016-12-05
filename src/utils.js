import { Vector3 } from 'three';
import physijs from 'physijs';

/**
 * This function wraps physijs.createMaterial and passes values for ideal
 * mechanics -- perfectly elastic collisions
 */
export function createBouncyMaterial(material) {
  return physijs.createMaterial(
    material,
    0.0,  // low friction
    100.0  // high restitution => very bouncy
  );
}
