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

import Stats from 'stats.js';

import physijs from 'physijs';

import { TrackballControls } from './three-examples';

import { randVector3 } from './math';

import hydroxyl from './models/hydroxyl.pdb';
import {
  createHydroxyl,
  createBoundary
} from './factories';
import { createBouncyMaterial } from './utils';

/* setup the stats */
let stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

var scene = new physijs.Scene();
var camera = new PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 15000 );
camera.position.x = 750;
camera.position.y = 250;
camera.position.z = 1000;
camera.lookAt(new Vector3(0, 0, 0));

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
renderer.setClearColor(0xE5E5E5);
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

/** make the boundary */
const boundaryLength = 2000;

// initial positions will be random within +- generateWithin
const generateWithin = boundaryLength / 2 - boundaryLength / 5;

let boundary = createBoundary(boundaryLength);
scene.add(boundary);

let molecules = [];

/* this function is called after everything is added to the physics world */
boundary.addEventListener('ready', () => {
  // add the molecules only after the boundary is added
  
  const initNumHydroxyls = 200;
  for (let i = 0; i < initNumHydroxyls; ++i) {
    let h = createHydroxyl();
    h.position.copy(randVector3(generateWithin));

    scene.add(h);
    molecules.push(h);
  }

  let loader = new JSONLoader();
  loader.load('models/hypertau.js', (geometry, materials) => {
    let material = createBouncyMaterial(new MultiMaterial( materials ));

    const initNumTau = 20;
    for (let i = 0; i < initNumTau; ++i) {
      let tau = new physijs.CylinderMesh(geometry, material, 1000);
      tau.position.copy(randVector3(generateWithin));
      tau.rotateX(Math.random() * Math.PI);
      tau.rotateY(Math.random() * Math.PI);
      tau.rotateZ(Math.random() * Math.PI);
      tau.scale.multiplyScalar(5);
      molecules.push(tau);
      scene.add(tau);
    }
  });
});

scene.setGravity(new Vector3(0, 0, 0));
scene.simulate();
animate();

function preSimulate() {
  molecules.forEach(mol => {
    // apply a random slight impulse to each molecule
    mol.applyCentralImpulse(randVector3(100));

    // the scene's physics have finished updating, scale the velocity of the
    // molcules up to fix bug with collisions
    if (mol.justCollided) {
      // mol.setLinearVelocity(mol.getLinearVelocity().multiplyScalar(1.37));

      mol.justCollided = false;
    }
  });
}

function animate() {
  stats.begin();

  /*** begin stats monitored code ***/

  // any tampering with the physics before the engine recalculates can be done
  // in this function's body
  preSimulate();

  // perform physics calculations
  scene.simulate();

  controls.update();
  renderer.render(scene, camera);

  /*** end stats monitored code ***/

  stats.end();

  requestAnimationFrame(animate);
}

function render() {

}
