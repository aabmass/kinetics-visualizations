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
import {
  createHydroxyl,
  createBoundary
} from './factories';

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
renderer.setClearColor(0xE5E5E5);
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

/** make the boundary */
let boundary = createBoundary(1000);
scene.add(boundary);

let molecules = [];

/* this function is called after everything is added to the physics world */
boundary.addEventListener('ready', () => {
  // add the molecules only after the boundary is added
  
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
});

scene.setGravity(new Vector3(0, 0, 0));
scene.simulate();

/* not sure if this is more, less, or same efficiency as calling it in
 * the render loop. TODO: test it!
 */
scene.addEventListener('update', preSimulate);

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
  // perform physics calculations
  scene.simulate();

  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

function render() {

}
