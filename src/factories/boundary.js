import {
  MeshBasicMaterial,
  BoxGeometry,
  Vector3,
  Object3D,
} from 'three';

import physijs from 'physijs';

/* 
 * Creates a boundary object consisting of several thin (finite) planes.
 *
 * Can't just use a plain box mesh because then it isn't "hollow". This can
 * contain other meshes because it is made of individual walls
 */
export default function createBoundary(wallLength = 5000) {
  const wallMaterial = new MeshBasicMaterial({
    color: 0x008080,
    wireframe: true
  });
  const wallGeometry = new BoxGeometry(wallLength, wallLength, 2);
  
  let wallBottom = new physijs.BoxMesh(wallGeometry, wallMaterial, 0);
  let wallTop = new physijs.BoxMesh(wallGeometry, wallMaterial, 0);
  let wallLeft = new physijs.BoxMesh(wallGeometry, wallMaterial, 0);
  let wallRight = new physijs.BoxMesh(wallGeometry, wallMaterial, 0);
  let wallFront = new physijs.BoxMesh(wallGeometry, wallMaterial, 0);
  let wallBack = new physijs.BoxMesh(wallGeometry, wallMaterial, 0);

  // Half Length => hl
  const hl = wallLength / 2;
  const center = new Vector3(0, 0, hl);

  // set the positions of the walls
  wallTop.position.z = wallLength;

  wallLeft.position.z = hl;
  wallLeft.position.x = -hl;
  wallRight.position.z = hl;
  wallRight.position.x = hl;

  wallBack.position.z = hl;
  wallBack.position.y = -hl;
  wallFront.position.z = hl;
  wallFront.position.y = hl;

  // have everything look at the cube center
  wallLeft.lookAt(center);
  wallRight.lookAt(center);
  wallBottom.lookAt(center);
  wallTop.lookAt(center);
  wallFront.lookAt(center);
  wallBack.lookAt(center);

  // add them to wallBottom
  wallBottom.add(wallTop);
  wallBottom.add(wallLeft);
  wallBottom.add(wallRight);
  wallBottom.add(wallFront);
  wallBottom.add(wallBack);

  // finally move wall bottom so that center is actually at the origin
  
  wallBottom.position.z = -hl;
  wallBottom.receiveShadow = true;
  return wallBottom;
}
