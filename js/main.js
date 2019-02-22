let scene, camera;
let renderer;
let width;

let cars = [];

const config = {
    isMobile: false,
    background: 0x2196f3// TODO: Change it to Blue
};

width = window.innerWidth;
height = window.innerHeight;

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(45, width / height, 1, 3000);
camera.position.set(-300, 330, 630);
camera.lookAt(scene.position);

renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(width, height);
renderer.setClearColor(config.background);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

checkUserAgent();

buildAuxSystem();
buildLightSystem();
buildbuilding();
buildMovingCars();

loop();
onWindowResize();

function checkUserAgent() {
    const n = navigator.userAgent;
    if (n.match(/Android/i) || n.match(/webOS/i) || n.match(/iPhone/i) || n.match(/iPad/i) || n.match(/iPod/i) || n.match(/BlackBerry/i)) {
        config.isMobile = true;
        camera.position.set(420, 420, 420);
        renderer.shadowMap.enabled = false;
    }
}

function buildMovingCars() {
    const carsPosition = [
        [-330, 285, 0],
    ];
    carsPosition.forEach(function (elem) {
        const car = new Car();
        const x = elem[0],
            z = elem[1],
            r = elem[2];
        car.setPosition(x, 0, z);
        car.mesh.rotation.y = r * Math.PI;
        cars.push(car);
        scene.add(car.mesh)
    })
}

function buildStaticCars() {
    // TODO: Add static bus
    const carsPosition = [

    ];
    carsPosition.forEach(function (elem) {
        const car = new Car();
        const x = elem[0],
            z = elem[1],
            r = elem[2];
        car.setPosition(x, 0, z);
        car.mesh.rotation.y = r * Math.PI;
        scene.add(car.mesh)
    })
}

function createCollegeRoad() {
    const road = new THREE.Object3D();
    const roadColor = 0xffffff;

    const roadBorderOuterCoords = [
        [-402, 282],
        [382, 282],
        [382, -362],
        [-402, -362],
    ];
    const roadBorderOuterHoleCoords = [
        [-399, 279],
        [-399, -359],
        [379, -359],
        [379, 279]
    ];
    const roadBorderOuterShape = utils.makeShape(roadBorderOuterCoords, roadBorderOuterHoleCoords);
    const roadBorderOuterGeometry = utils.makeExtrudeGeometry(roadBorderOuterShape, 0.1);
    const roadBorderOuter = utils.makeMesh('phong', roadBorderOuterGeometry, roadColor);
    road.add(roadBorderOuter);

    const roadBorderInnerCoords = [
        [-312, 192],
        [-312, -272],
        [288, -272],
        [288, 192]
    ];
    const roadBorderInnerHoleCoords = [
        [-309, 189],
        [-309, -269],
        [285, -269],
        [285, 189]
    ];
    const roadBorderInnerShape = utils.makeShape(roadBorderInnerCoords, roadBorderInnerHoleCoords);
    const roadBorderInnerGeometry = utils.makeExtrudeGeometry(roadBorderInnerShape, 0.1);
    const roadBorderInner = utils.makeMesh('phong', roadBorderInnerGeometry, roadColor);
    road.add(roadBorderInner);

    let roadLinesGeometry = new THREE.Geometry();
    const roadLineGeometry = new THREE.BoxGeometry(20, 0.5, 2);

    const roadLinesBottomGeometry = new THREE.Geometry();
    for (let i = 0; i < 19; i++) {
        const geometry = roadLineGeometry.clone();
        geometry.translate(i * 30, 0, 200);
        roadLinesBottomGeometry.merge(geometry)
    }
    roadLinesBottomGeometry.translate(-300, 0, 115);
    roadLinesGeometry.merge(roadLinesBottomGeometry);

    const roadLinesTopGeometry = roadLinesBottomGeometry.clone();
    roadLinesTopGeometry.translate(50, 0, -550);
    roadLinesGeometry.merge(roadLinesTopGeometry);

    const roadLinesLeftGeometry = roadLinesBottomGeometry.clone();
    roadLinesLeftGeometry.rotateY(0.5 * Math.PI);
    roadLinesGeometry.merge(roadLinesLeftGeometry);

    const roadLinesRightGeometry = roadLinesBottomGeometry.clone();
    roadLinesRightGeometry.translate(100, 0, 40);
    roadLinesRightGeometry.rotateY(-0.5 * Math.PI);
    roadLinesGeometry.merge(roadLinesRightGeometry);
    roadLinesGeometry = new THREE.BufferGeometry().fromGeometry(roadLinesGeometry);
    const roadLines = utils.makeMesh('phong', roadLinesGeometry, roadColor);
    road.add(roadLines);

    const roadFillerCoords = [
        [-399, 279],
        [-399, -359],
        [379, -359],
        [379, 279]
    ];
    const roadFillerHoleCoords = [
        [-309, 189],
        [-309, -269],
        [285, -269],
        [285, 189]
    ];
    const roadFillerShape = utils.makeShape(roadFillerCoords, roadFillerHoleCoords);
    const roadFillerGeometry = utils.makeExtrudeGeometry(roadFillerShape, 0.1);
    const roadFiller = utils.makeMesh('lambert', roadFillerGeometry, 0x696969);
    road.add(roadFiller);

    return road;
}

