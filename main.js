import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// scene and camera setup
const scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0, 0, 0);

// Light setup
let ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

let pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(0, 5, 5);
scene.add(pointLight);

const lightTarget = new THREE.Object3D();
scene.add(lightTarget);
pointLight.target = lightTarget;

let container = document.getElementById('container');

scene.background = new THREE.Color(0xffffff);

// renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
container.appendChild( renderer.domElement );

// Loading 3d model
const loader = new GLTFLoader();
let bathroom;

loader.load('babylonBathroom.glb', function (gltf) {
  bathroom = gltf.scene;

  const box = new THREE.Box3().setFromObject(bathroom);
  const center = new THREE.Vector3();
  box.getCenter(center);

  bathroom.position.sub(center); 

  scene.add(bathroom);
});

// Change on scrolling
function onDocumentMouseWheel(event) {
  let delta = event.deltaY;

  if (delta < 0) {
    bathroom.scale.multiplyScalar(1.1);
  } else if (delta > 0) {
    bathroom.scale.multiplyScalar(0.9);
  }
}

container.addEventListener('wheel', onDocumentMouseWheel);

const mouse = new THREE.Vector2();
const speed = 0.005;
let isDragging = false;

function onDocumentMouseDown(event) {
  event.preventDefault();

  isDragging = true;
  mouse.x = event.clientX;
  mouse.y = event.clientY;
}

function onDocumentMouseMove(event) {
  if (isDragging) {
    const deltaX = event.clientX - mouse.x;
    camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), deltaX * speed);
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  }
}

function onDocumentMouseUp(event) {
  isDragging = false;
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

document.addEventListener('mousedown', onDocumentMouseDown, false);
document.addEventListener('mousemove', onDocumentMouseMove, false);
document.addEventListener('mouseup', onDocumentMouseUp, false);

animate();
