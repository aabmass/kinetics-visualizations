import {
  SphereGeometry,
  MeshPhongMaterial,
  CylinderGeometry,
} from 'three';
import physijs from 'physijs';

/**
 * Some constant parameters for creating the molecules
 */
const numSegments = 32;
const hydrogenRadius = 5;
const oxygenRadius = hydrogenRadius * 2;
const bondConnectorRadius = hydrogenRadius / 3;
const bondLength = hydrogenRadius * 4;

const hydrogenGeom = new SphereGeometry(hydrogenRadius, numSegments, numSegments);
const hydrogenMat = new MeshPhongMaterial({ color: 0xFFFFFF });

const oxygenGeom = new SphereGeometry(oxygenRadius, numSegments, numSegments);
const oxygenMat = new MeshPhongMaterial({ color: 0xF00000 });

const bondGeom = new CylinderGeometry(bondConnectorRadius, bondConnectorRadius, bondLength);
const bondMat = new MeshPhongMaterial({ color: 0xA3B1BE });

export default function createHydroxyl() {
  let hydrogenMesh = new physijs.SphereMesh(hydrogenGeom, hydrogenMat, 1);
  let oxygenMesh = new physijs.SphereMesh(oxygenGeom, oxygenMat, 16);
  let bondMesh = new physijs.CylinderMesh(bondGeom, bondMat, 17); // not so sure about masses..

  // move the hydrogen and oxygen to bond cylinder's corners
  hydrogenMesh.position.y = -bondLength / 2; 
  oxygenMesh.position.y = bondLength / 2; 

  bondMesh.add(hydrogenMesh);
  bondMesh.add(oxygenMesh);

  return bondMesh;
}
