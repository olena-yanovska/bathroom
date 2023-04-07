import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let bathroom;
let renderer;
let scene;
let camera;

function init() {
  // scene and camera setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  camera = new THREE.PerspectiveCamera(75 ,window.innerWidth/window.innerHeight, 1, 5000);
  camera.rotation.y = 45/180*Math.PI;
  camera.position.x = 5;
  camera.position.y = 5;
  camera.position.z = 10;

  /// Light setup
  let ambientLight = new THREE.AmbientLight (0xffffff,0.5);
  scene.add(ambientLight);

  let directionalLight = new THREE.DirectionalLight(0xffffff,0.5,);
  directionalLight.position.set(0,100,0);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  let light = new THREE.PointLight(0xc4c4c4,1);
  light.position.set(0,300,50);
  scene.add(light);

  let light2 = new THREE.PointLight(0xc4c4c4,1);
  light2.position.set(500,100,0);
  scene.add(light2);

  // renderer setup
  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', renderer);

  const loader = new GLTFLoader();

  loader.load('src/babylonBathroom.glb', function (gltf) {
    bathroom = gltf.scene;
    let room = gltf.scene.children[0];
    room.scale.set(0.5, 0.5, 0.5);

    const box = new THREE.Box3().setFromObject(bathroom);
    const center = new THREE.Vector3();
    box.getCenter(center);

    bathroom.position.sub(center); 

    scene.add(bathroom);
    animate();
  });
};

function animate() {
  renderer.render(scene,camera);
  requestAnimationFrame(animate);
}

init();
