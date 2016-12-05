import {
  SphereGeometry,
  BoxGeometry,
  MeshPhongMaterial,
  CylinderGeometry,
  Vector3,
} from 'three';

import physijs from 'physijs';
import { createBouncyMaterial } from '../utils';

/**
 * Some constant parameters for creating the molecules
 */
const numSegments = 32;
// eventually scale the whole model down by this factor
const scaleDownBy = 0.25;
const hydrogenRadius = 5;
const oxygenRadius = hydrogenRadius * 2;
const bondConnectorRadius = hydrogenRadius / 3;
const bondLength = hydrogenRadius * 4;

const hydrogenGeom = new SphereGeometry(hydrogenRadius, numSegments, numSegments);
// const hydrogenGeom = new BoxGeometry(hydrogenRadius * 2, hydrogenRadius * 2, hydrogenRadius * 2);
const hydrogenMat = createBouncyMaterial(new MeshPhongMaterial({ color: 0xFFFFFF }));

const oxygenGeom = new SphereGeometry(oxygenRadius, numSegments, numSegments);
// const oxygenGeom = new BoxGeometry(oxygenRadius * 2, oxygenRadius * 2, oxygenRadius * 2);
const oxygenMat = createBouncyMaterial(new MeshPhongMaterial({ color: 0xF00000 }));
const bondGeom = new CylinderGeometry(bondConnectorRadius, bondConnectorRadius, bondLength);
const bondMat = createBouncyMaterial(new MeshPhongMaterial({ color: 0xA3B1BE }));

export default function createHydroxyl() {
  let hydrogenMesh = new physijs.SphereMesh(hydrogenGeom, hydrogenMat, 1);
  let oxygenMesh = new physijs.SphereMesh(oxygenGeom, oxygenMat, 16);
  let bondMesh = new physijs.CylinderMesh(bondGeom, bondMat, 17); // not so sure about masses..

  // move the hydrogen and oxygen to bond cylinder's corners
  hydrogenMesh.position.y = -bondLength / 2; 
  oxygenMesh.position.y = bondLength / 2; 

  bondMesh.add(hydrogenMesh);
  bondMesh.add(oxygenMesh);

  // shrink the whole thing down
  bondMesh.scale.multiplyScalar(scaleDownBy);

  // need to use ccd because of high velocity and bug in physics engine
  bondMesh.setCcdMotionThreshold(1);

  // set the radius of the embedded sphere such that it is smaller than the object
  bondMesh.setCcdSweptSphereRadius(scaleDownBy * 0.2 * bondLength);

  addCallbacks(bondMesh);

  return bondMesh;
}

function addCallbacks(hydroxylMesh) {
  hydroxylMesh.addEventListener('collision', (other, linearVelocity, angularVelocity, contactNormal) => {
    hydroxylMesh.justCollided = true;
  });
}
