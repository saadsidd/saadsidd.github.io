"use strict";


// ----- CANNON -----

// Solver
const solver = new CANNON.GSSolver();
solver.iterations = 10;
solver.tolerance = 0.1;

// World
const world = new CANNON.World();
world.broadphase = new CANNON.NaiveBroadphase();
world.quatNormalizeSkip = 0;
world.quatNormalizeFast = false;
world.defaultContactMaterial.contactEquationsStiffness = 1e9;
world.defaultContactMaterial.contactEquationsRelaxation = 4;
world.solver = solver;
world.gravity.set(0, -15, 0);

const playerMaterial = new CANNON.Material('playerMaterial');
const groundMaterial = new CANNON.Material('groundMaterial');
const slipperyMaterial = new CANNON.Material('slipperyMaterial');
const superSlipperyMaterial = new CANNON.Material('noFrictionMaterial');

world.addContactMaterial(new CANNON.ContactMaterial(playerMaterial, groundMaterial, {
    friction: 0.4,
    restitution: 0.1
}));
world.addContactMaterial(new CANNON.ContactMaterial(playerMaterial, slipperyMaterial, {
    friction: 0.01,
    restitution: 0.05
}));
world.addContactMaterial(new CANNON.ContactMaterial(playerMaterial, superSlipperyMaterial, {
    friction: 0.001,
    restitution: 0.05
}));


// ----- THREE -----

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xB0B0B0);

// Camera
const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.set(0, 1, 5);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// ----- Event Listeners -----

// Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    tempCamera.aspect = window.innerWidth / window.innerHeight;
    tempCamera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Player input
const keyboard = {};
window.addEventListener('keydown', (event) => {
    keyboard[event.code] = true;
});

window.addEventListener('keyup', (event) => {
    keyboard[event.code] = false;
});

window.addEventListener('click', () => {
    if (!cameraSwitch) document.body.requestPointerLock();
});

let pitchObject = new THREE.Object3D();
let yawObject = new THREE.Object3D();

pitchObject.add(camera);
yawObject.add(pitchObject);
scene.add(yawObject);

window.addEventListener('mousemove', (event) => {
    if (document.pointerLockElement === document.body) {
        yawObject.rotation.y -= event.movementX * 0.002;
        pitchObject.rotation.x -= event.movementY * 0.002;

        pitchObject.rotation.x = Math.max(-Math.PI/4, Math.min(Math.PI/4, pitchObject.rotation.x));
    }
});