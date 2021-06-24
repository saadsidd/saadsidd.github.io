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
world.defaultContactMaterial.contactEquationStiffness = 1e9;
world.defaultContactMaterial.contactEquationRelaxation = 4;
world.solver = solver;
world.gravity.set(0, -15, 0);

const playerMaterial = new CANNON.Material('playerMaterial');
const groundMaterial = new CANNON.Material('groundMaterial');
const slipperyMaterial = new CANNON.Material('slipperyMaterial');
const superSlipperyMaterial = new CANNON.Material('superSlipperyMaterial');
const speedMaterial = new CANNON.Material('speedMaterial');
const noFrictionMaterial = new CANNON.Material('noFrictionMaterial');

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
world.addContactMaterial(new CANNON.ContactMaterial(playerMaterial, speedMaterial, {
    friction: 0.4,
    restitution: 0.1
}));
world.addContactMaterial(new CANNON.ContactMaterial(playerMaterial, noFrictionMaterial, {
    friction: 0,
    restitution: 0.05
}));

// ----- THREE -----

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xb0b0b0);

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


// ----- CONSTANTS -----
const dt = 1.0 / 60.0;
const degToRad = Math.PI / 180;
const mesh_outline_material = new THREE.MeshBasicMaterial({color: 0x000000, side: THREE.BackSide});
const clock = new THREE.Clock();
const keyboard = {};
const bodyMeshOverlap = [];
const needsDeltaUpdate = [];


// ----- EVENT LISTENERS -----

// Player input
window.addEventListener('keydown', (event) => {
    keyboard[event.code] = true;
});

window.addEventListener('keyup', (event) => {
    keyboard[event.code] = false;
});

window.addEventListener('click', () => {
    if (!cameraSwitch) document.body.requestPointerLock();
});

const pitchObject = new THREE.Object3D();
const yawObject = new THREE.Object3D();

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

// Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    tempCamera.aspect = window.innerWidth / window.innerHeight;
    tempCamera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
});


// ----- BASE WORLD/SCENE SETUP -----

// Create floor
const groundBody = new CANNON.Body({
    shape: new CANNON.Plane(),
    material: groundMaterial,
    quaternion: new CANNON.Quaternion().setFromEuler(-90*degToRad, 0, 0)
});
world.add(groundBody);

const groundMesh = new THREE.Mesh(
    new THREE.CircleGeometry(20, 32),
    new THREE.MeshStandardMaterial({color: 0x606060})
);
groundMesh.rotation.x -= 90*degToRad;
scene.add(groundMesh);

// Create lighting
scene.add(new THREE.AmbientLight(0xffffff, 0.85));

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.y += 20;
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 10;
directionalLight.shadow.camera.far = 30;
scene.add(directionalLight);

// Create player object
const player = {

    speed: 1.5,

    init: function() {

        // Player Body
        this.body = new CANNON.Body({
            shape: new CANNON.Sphere(0.5),
            position: new CANNON.Vec3(0, 12, 4),
            quaternion: new CANNON.Quaternion().setFromEuler(0, 50*degToRad, 0),
            mass: 10,
            material: playerMaterial,
            angularDamping: 0.9
        });

        // Player Mesh
        this.mesh = new THREE.Mesh();

        this.mesh.add(new THREE.Mesh(
            new THREE.SphereGeometry(0.47, 8, 32, 0, Math.PI/2),
            new THREE.MeshStandardMaterial({color: 0xff7886})
        ));
        this.mesh.add(new THREE.Mesh(
            new THREE.SphereGeometry(0.47, 8, 32, Math.PI/2, Math.PI/2),
            new THREE.MeshStandardMaterial({color: 0x86ff78})
        ));
        this.mesh.add(new THREE.Mesh(
            new THREE.SphereGeometry(0.47, 8, 32, Math.PI, Math.PI/2),
            new THREE.MeshStandardMaterial({color: 0x7893ff})
        ));
        this.mesh.add(new THREE.Mesh(
            new THREE.SphereGeometry(0.47, 8, 32, 3*Math.PI/2, Math.PI/2),
            new THREE.MeshStandardMaterial({color: 0xffb778})
        ));

        this.mesh.children.forEach(m => m.castShadow = true);

        // Outline
        this.mesh.add(new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 32, 32),
            mesh_outline_material
        ));

        world.add(this.body);
        scene.add(this.mesh);

    },

    update: function(delta, pitchObject, yawObject) {

        let quat = new CANNON.Quaternion();
        let inputVelocity = new THREE.Vector3(0, 0, 0);
    
        if (keyboard['KeyW']) {
            inputVelocity.x = -this.speed * delta * 50;
        }
        if (keyboard['KeyS']) {
            inputVelocity.x = this.speed * delta * 50;
        }
        if (keyboard['KeyA']) {
            inputVelocity.z = this.speed * delta * 50;
        }
        if (keyboard['KeyD']) {
            inputVelocity.z = -this.speed * delta * 50;
        }

        inputVelocity.applyQuaternion(quat.setFromEuler(pitchObject.rotation.x, yawObject.rotation.y, 0));
        this.body.angularVelocity.x += inputVelocity.x;
        this.body.angularVelocity.z += inputVelocity.z;
        yawObject.position.copy(this.body.position);

        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);
        
    }

}

player.init();
directionalLight.target = player.mesh;

player.body.addEventListener('collide', (event) => {
    if (event.body.id === 0) {
        player.body.velocity.set(0, 0, 0);
        player.body.angularVelocity.set(0, 0, 0);
        player.body.position.set(0, 14, 4);

        pitchObject.rotation.set(0, 0, 0);
        yawObject.rotation.set(0, 0, 0);
    }
});