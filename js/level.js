"use strict";

const gltfLoader = new THREE.GLTFLoader();
gltfLoader.load('assets/cannon.gltf', function(gltf) {

    gltf.scene.rotation.y -= 90*degToRad;

    needsDeltaUpdate.push(new CannonEnemy([20, 10, -20], gltf.scene.clone()));

    // Enable shadow receiving on all meshes in scene
    scene.traverse(function(child) {
        if (child.isMesh) {
            child.receiveShadow = true;
        }
    });

    animate();

});

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

// (size, pos, rot, color, contactMaterial)
createStaticCylinder([1.3, 1.3, 0.25], [0, 10, 4], [0, 0, 0], 0x00cc00);  // starting platform

createStaticBox([1, 0.25, 3], [0, 9, 0], [0, 0, 0], 0xcc0000);
createStaticBox([1, 0.25, 3], [-1, 8, -3], [0, 30, 0], 0xcc0000);
createStaticBox([1, 0.25, 5], [-4, 7, -6], [0, 45, 0], 0xcc0000);
createStaticBox([1, 0.25, 5], [-4.80, 5, -10], [-30, 0, -45], 0xcc0000);
createStaticBox([1, 0.25, 5], [-2.4, 3, -13.2], [26, -63, 0], 0xcc0000);
createStaticBox([1, 0.25, 5], [-0.7, 4.7, -17.3], [30, 0, 0], 0xcc0000);
createStaticBox([1, 0.25, 5], [-0.7, 5.7, -22.5], [0, 0, 0], 0xcc0000);

createStaticCylinder([3, 3, 0.25], [-0.5, 3.7, -70], [0, 0, 0], 0xcc0000);

// -----------------------------------
// spinning cylinder
let spinningCylinderBody = new CANNON.Body({
    shape: new CANNON.Cylinder(2, 2, 40, 3),
    position: new CANNON.Vec3(-0.5, 4, -46),
    material: groundMaterial,
    type: CANNON.Body.KINEMATIC
});
spinningCylinderBody.angularVelocity.z += 1;
world.add(spinningCylinderBody);

let spinningCylinderMesh = new THREE.Mesh();
let spinningCylinderMeshTemp = new THREE.Mesh(
    new THREE.CylinderGeometry(2, 2, 40, 3),
    new THREE.MeshStandardMaterial({vertexColors: THREE.FaceColors})
);
spinningCylinderMeshTemp.add(new THREE.Mesh(
    new THREE.CylinderGeometry(2 + 0.06, 2 + 0.06, 40 + 0.06, 3),
    mesh_outline_material
));
spinningCylinderMeshTemp.rotation.y += 90*degToRad;
spinningCylinderMeshTemp.rotation.x += 90*degToRad;

spinningCylinderMeshTemp.geometry.faces[0].color.set(0xcc0000);
spinningCylinderMeshTemp.geometry.faces[1].color.set(0xcc0000);

spinningCylinderMeshTemp.geometry.faces[2].color.set(0x00cc00);
spinningCylinderMeshTemp.geometry.faces[3].color.set(0x00cc00);

spinningCylinderMeshTemp.geometry.faces[4].color.set(0x0000cc);
spinningCylinderMeshTemp.geometry.faces[5].color.set(0x0000cc);

spinningCylinderMeshTemp.geometry.faces[6].color.setHex(0xffff00);
spinningCylinderMeshTemp.geometry.faces[7].color.setHex(0xffff00);
spinningCylinderMeshTemp.geometry.faces[8].color.setHex(0xffff00);

spinningCylinderMeshTemp.geometry.faces[9].color.setHex(0xffff00);
spinningCylinderMeshTemp.geometry.faces[10].color.setHex(0xffff00);
spinningCylinderMeshTemp.geometry.faces[11].color.setHex(0xffff00);

spinningCylinderMesh.add(spinningCylinderMeshTemp);
scene.add(spinningCylinderMesh);

bodyMeshOverlap.push([spinningCylinderBody, spinningCylinderMesh]);

// --------------------
// delay platform spin
needsDeltaUpdate.push(new DelayedSpinPlatform([2, 0.25, 5], [-0.5, 3.3, -76], 2, 20));

// --------------------------
// spinning platform
let spinningPlatform = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.125, 8)),
    position: new CANNON.Vec3(-0.5, 3, -87),
    type: CANNON.Body.KINEMATIC,
    material: groundMaterial
});
spinningPlatform.angularVelocity.y += 1;
world.add(spinningPlatform);
let spinningPlatformMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.25, 16),
    new THREE.MeshStandardMaterial({color: getRandomColor()})
);
spinningPlatformMesh.add(new THREE.Mesh(
    new THREE.BoxGeometry(1 + 0.03, 0.25 + 0.03, 16 + 0.03),
    mesh_outline_material
));
scene.add(spinningPlatformMesh);

