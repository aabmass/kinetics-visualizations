import {
  Scene,
 PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  DirectionalLight,
  JSONLoader,
  MultiMaterial
} from 'three';

import { TrackballControls } from './three-examples';

import hydroxyl from './models/hydroxyl.pdb';
import moleculeFactory from './molecule';

var scene = new Scene();
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

let objects = {
  hydroxyls: [],
  tau: null
};

let createHydroxyl = moleculeFactory(hydroxyl);

const initNumHydroxyls = 150;
for (let i = 0; i < initNumHydroxyls; ++i) {
  let h = createHydroxyl();
  h.position.x = Math.random() * 100;
  h.position.y = Math.random() * 100;
  h.position.z = Math.random() * 100;

  scene.add(h);
  objects.hydroxyls.push(h);
}

let loader = new JSONLoader();
loader.load('models/hypertau.js', (geometry, materials) => {
  var material = new MultiMaterial( materials );
  var mesh = new Mesh( geometry, material );

  mesh.scale.multiplyScalar(100.0);
  mesh.position.addScalar(200);
  scene.add( mesh );
  objects.tau = mesh;
});


camera.position.z = 1500;

const start = Date.now();
let delta = 0;
animate();
function animate() {
  delta = Date.now() - start;

  objects.hydroxyls.forEach((h, i) => {
    h.position.x = (h.position.x + (Math.random() * 2 - 1) * 20) % 10000;
    h.position.y = (h.position.y + (Math.random() * 2 - 1) * 20) % 10000;
    h.position.z = (h.position.z + (Math.random() * 2 - 1) * 20) % 10000;
  });

  if (objects.tau) {
    objects.tau.rotation.x = Math.sin(delta / 10000.0);
  }

  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

function render() {

}
