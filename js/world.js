"use strict";

const dt = 1.0 / 60.0;
let time = Date.now();
let speed = 1.5;
let playerDeathCounter = 0;

let bodyMeshOverlap = [];

const X_AXIS = new CANNON.Vec3(1, 0, 0);
const Y_AXIS = new CANNON.Vec3(0, 1, 0);
const Z_AXIS = new CANNON.Vec3(0, 0, 1);

const DEG2RAD = Math.PI / 180;

const MESH_OUTLINE_MATERIAL = new THREE.MeshBasicMaterial({color: 0x000000, side: THREE.BackSide});

// Ambient Light
scene.add(new THREE.AmbientLight(0xffffff, 1));

// Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
directionalLight.position.y += 20;
scene.add(directionalLight);
directionalLight.castShadow = true;
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
scene.add(directionalLightHelper);

// Ground Body
const groundBody = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Plane()
});
groundBody.quaternion.setFromAxisAngle(X_AXIS, -Math.PI/2);
world.add(groundBody);

// Ground Mesh
const groundMesh = new THREE.Mesh(
    new THREE.BoxGeometry(20, 1, 20),
    new THREE.MeshStandardMaterial({color: getRandomColor()})
);
groundMesh.position.set(0, -0.5, 0);
scene.add(groundMesh);

const player = {

    init: function() {

        // Player Body
        this.body = new CANNON.Body({
            shape: new CANNON.Sphere(0.5),
            position: new CANNON.Vec3(0, 12, 4),
            mass: 10,
            material: playerMaterial,
            angularDamping: 0.9
        });

        // Player Mesh
        this.mesh = new THREE.Mesh();

        this.mesh.add(new THREE.Mesh(
            new THREE.SphereGeometry(0.48, 8, 32, 0, Math.PI/2),
            new THREE.MeshStandardMaterial({color: 0xff7886})
        ));
        this.mesh.add(new THREE.Mesh(
            new THREE.SphereGeometry(0.48, 8, 32, Math.PI/2, Math.PI/2),
            new THREE.MeshStandardMaterial({color: 0x86ff78})
        ));
        this.mesh.add(new THREE.Mesh(
            new THREE.SphereGeometry(0.48, 8, 32, Math.PI, Math.PI/2),
            new THREE.MeshStandardMaterial({color: 0x7893ff})
        ));
        this.mesh.add(new THREE.Mesh(
            new THREE.SphereGeometry(0.48, 8, 32, 3*Math.PI/2, Math.PI/2),
            new THREE.MeshStandardMaterial({color: 0xffb778})
        ));

        this.mesh.children.forEach(m => m.castShadow = true);

        // Add outline around ball
        this.mesh.add(new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 32, 32),
            MESH_OUTLINE_MATERIAL
        ));

        world.add(this.body);
        scene.add(this.mesh);

    },

    update: function() {

        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);
        
    }

}

player.init();
player.mesh.position.set(3, 12, 5);
directionalLight.target = player.mesh;

player.body.addEventListener('collide', (event) => {
    if (event.body.id === 0) {
        player.body.velocity.set(0, 0, 0);
        player.body.angularVelocity.set(0, 0, 0);
        player.body.position.set(0, 12, 4);

        pitchObject.rotation.set(0, 0, 0);
        yawObject.rotation.set(0, 0, 0);

        playerDeathCounter += 1;
        console.log('Deaths: ' + playerDeathCounter);

        testBody2.position.set(8, 8, -3.25);
        testBody2.quaternion.setFromEuler(0, 0, 0);
        testBody2.sleep();
    }
});