bodyMeshOverlap.push([spinningPlatform, spinningPlatformMesh]);


createStaticCylinder([1.3, 1.3, 0.25], [-0.5, 2.5, -97], [0, 0, 0], 0x00cc00);  // ending platform


function animate() {

    requestAnimationFrame(animate);

    let delta = clock.getDelta();

    for(let i = 0; i < bodyMeshOverlap.length; i++) {
        bodyMeshOverlap[i][1].position.copy(bodyMeshOverlap[i][0].position);
        bodyMeshOverlap[i][1].quaternion.copy(bodyMeshOverlap[i][0].quaternion);
    }

    for (let i = 0; i < needsDeltaUpdate.length; i++) {
        needsDeltaUpdate[i].update(delta);
    }

    if (cameraSwitch) {
        renderer.render(scene, tempCamera);
    }
    else {
        renderer.render(scene, camera);
    }

    world.step(dt);

    playerCoordinates.textContent = `x: ${player.body.position.x.toFixed(1)} y: ${player.body.position.y.toFixed(1)} z: ${player.body.position.z.toFixed(1)}`;

    updateTesters();

    player.update(delta, pitchObject, yawObject);
    groundMesh.position.set(player.mesh.position.x, 0.5, player.mesh.position.z);
    directionalLight.position.set(player.body.position.x, player.body.position.y + 15, player.body.position.z)

    if (debugRenderer) {
        cannonDebugRenderer.update();
    }

    stats.update();

}


function updateTesters() {

    // Camera switch with C to look around
    if (keyboard['KeyC']) {
        if (cameraSwitchFlag) {
            cameraSwitch = !cameraSwitch;
            cameraSwitchFlag = false;
        }
    }
    else {
        cameraSwitchFlag = true;
    }

    // ----------------------------------
    // Use arrows to control testBody when figuring out where/how to place obstacles
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
    if (keyboard['Space']) {
        console.log(`Pos: (${testBody.position.x.toFixed(2)}, ${testBody.position.y.toFixed(2)}, ${testBody.position.z.toFixed(2)}), Rot: (${testAngle.x}, ${testAngle.y}, ${testAngle.z})`);
    }
    if (keyboard['ShiftLeft']) {
        testSpeed = 0.05;
    }
    else {
        testSpeed = 0.01;
    }

    testBody.quaternion.setFromEuler(testAngle.x*degToRad, testAngle.y*degToRad, testAngle.z*degToRad);

}

function getRandomColor() {
    return `rgb(${Math.floor(Math.random()*254)}, ${Math.floor(Math.random()*254)}, ${Math.floor(Math.random()*254)})`;
}