function buildbuilding() {
    const planeGeometry = new THREE.BoxBufferGeometry(960, 20, 960);
    const plane = utils.makeMesh('lambert', planeGeometry, 0x6f7f6a);
    plane.position.y = -10;
    plane.position.x = 0;
    scene.add(plane);
    addCollege(0, 0, 0);

    function addCollege(positionX, positionY, positionZ) {
        const college = createCollege();
        const garden = createCollegeGarden();
        const road = createCollegeRoad();
        const tree = createTree(-290, 0, 155, 20);
        college.position.set(positionX, positionY, positionZ);
        garden.position.set(positionX, positionY, positionZ);
        road.position.set(positionX, positionY, positionZ);
        scene.add(college);
        scene.add(garden);
        scene.add(road);
        scene.add(tree);
    }

    function createCollegeGarden() {
        // Garden
        const collegeGarden = new THREE.Object3D();

        // College left side of the garden (smaller one)
        const collegeLeftGarden = [
            [-55, -170],
            [-55, -20],
            [120, -20],
            [120, -170]
        ];

        const collegeLeftHoleGarden = [
            [-45, -160],
            [-45, -30],
            [110, -30],
            [110, -160]
        ];

        const collegeLeftGardenShape = utils.makeShape(collegeLeftGarden, collegeLeftHoleGarden);

        const collegeLeftGardenMainGeometry = utils.makeExtrudeGeometry(collegeLeftGardenShape, 15);
        const collegeLeftGardenMain = utils.makeMesh('lambert', collegeLeftGardenMainGeometry, 0xe5c4a4);
        collegeLeftGardenMain.position.z = 100;
        collegeLeftGardenMain.position.x = -250;
        collegeLeftGardenMain.position.y = 0;
        collegeGarden.add(collegeLeftGardenMain);

        const collegeGardenTopShape = utils.makeShape(collegeLeftHoleGarden);
        const collegeGardenTopGeometry = utils.makeExtrudeGeometry(collegeGardenTopShape, 5);
        const gardenLeftTop = utils.makeMesh('lambert', collegeGardenTopGeometry, 0x4caf50);
        gardenLeftTop.position.z = 98;
        gardenLeftTop.position.x = -250;
        gardenLeftTop.position.y = 10;
        collegeGarden.add(gardenLeftTop);

        // College right side of the garden (bigger one)
        const collegeRightGarden = [
            [240, -170],
            [240, -20],
            [470, -20],
            [470, -170]
        ];

        const collegeRightHoleGarden = [
            [250, -160],
            [250, -30],
            [460, -30],
            [460, -160]
        ];

        const collegeRightGardenShape = utils.makeShape(collegeRightGarden, collegeRightHoleGarden);

        const collegeRightGardenMainGeometry = utils.makeExtrudeGeometry(collegeRightGardenShape, 15);
        const collegeRightGardenMain = utils.makeMesh('lambert', collegeRightGardenMainGeometry, 0xe5c4a4);
        collegeRightGardenMain.position.z = 100;
        collegeRightGardenMain.position.x = -250;
        collegeRightGardenMain.position.y = 0;
        collegeGarden.add(collegeRightGardenMain);

        const collegeGardenRightTopShape = utils.makeShape(collegeRightHoleGarden);
        const collegeGardenRightTopGeometry = utils.makeExtrudeGeometry(collegeGardenRightTopShape, 5);
        const gardenRightTop = utils.makeMesh('lambert', collegeGardenRightTopGeometry, 0x4caf50);
        gardenRightTop.position.z = 98;
        gardenRightTop.position.x = -250;
        gardenRightTop.position.y = 10;
        collegeGarden.add(gardenRightTop);

        return collegeGarden;
    }

    function addTrees() {
        var treesPosition = [
            [-330, 260],
        ]
        treesPosition.forEach(function (elem) {
            var x = elem[0],
                y = 1,
                z = elem[1]
            var tree = createTree(x, y, z)
            scene.add(tree)
        })
    }

    function createCollege() {
        const college = new THREE.Object3D();

        const collegeMainCoordinates = [
            [-60, 40],
            [-60, 245],
            [95, 245],
            [95, 280],
            [245, 280],
            [245, 255],
            [275, 255],
            [275, 280],
            [325, 280],
            [325, 270],
            [535, 270],
            [535, 110],
            [495, 110],
            [495, 60],
            [465, 60],
            [465, 0],
            [275, 0],
            [275, 70],
            [115, 70],
            [95, 70],
            [95, 40],
            [-60, 40]
        ];
        const collegeMainHolePath = [
            [-62, 82],
            [-62, 243],
            [97, 243],
            [97, 278],
            [243, 278],
            [243, 253],
            [277, 253],
            [277, 278],
            [323, 278],
            [323, 268],
            [533, 268],
            [533, 112],
            [493, 112],
            [493, 62],
            [463, 62],
            [463, 2],
            [277, 2],
            [277, 72],
            [113, 72],
            [93, 72],
            [93, 42],
            [-62, 42]
        ];

        const backMainShape = utils.makeShape(collegeMainCoordinates, collegeMainHolePath);

        const backMainGeometry = utils.makeExtrudeGeometry(backMainShape, 170);
        const backMain = utils.makeMesh('lambert', backMainGeometry, 0xe5c4a4);
        backMain.position.z = 100;
        backMain.position.x = -250;
        backMain.position.y = 0;
        college.add(backMain);

        const collegeTopShape = utils.makeShape(collegeMainHolePath);
        const frontTopGeometry = utils.makeExtrudeGeometry(collegeTopShape, 5);
        const frontTop = utils.makeMesh('lambert', frontTopGeometry, 0xe5c4a4);
        frontTop.position.z = 100;
        frontTop.position.x = -249;
        frontTop.position.y = 165.1;
        college.add(frontTop);

        const collegeEntranceMainCoordinates = [
            [115, 20],
            [115, 70],
            [245, 70],
            [245, 20],
        ];

        const collegeEntranceMainCoordinates2 = [
            [115, -20],
            [115, 70],
            [245, 70],
            [245, -20],
        ];

        const collegeEntranceMainShape = utils.makeShape(collegeEntranceMainCoordinates);
        const collegeEntranceMainShape2 = utils.makeShape(collegeEntranceMainCoordinates2);

        const collegeEntranceMainGeometry = utils.makeExtrudeGeometry(collegeEntranceMainShape, 60);
        const collegeEntranceMain = utils.makeMesh('lambert', collegeEntranceMainGeometry, 0xe5c4a4);
        collegeEntranceMain.position.z = 100;
        collegeEntranceMain.position.x = -250;
        collegeEntranceMain.position.y = 60;
        college.add(collegeEntranceMain);

        const collegeEntranceMainGeometry2 = utils.makeExtrudeGeometry(collegeEntranceMainShape2, 60);
        const collegeEntranceMain2 = utils.makeMesh('lambert', collegeEntranceMainGeometry2, 0xe5c4a4);
        collegeEntranceMain2.position.z = 95;
        collegeEntranceMain2.position.x = -250;
        collegeEntranceMain2.position.y = 110.1;
        college.add(collegeEntranceMain2);

        const collegeEntrancePillarGeometry = new THREE.BoxBufferGeometry(5, 100, 5);
        const collegeEntrancePillar = utils.makeMesh('phong', collegeEntrancePillarGeometry, 0xe5c4a4);
        collegeEntrancePillar.receiveShadow = false;
        collegeEntrancePillar.position.set(-130, 40, 77);
        college.add(collegeEntrancePillar);

        const collegeEntrancePillar2 = collegeEntrancePillar.clone();
        collegeEntrancePillar2.position.set(-10, 40, 77);
        college.add(collegeEntrancePillar2);

        const collegeEntrancePillarMainGeometry = new THREE.BoxBufferGeometry(5, 130, 5);
        const collegeEntranceMainPillar = utils.makeMesh('phong', collegeEntrancePillarMainGeometry, 0xe5c4a4);
        collegeEntranceMainPillar.receiveShadow = false;
        collegeEntranceMainPillar.position.set(-10, 60, 110);
        college.add(collegeEntranceMainPillar);

        const collegeEntranceMainPillar2 = collegeEntranceMainPillar.clone();
        collegeEntranceMainPillar2.position.set(-130, 60, 110);
        college.add(collegeEntranceMainPillar2);


        // Back Right Side
        const windowBackRightOrigin = createWindow();
        windowBackRightOrigin.scale.set(1.3, 0.8, 1);
        windowBackRightOrigin.rotation.y = Math.PI;
        windowBackRightOrigin.position.set(255, 145, -171);
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const windowObj = windowBackRightOrigin.clone();
                windowObj.position.x -= i * 50;
                windowObj.position.y -= j * 30;
                college.add(windowObj)
            }
        }


        // Front Right Side
        const windowFrontRightOrigin = createWindow();
        windowFrontRightOrigin.scale.set(0.8, 1.2, 1);
        // windowFrontRightOrigin.rotation.y = Math.PI;
        windowFrontRightOrigin.position.set(190, 145, 101);
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 3; j++) {
                const windowObj = windowFrontRightOrigin.clone();
                windowObj.position.x -= i * 28;
                windowObj.position.y -= j * 43;
                college.add(windowObj)
            }
        }


        // Front Middle Side
        const windowFrontMiddleOrigin = createWindow();
        windowFrontMiddleOrigin.scale.set(1.2, 1, 1);
        // windowFrontRightOrigin.rotation.y = Math.PI;
        windowFrontMiddleOrigin.position.set(-30, 135, 116);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 1; j++) {
                const windowObj = windowFrontMiddleOrigin.clone();
                windowObj.position.x -= i * 38;
                windowObj.position.y -= j * 43;
                college.add(windowObj)
            }
        }


        // Front Left Side
        const windowFrontLeftOrigin = createWindow();
        windowFrontMiddleOrigin.scale.set(1.4, 1, 1);
        // windowFrontRightOrigin.rotation.y = Math.PI;
        windowFrontMiddleOrigin.position.set(-190, 135, 61);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 1; j++) {
                const windowObj = windowFrontMiddleOrigin.clone();
                windowObj.position.x -= i * 45;
                windowObj.position.y -= j * 43;
                college.add(windowObj)
            }
        }

        return college;
    }

    function createWindow() {
        const windowObj = new THREE.Object3D();
        const glassGeometry = new THREE.PlaneGeometry(20, 20);
        const glass = utils.makeMesh('phong', glassGeometry, 0x6a5e74);
        windowObj.add(glass);

        const windowBorderGeometry = new THREE.BoxBufferGeometry(22, 2, 2);
        const windowBorder = utils.makeMesh('phong', windowBorderGeometry, 0xffffff);

        const windowBorderTop = windowBorder.clone();
        windowBorderTop.position.y = 10;
        windowObj.add(windowBorderTop);

        const windowBorderBottom = windowBorder.clone();
        windowBorderBottom.position.y = -10;
        windowObj.add(windowBorderBottom);

        const windowBorderLeft = windowBorder.clone();
        windowBorderLeft.rotation.z = 0.5 * Math.PI;
        windowBorderLeft.position.x = -10;
        windowObj.add(windowBorderLeft);

        const windowBorderRight = windowBorderLeft.clone();
        windowBorderRight.position.x = 10;
        windowObj.add(windowBorderRight);

        return windowObj
    }

    function createTree(x, y, z, offset) {
        var x = x || 0;
        var y = y || 0;
        var z = z || 0;
        var offset = offset || 0;

        const tree = new THREE.Object3D();

        const treeTrunkGeometry = new THREE.BoxBufferGeometry(5, 40, 5);
        const treeTrunk = utils.makeMesh('lambert', treeTrunkGeometry, 0x8a613a);
        treeTrunk.position.y = offset;
        tree.add(treeTrunk);

        const geometry = new THREE.SphereGeometry( 30, 5, 5 );
        const sphere = utils.makeMesh('lambert', geometry, 0x9c935d);
        sphere.position.y = 45 + offset;
        tree.add(sphere);

        const geometry2 = new THREE.SphereGeometry( 20, 5, 5 );
        const sphere2 = utils.makeMesh('lambert', geometry2, 0x9c935d);
        sphere2.position.y = 45 + offset;
        sphere2.position.x = 10;
        sphere2.position.z = 10;
        tree.add(sphere2);

        const geometry3 = new THREE.SphereGeometry( 20, 5, 5 );
        const sphere3 = utils.makeMesh('lambert', geometry3, 0x9c935d);
        sphere3.position.y = 45 + offset;
        sphere3.position.x = -20;
        sphere3.position.z = -5;
        tree.add(sphere3);

        const geometry4 = new THREE.SphereGeometry( 20, 5, 5 );
        const sphere4 = utils.makeMesh('lambert', geometry4, 0x9c935d);
        sphere4.position.y = 45 + offset;
        sphere4.position.x = 10;
        sphere4.position.z = 25;
        tree.add(sphere4);

        tree.position.set(x, y, z);

        return tree
    }
}

