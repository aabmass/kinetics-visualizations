import {
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  DirectionalLight,
  JSONLoader,
  MultiMaterial
} from 'three';

import physijs from 'physijs';

import { TrackballControls } from './three-examples';

import { randVector3 } from './math';

import hydroxyl from './models/hydroxyl.pdb';
import moleculeFactory from './molecule-factory';

console.log(physijs);

var scene = new physijs.Scene();
var camera = new PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 15000 );

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

let molecules = [];

let createHydroxyl = moleculeFactory(hydroxyl, 17);

const initNumHydroxyls = 150;
for (let i = 0; i < initNumHydroxyls; ++i) {
  let h = createHydroxyl();
  h.position.copy(randVector3(50));

  scene.add(h);
  molecules.push(h);
}

let loader = new JSONLoader();
loader.load('models/hypertau.js', (geometry, materials) => {
  var material = new MultiMaterial( materials );
  var mesh = new Mesh( geometry, material );

  mesh.scale.multiplyScalar(100.0);
  mesh.position.addScalar(200);
  scene.add( mesh );
  molecules.push(mesh);
});


camera.position.z = 1500;

const start = Date.now();
let delta = 0;
animate();
function animate() {
  delta = Date.now() - start;

  molecules.forEach((molecule, i) => {
    if (molecule.moveAndMutate) {
      molecule.moveAndMutate();
    }
  });

  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

function render() {

}