// ------------------
// carousel
const carouselBlades = new CANNON.Body({
    position: new CANNON.Vec3(-5, 7.75, 5),
    type: CANNON.Body.KINEMATIC,
    material: slipperyMaterial
});
carouselBlades.angularVelocity.y += 3;
carouselBlades.addShape(
    new CANNON.Box(new CANNON.Vec3(0.25, 0.5, 3))
);
carouselBlades.addShape(
    new CANNON.Box(new CANNON.Vec3(3, 0.5, 0.25))
);
world.add(carouselBlades);
let carouselBladesMesh = new THREE.Mesh();
let carouselBladesColor = new THREE.MeshStandardMaterial({color: getRandomColor()});
carouselBladesMesh.add(new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 1, 6),
    carouselBladesColor
));
carouselBladesMesh.add(new THREE.Mesh(
    new THREE.BoxGeometry(6, 1, 0.5),
    carouselBladesColor
));
// carousel blades outline
carouselBladesMesh.add(new THREE.Mesh(
    new THREE.BoxGeometry(0.52, 1.02, 6.02),
    MESH_OUTLINE_MATERIAL
));
carouselBladesMesh.add(new THREE.Mesh(
    new THREE.BoxGeometry(6.02, 1.02, 0.52),
    MESH_OUTLINE_MATERIAL
));
scene.add(carouselBladesMesh);
bodyMeshOverlap.push([carouselBlades, carouselBladesMesh]);
// ----------------------------

let testShape = new CANNON.Vec3(1, 0.25, 5);
testShape.x /= 2;
testShape.y /= 2;
testShape.z /= 2;
let testBody = new CANNON.Body({
    shape: new CANNON.Box(testShape),
    type: CANNON.Body.STATIC,
    material: groundMaterial
});
world.add(testBody);

let testAngle = new THREE.Vector3(0, 0, 0);
let testSpeed = 0.01;

//-----------------
// changing from static to dynamic (or sleep mode on/off)
let testBody2 = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(5, 0.5, 5)),
    mass: 50,
    type: CANNON.Body.DYNAMIC,
    position: new CANNON.Vec3(8, 8, -3.25),
    material: groundMaterial
});
testBody2.sleep();
world.add(testBody2);
let testMesh2 = new THREE.Mesh(
    new THREE.BoxGeometry(10, 1, 10),
    new THREE.MeshStandardMaterial({color: getRandomColor()})
);
testMesh2.add(new THREE.Mesh(
    new THREE.BoxGeometry(10.05, 1.05, 10.05),
    MESH_OUTLINE_MATERIAL
));
scene.add(testMesh2);
bodyMeshOverlap.push([testBody2, testMesh2]);


//                      Size          Pos         Rot        contactMaterial
createStaticCylinder([3, 3, 0.25], [-5, 7, 5], [0, 0, 0]);      // carousel base
createStaticCylinder([1.3, 1.3, 0.25], [0, 10, 4], [0, 0, 0]);  // starting platform

//                  Size         Pos         Rot    contactMaterial    color
createStaticBox([4, 0.5, 8], [3, 9, 6], [0, 0, 0], slipperyMaterial, 0xaeccd3);  // Ice slippery platform
createStaticBox([4, 0.5, 8], [15, 9, 6], [0, 0, 0], slipperyMaterial, 0xaeccd3);  // Ice slippery platform
createStaticBox([8, 0.5, 8], [9, 9, 6], [0, 0, 0], superSlipperyMaterial, 0x77aaff);  // Ice no friction platform
createStaticBox([1, 0.25, 3], [0, 9, 0], [0, 0, 0]);
createStaticBox([1, 0.25, 3], [-1, 8, -3], [0, 30, 0]);
createStaticBox([1, 0.25, 5], [-4, 7, -6], [0, 45, 0]);
createStaticBox([1, 0.25, 5], [-4.80, 7, -9.6], [0, -45, 0]);
createStaticBox([1, 0.25, 5], [-4, 7, -13.2], [0, 45, 0]);


// --------------------------
// spinning platform
let spinningPlatform = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.125, 2.5)),
    position: new CANNON.Vec3(-7.7, 7, -16.9),
    type: CANNON.Body.KINEMATIC,
    material: groundMaterial
});
spinningPlatform.angularVelocity.y += 1.5;
world.add(spinningPlatform);
let spinningPlatformMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.25, 5),
    new THREE.MeshStandardMaterial({color: getRandomColor()})
);
spinningPlatformMesh.add(new THREE.Mesh(
    new THREE.BoxGeometry(1.03, 0.28, 5.03),
    MESH_OUTLINE_MATERIAL
));
scene.add(spinningPlatformMesh);

bodyMeshOverlap.push([spinningPlatform, spinningPlatformMesh]);


