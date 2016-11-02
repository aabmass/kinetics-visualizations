import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  DirectionalLight
} from 'three';

import Molecule from './molecule';

var scene = new Scene();
var camera = new PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 5000 );

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

var geometry = new BoxGeometry( 1, 1, 1 );
var material = new MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new Mesh( geometry, material );
scene.add( cube );

let m = new Molecule('/models/hydroxyl.pdb');

camera.position.z = 400;

var render = function () {
  requestAnimationFrame( render );

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.02;

  renderer.render(scene, camera);
};

m.loadMesh(scene, render);