function createStaticBox(size, pos, rot, color, contactMaterial = groundMaterial) {

    // Body
    const tempStaticBoxBody = new CANNON.Body({
        shape: new CANNON.Box(new CANNON.Vec3(size[0]/2, size[1]/2, size[2]/2)),
        position: new CANNON.Vec3(pos[0], pos[1], pos[2]),
        type: CANNON.Body.STATIC,
        material: contactMaterial
    });
    tempStaticBoxBody.quaternion.setFromEuler(rot[0]*degToRad, rot[1]*degToRad, rot[2]*degToRad);

    // Mesh
    const tempStaticBoxMesh = new THREE.Mesh(
        new THREE.BoxGeometry(size[0], size[1], size[2]),
        new THREE.MeshStandardMaterial({color: color})
        );
    tempStaticBoxMesh.matrixAutoUpdate = false;

    // Outline
    tempStaticBoxMesh.add(new THREE.Mesh(
        new THREE.BoxGeometry(size[0]+0.06, size[1]+0.06, size[2]+0.06),
        mesh_outline_material
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

function createStaticCylinder(size, pos, rot, color, contactMaterial = groundMaterial) {

    // Body
    const tempStaticCylinderBody = new CANNON.Body({
        shape: new CANNON.Cylinder(size[0], size[1], size[2], 16),
        position: new CANNON.Vec3(pos[0], pos[1], pos[2]),
        type: CANNON.Body.STATIC,
        material: contactMaterial
    });
    tempStaticCylinderBody.quaternion.setFromEuler(rot[0]*degToRad+(90*degToRad), rot[2]*degToRad, rot[1]*degToRad);
    world.add(tempStaticCylinderBody);

    // Mesh
    const tempStaticCylinderMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(size[0], size[1], size[2], 32),
        new THREE.MeshStandardMaterial({color: color})
    );
    tempStaticCylinderMesh.matrixAutoUpdate = false;

    // Outline
    tempStaticCylinderMesh.add(new THREE.Mesh(
        new THREE.CylinderGeometry(size[0]+0.04, size[1]+0.04, size[2]+0.04, 32),
        mesh_outline_material
    ));

    // Overlap Mesh to Body
    tempStaticCylinderMesh.position.copy(tempStaticCylinderBody.position);
    tempStaticCylinderMesh.updateMatrix();
    scene.add(tempStaticCylinderMesh);

    // Move player and testbody starting position after every platform added (for testing made easier)
    // player.body.position.set(pos[0], pos[1]+3, pos[2]);
    testBody.position.set(pos[0], pos[1], pos[2]-5);

}

function CannonEnemy(pos, gltf) {

    // GLTF Mesh
    const cannonMesh = new THREE.Mesh();
    cannonMesh.add(gltf);
    
    // Outline
    const cannonMeshOutline = cannonMesh.clone();
    cannonMeshOutline.scale.multiplyScalar(1.025);
    cannonMeshOutline.traverse(function(child) {
        if (child.isMesh) {
            child.material = mesh_outline_material;
        }
    });

    cannonMesh.add(cannonMeshOutline);
    cannonMesh.position.set(pos[0], pos[1], pos[2]);
    scene.add(cannonMesh);

    // Each cannon has 3 balls suspended out of sight at creation. Switch to a different one each time when firing
    const balls = [];

    for (let i = 0; i < 3; i++) {

        const body = new CANNON.Body({
            mass: 75,
            shape: new CANNON.Sphere(0.65),
            position: new CANNON.Vec3(pos[0], pos[1] + 500, pos[2] - i*2),
            material: superSlipperyMaterial,
            type: CANNON.Body.DYNAMIC
        });
        body.sleep();
        world.add(body);

        balls.push(body);

        const mesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.65, 16, 16),
            new THREE.MeshStandardMaterial({color: 0x202020})
        );
        scene.add(mesh);

        bodyMeshOverlap.push([body, mesh]);
    }

    const target = new THREE.Vector3();
    const rotationMatrix = new THREE.Matrix4();
    const targetQuaternion = new THREE.Quaternion();

    let timer = 0;
    let ballToFire = 0;
    const ballVelocity = new THREE.Vector3();

    // Check if cannon is within range of player then keep firing
    this.update = function(delta) {

        if (cannonMesh.position.distanceTo(player.mesh.position) < 30) {

            // For smooth rotation of cannon towards the player when targeting
            target.set(player.mesh.position.x, player.mesh.position.y + 1.5, player.mesh.position.z);
            rotationMatrix.lookAt(target, cannonMesh.position, cannonMesh.up);
            targetQuaternion.setFromRotationMatrix(rotationMatrix);
            cannonMesh.quaternion.rotateTowards(targetQuaternion, delta);
            
            timer += delta;

            // Firing at interval
            if (timer > 3) {

                timer = 0;

                ballVelocity.set(0, 0, 0);
                ballVelocity.z = Math.min(60, cannonMesh.position.distanceTo(player.mesh.position) * 3);

                ballVelocity.applyQuaternion(cannonMesh.quaternion);
                balls[ballToFire].wakeUp();
                balls[ballToFire].position.set(cannonMesh.position.x, cannonMesh.position.y, cannonMesh.position.z);
                balls[ballToFire].velocity.set(ballVelocity.x, ballVelocity.y, ballVelocity.z);

                if (ballToFire > 1) {
                    ballToFire = 0;
                }
                else {
                    ballToFire++;
                }

            }

        }

    }

}

function DelayedSpinPlatform(size, pos, delay, speed) {

    const body = new CANNON.Body({
        shape: new CANNON.Box(new CANNON.Vec3(size[0]/2, size[1]/2, size[2]/2)),
        position: new CANNON.Vec3(pos[0], pos[1], pos[2]),
        material: groundMaterial,
        type: CANNON.Body.KINEMATIC
    });

    world.add(body);

    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(size[0], size[1], size[2]),
        new THREE.MeshStandardMaterial({color: getRandomColor()})
    );

    // Outline
    mesh.add(new THREE.Mesh(
        new THREE.BoxGeometry(size[0]+0.06, size[1]+0.06, size[2]+0.06),
        mesh_outline_material
    ));

    scene.add(mesh);

    bodyMeshOverlap.push([body, mesh]);

    let timer = 0;
    let prevRot = 0;

    this.update = function(delta) {

        if (body.angularVelocity.z === 0) {

            timer += delta;

        }
        else {

            if (mesh.rotation.z > 0 && mesh.rotation.z < (mesh.rotation.z - prevRot)) {

                body.angularVelocity.z = 0;
                body.quaternion.setFromEuler(0, 0, 0);

            }

            prevRot = mesh.rotation.z;

        }

        if (timer > delay) {

            body.angularVelocity.z = -speed;
            timer = 0;

        }

    }

}