// -----------------------
// cannon ball
const cannonBallContainer = new THREE.Object3D();
const cannonBallContainerMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(1, 1, 3),
    new THREE.MeshStandardMaterial({color: 0x505050})
);
cannonBallContainerMesh.rotation.x += Math.PI / 2;
cannonBallContainer.position.set(10, 15, 0);
cannonBallContainer.add(cannonBallContainerMesh);
cannonBallContainer.lookAt(player.mesh.position);
scene.add(cannonBallContainer);

let cannonBallFlag = true;


// -------------------------------------------
// cylinder flip
const flipCylinderShape = new CANNON.Cylinder(1.5, 1.5, 0.25, 16);
let flipCylinderBody1 = new CANNON.Body({
    shape: flipCylinderShape,
    position: new CANNON.Vec3(2.5, 9, 12),
    type: CANNON.Body.KINEMATIC
});
let flipCylinderBody2 = new CANNON.Body({
    shape: flipCylinderShape,
    position: new CANNON.Vec3(2.5, 9, 15.1),
    type: CANNON.Body.KINEMATIC
});
let flipCylinderBody3 = new CANNON.Body({
    shape: flipCylinderShape,
    position: new CANNON.Vec3(2.5, 9, 18.2),
    type: CANNON.Body.KINEMATIC
});
let flipCylinderBody4 = new CANNON.Body({
    shape: flipCylinderShape,
    position: new CANNON.Vec3(2.5, 9, 21.3),
    type: CANNON.Body.STATIC
});
flipCylinderBody1.angularVelocity.z += 0.5;
flipCylinderBody2.angularVelocity.z -= 0.5;
flipCylinderBody3.angularVelocity.z += 0.5;

flipCylinderBody1.quaternion.setFromAxisAngle(X_AXIS, -Math.PI/2);
flipCylinderBody2.quaternion.setFromAxisAngle(X_AXIS, -Math.PI/2);
flipCylinderBody3.quaternion.setFromAxisAngle(X_AXIS, -Math.PI/2);
flipCylinderBody4.quaternion.setFromAxisAngle(X_AXIS, -Math.PI/2);

world.add(flipCylinderBody1);
world.add(flipCylinderBody2);
world.add(flipCylinderBody3);
world.add(flipCylinderBody4);

let flipCylinderMeshTemp = new THREE.Mesh(
    new THREE.CylinderGeometry(1.5, 1.5, 0.25, 32),
    new THREE.MeshStandardMaterial({color: getRandomColor()})
);
flipCylinderMeshTemp.rotation.x += Math.PI/2;

flipCylinderMeshTemp.add(new THREE.Mesh(
    new THREE.CylinderGeometry(1.53, 1.53, 0.28, 32),
    MESH_OUTLINE_MATERIAL
));

let flipCylinderMesh1 = new THREE.Mesh();
flipCylinderMesh1.add(flipCylinderMeshTemp);

let flipCylinderMesh2 = flipCylinderMesh1.clone();
let flipCylinderMesh3 = flipCylinderMesh1.clone();
let flipCylinderMesh4 = flipCylinderMesh1.clone();

scene.add(flipCylinderMesh1);
scene.add(flipCylinderMesh2);
scene.add(flipCylinderMesh3);
scene.add(flipCylinderMesh4);

bodyMeshOverlap.push([flipCylinderBody1, flipCylinderMesh1]);
bodyMeshOverlap.push([flipCylinderBody2, flipCylinderMesh2]);
bodyMeshOverlap.push([flipCylinderBody3, flipCylinderMesh3]);
bodyMeshOverlap.push([flipCylinderBody4, flipCylinderMesh4]);


// Enable shadows receiving on all meshes in scene
scene.traverse(function(child) {
    if (child.isMesh) {
        child.receiveShadow = true;
    }
});

animate();

