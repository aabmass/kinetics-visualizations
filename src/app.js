import {
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  CubeGeometry,
  SphereGeometry,
  MeshBasicMaterial,
  RepeatWrapping,
  Mesh,
  DirectionalLight,
  JSONLoader,
  MultiMaterial,
  Vector3
} from 'three';

import physijs from 'physijs';

import { TrackballControls } from './three-examples';

import { randVector3 } from './math';

import hydroxyl from './models/hydroxyl.pdb';
import { createHydroxyl } from './factories';

var scene = new physijs.Scene();
var camera = new PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 15000 );
camera.position.z = 200;

let controls = new TrackballControls( camera );
controls.rotateSpeed = 1.0;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;
controls.noZoom = false;
controls.noPan = false;
controls.staticMoving = true;
controls.dynamicDampingFactor = 0.3;
controls.keys = [ 65, 83, 68 ];
controls.addEventListener( 'change', render );

var light = new DirectionalLight( 0xffffff, 0.8 );
light.position.set( 1, 1, 1 );
scene.add( light );
var light = new DirectionalLight( 0xffffff, 0.5 );
light.position.set( -1, -1, 1 );
scene.add( light );

var renderer = new WebGLRenderer();
renderer.setClearColor( 0x050505 );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// first make the spherical border around the whole scene
let borderMat = physijs.createMaterial(
  new MeshBasicMaterial({ color: 0x46aeae, wireframe: true }),
  0.9,
  0.2
);

let borderGeom = new BoxGeometry(1000, 1000, 1000);
let borderMesh = new physijs.BoxMesh(borderGeom, borderMat, 0);
scene.add(borderMesh);

let molecules = [];

const initNumHydroxyls = 200;
for (let i = 0; i < initNumHydroxyls; ++i) {
  let h = createHydroxyl();
  h.position.copy(randVector3(200));

  scene.add(h);
  molecules.push(h);
}

// let loader = new JSONLoader();
// loader.load('models/hypertau.js', (geometry, materials) => {
//   var material = new MultiMaterial( materials );
//   var mesh = new Mesh( geometry, material );
// 
//   mesh.scale.multiplyScalar(100.0);
//   mesh.position.addScalar(200);
//   scene.add( mesh );
//   molecules.push(mesh);
// });

scene.setGravity(new Vector3(0, 0, 0));
scene.simulate();

// this must be called after scene.simulate()'s first time
molecules.forEach(mol => {
  mol.setLinearVelocity(randVector3(20));
  mol.setAngularVelocity(randVector3(20));
});

animate();
function animate() {
  // perform physics calculations
  scene.simulate();


  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

function render() {

}
