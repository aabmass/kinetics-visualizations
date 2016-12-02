import { Group, Vector3 } from 'three';
import { randVector3 } from './math';

/**
 * Our own molecule class, extending Three.js Group that adds properties and
 * methods for movements.
 *
 * Molecules will appear to move naturally if they have momentum that slowly
 * mutates
 */
export default class Molecule extends Group {
  /*
   * The internal group that should be rendered
   */
  constructor(mass = 1, initialVelocity = new Vector3(0, 0, 0)) {
    super();

    this.mass = mass;
    this.velocity = initialVelocity;
  }

  /*
   * Call this method in the render loop. It does two things:
   *  - translates the molecule by using its intialVelocity
   *  - randomly accelerates the molecule so its movement is random but smooth
   */
  moveAndMutate() {
    // move the particle using x[t] = v * dt + x[t-1]
    this.position.addScaledVector(this.velocity, Molecule.deltaT);

    /*
     * Now mutate. Apply a force to the particle randomly, causing a change in
     * velocity vector.
     *
     * F = ma = m * dv/dt  ==>  (F / m) * dt = dv
     */
    let force = randVector3(Molecule.mutationRate);

    // Now is dv in equation above. Vector3 doesn't have immutable methods that
    // return copies.
    force.multiplyScalar(Molecule.deltaT / this.getMass());

    // finally add dv to v
    this.velocity.add(force);
  }

  /** getters (and setters) to define the interface */
  getMass() {
    return this.mass;
  }

  getVelocity() {
    return this.velocity;
  }
}

/*
 * "static" properties of Molecule. If changed this affects all instances!
 */
Molecule.mutationRate = 10;

Molecule.deltaT = 0.075