function animate() {

    requestAnimationFrame(animate);

    for(let i = 0; i < bodyMeshOverlap.length; i++) {
        bodyMeshOverlap[i][1].position.copy(bodyMeshOverlap[i][0].position);
        bodyMeshOverlap[i][1].quaternion.copy(bodyMeshOverlap[i][0].quaternion);
    }

    if (cameraSwitch) {
        renderer.render(scene, tempCamera);
    }
    else {
        renderer.render(scene, camera);
    }

    directionalLight.position.set(player.body.position.x, player.body.position.y + 15, player.body.position.z)

    world.step(dt);

    playerCoordinates.textContent = `x: ${player.body.position.x.toFixed(1)} y: ${player.body.position.y.toFixed(1)} z: ${player.body.position.z.toFixed(1)}`;

    updateMovement();
    player.update();
    
    if (debugRenderer) {
        cannonDebugRenderer.update();
    }
    stats.update();

}

function updateMovement() {

    let quat = new CANNON.Quaternion();
    let inputVelocity = new THREE.Vector3(0, 0, 0);

    let cannonBallVelocity = new THREE.Vector3(0, 0, 0);

    if (keyboard['KeyW']) {
        inputVelocity.x = -speed;
    }
    if (keyboard['KeyS']) {
        inputVelocity.x = speed;
    }
    if (keyboard['KeyA']) {
        inputVelocity.z = speed;
    }
    if (keyboard['KeyD']) {
        inputVelocity.z = -speed;
    }
    if (keyboard['KeyC']) {
        cannonBallFlag = true;
        if (cameraSwitchFlag) {
            cameraSwitch = !cameraSwitch;
            cameraSwitchFlag = false;
        }
    }
    else {
        cameraSwitchFlag = true;
    }

    // ----------------------------------
    // Use to arrows to control testBody when figuring out where/how to place obstacles
    // Move positions x/z ('n' to move y up/down)
    // Hold 'r' to rotate x/z ('n' and 'r' same time to rotate y)
    if (keyboard['ArrowUp']) {
        if (keyboard['KeyN'] && keyboard['KeyR']) {
            testAngle.y -= 0.5;
        }
        else {
            if (keyboard['KeyR']) {
                testAngle.x -= 0.5;
            }
            else {
                if (keyboard['KeyN']) {
                    testBody.position.y += testSpeed;
                }
                else {
                    testBody.position.z -= testSpeed;
                }
            }
        }
    }
    if (keyboard['ArrowDown']) {
        if (keyboard['KeyN'] && keyboard['KeyR']) {
            testAngle.y += 0.5;
        }
        else {
            if (keyboard['KeyR']) {
                testAngle.x += 0.5;
            }
            else {
                if (keyboard['KeyN']) {
                    testBody.position.y -= testSpeed;
                }
                else {
                    testBody.position.z += testSpeed;
                }
            }
        }
    }
    if (keyboard['ArrowLeft']) {
        if (keyboard['KeyR']) {
            testAngle.z += 1;
        }
        else {
            testBody.position.x -= testSpeed;
        }
    }
    if (keyboard['ArrowRight']) {
        if (keyboard['KeyR']) {
            testAngle.z -= 1;
        }
        else {
            testBody.position.x += testSpeed;
        }
    }
    if (keyboard['KeyT']) {
        testAngle.set(0, 0, 0);
    }
    // if (keyboard['Space']) {
    //     console.log(`Pos: (${testBody.position.x.toFixed(2)}, ${testBody.position.y.toFixed(2)}, ${testBody.position.z.toFixed(2)}), Rot: (${testAngle.x}, ${testAngle.y}, ${testAngle.z})`);
    // }
    if (keyboard['ShiftLeft']) {
        testSpeed = 0.05;
    }
    else {
        testSpeed = 0.01;
    }

    testBody.quaternion.setFromEuler(testAngle.x*DEG2RAD, testAngle.y*DEG2RAD, testAngle.z*DEG2RAD);

    inputVelocity.applyQuaternion(quat.setFromEuler(pitchObject.rotation.x, yawObject.rotation.y, 0));
    player.body.angularVelocity.x += inputVelocity.x;
    player.body.angularVelocity.z += inputVelocity.z;
    yawObject.position.copy(player.body.position);

    // cannonBallContainer.rotation.y += 0.01;

    if (keyboard['Space']) {
        cannonBallVelocity.z = Math.min(60, cannonBallContainer.position.distanceTo(player.mesh.position) * 3);
        cannonBallContainer.lookAt(player.mesh.position.x, player.mesh.position.y + 1, player.mesh.position.z);
        cannonBallVelocity.applyQuaternion(cannonBallContainer.quaternion);

        if (cannonBallFlag) {
            cannonBallFlag = false;
            let cannonBallBody = new CANNON.Body({
                mass: 75,
                shape: new CANNON.Sphere(0.65),
                position: cannonBallContainer.position
            });
            world.add(cannonBallBody);
            cannonBallBody.velocity.set(cannonBallVelocity.x, cannonBallVelocity.y, cannonBallVelocity.z);
            let cannonBallMesh = new THREE.Mesh(
                new THREE.SphereGeometry(0.65, 16, 16),
                new THREE.MeshStandardMaterial({color: 0x303030})
            );
            scene.add(cannonBallMesh);
            bodyMeshOverlap.push([cannonBallBody, cannonBallMesh]);
        }

    }

}

