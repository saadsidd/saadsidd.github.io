"use strict";

// Cannon Debug
const cannonDebugRenderer = new THREE.CannonDebugRenderer(scene, world);

// Camera Control
const tempCamera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 500);
tempCamera.position.set(0, 12, 4);
tempCamera.lookAt(0, 0, -20);
scene.add(tempCamera);
const cameraControl = new THREE.OrbitControls(tempCamera, renderer.domElement);
cameraControl.enableKeys = false;

// Axes Helper
// scene.add(new THREE.AxesHelper(20));

// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(directionalLightHelper);
// const shadowCamera = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(shadowCamera);

// Stats (frames per second)
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const playerCoordinates = document.getElementById('player-coordinates');

let cameraSwitch = false;
let cameraSwitchFlag = false;

let debugRenderer = false;
// let debugRenderer = true;