function buildLightSystem() {

    if (!config.isMobile) {
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.1);
        directionalLight.position.set(300, 1000, 500);
        directionalLight.target.position.set(0, 0, 0);
        directionalLight.castShadow = true;

        const d = 300;
        directionalLight.shadow.camera = new THREE.OrthographicCamera(-d, d, d, -d, 500, 1600);
        directionalLight.shadow.bias = 0.0001;
        directionalLight.shadow.mapSize.width = directionalLight.shadow.mapSize.height = 1024;
        scene.add(directionalLight);

        const light = new THREE.AmbientLight(0xffffff, 0.3);
        scene.add(light)
    } else {
        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 1);
        scene.add(hemisphereLight);

        const light = new THREE.AmbientLight(0xffffff, 0.15);
        scene.add(light);
    }

}

function buildAuxSystem() {
    const axisHelper = new THREE.AxesHelper(500);
    scene.add(axisHelper);

    const gridHelper = new THREE.GridHelper(620, 32);
    scene.add(gridHelper);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.rotateSpeed = 0.35;
}

// TODO: Make it like a general function, right now rules needs to be static
function carMoving(car) {
    const angle = car.mesh.rotation.y;
    const x = car.mesh.position.x,
        z = car.mesh.position.z;
    console.log(x, z);
    if (x < 310 && z === 285) {
        car.forward()
    } else if (angle < 0.5 * Math.PI) {
        car.turnLeft(0.5 * Math.PI, 0.1)
    } else if (x === 310 && z > -230) {
        car.forward()
    } else if (angle < Math.PI) {
        car.turnLeft(0.5 * Math.PI, 0.1)
    } else if (x > -330 && z === -230) {
        car.forward()
    } else if (angle < 1.5 * Math.PI) {
        car.turnLeft(0.5 * Math.PI, 0.1)
    } else if (x === -330 && z < 285) {
        car.mesh.rotation.y = 1.5 * Math.PI;
        car.forward()
    } else if (angle < 2 * Math.PI) {
        car.turnLeft(0.5 * Math.PI, 0.1)
    }
    else {
        car.setPosition(-330, 0, 285);
        car.mesh.rotation.set(0, 0, 0)
    }
}

function loop() {
    cars.forEach(function (car) {
        carMoving(car)
    });
    renderer.render(scene, camera);
    requestAnimationFrame(loop)
}

function onWindowResize() {
    window.addEventListener('resize', function () {
        width = window.innerWidth;
        height = window.innerHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    })
}