function getRandomColor() {
    return `rgb(${Math.floor(Math.random()*254)}, ${Math.floor(Math.random()*254)}, ${Math.floor(Math.random()*254)})`;
}

function createStaticBox(size, pos, rot, contactMaterial = groundMaterial, color = 'rgb(204, 0, 0)') {

    // Body
    let tempStaticBoxBody = new CANNON.Body({
        shape: new CANNON.Box(new CANNON.Vec3(size[0]/2, size[1]/2, size[2]/2)),
        position: new CANNON.Vec3(pos[0], pos[1], pos[2]),
        type: CANNON.Body.STATIC,
        material: contactMaterial
    });
    tempStaticBoxBody.quaternion.setFromEuler(rot[0]*DEG2RAD, rot[1]*DEG2RAD, rot[2]*DEG2RAD);

    // Mesh
    let tempStaticBoxMesh = new THREE.Mesh(
        new THREE.BoxGeometry(size[0], size[1], size[2]),
        new THREE.MeshStandardMaterial({color: color})
        );
    tempStaticBoxMesh.matrixAutoUpdate = false;

    // Outline
    tempStaticBoxMesh.add(new THREE.Mesh(
        new THREE.BoxGeometry(size[0]+0.03, size[1]+0.03, size[2]+0.03),
        MESH_OUTLINE_MATERIAL
    ));
    
    // Overlap Mesh to Body
    tempStaticBoxMesh.position.copy(tempStaticBoxBody.position);
    tempStaticBoxMesh.quaternion.copy(tempStaticBoxBody.quaternion);
    tempStaticBoxMesh.updateMatrix();

    world.add(tempStaticBoxBody);
    scene.add(tempStaticBoxMesh);


    // Move player and testbody starting position after every platform added (for testing made easier)
    // player.body.position.set(pos[0], pos[1]+3, pos[2]);
    testBody.position.set(pos[0], pos[1], pos[2]-5);

}

function createStaticCylinder(size, pos, rot, contactMaterial = groundMaterial) {

    // Body
    let tempStaticCylinderBody = new CANNON.Body({
        shape: new CANNON.Cylinder(size[0], size[1], size[2], 16),
        position: new CANNON.Vec3(pos[0], pos[1], pos[2]),
        type: CANNON.Body.STATIC,
        material: contactMaterial
    });
    tempStaticCylinderBody.quaternion.setFromEuler(rot[0]*DEG2RAD+(Math.PI/2), rot[2]*DEG2RAD, rot[1]*DEG2RAD);

    // Mesh
    let tempStaticCylinderMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(size[0], size[1], size[2], 32),
        new THREE.MeshStandardMaterial({color: getRandomColor()})
    );
    tempStaticCylinderMesh.matrixAutoUpdate = false;

    // Outline
    tempStaticCylinderMesh.add(new THREE.Mesh(
        new THREE.CylinderGeometry(size[0]+0.02, size[1]+0.02, size[2]+0.02, 32),
        MESH_OUTLINE_MATERIAL
    ));

    // Overlap Mesh to Body
    tempStaticCylinderMesh.position.copy(tempStaticCylinderBody.position);
    tempStaticCylinderMesh.updateMatrix();

    world.add(tempStaticCylinderBody);
    scene.add(tempStaticCylinderMesh);

}