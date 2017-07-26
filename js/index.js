const colorTable = {
    background: 0xEED5D2,
    square: 0x898989,
    lightSquare: 0x999999,
    points: [
        0xFF6347, 0x32CD32, 0xFFD700, 0x00BFFF, 0x9932CC
    ],
    lightPoint: 0xFFFFFF
}

var map = {};
var pos = {};
var mapPlay = [];
var completion;
function initMap() {
    map.type = '2d';
    map.n = 5;
    map.points = [
        { x1: 0, y1: 3, x2: 1, y2: 0 },
        { x1: 0, y1: 4, x2: 2, y2: 0 },
        { x1: 2, y1: 2, x2: 3, y2: 1 },
        { x1: 2, y1: 4, x2: 3, y2: 3 },
        { x1: 3, y1: 0, x2: 3, y2: 4 }
    ];
}

var canvasdiv;
var width;
var height;

var renderer;
function initThree() {
    canvasdiv = document.getElementById('canvasdiv');
    var childList = canvasdiv.childNodes;
    for (var i = 0; i < childList.length; i++) {
        canvasdiv.removeChild(childList[i]);
    }
    width = canvasdiv.clientWidth;
    height = canvasdiv.clientHeight;
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(width, height);
    canvasdiv.appendChild(renderer.domElement);
    renderer.setClearColor(colorTable.background, 1.0);
}

var camera;
function initCamera() {
    switch (map.type) {
        case '2d':
            camera = new THREE.PerspectiveCamera(90, width / height, 1, 10000);
            camera.position.x = 0;
            camera.position.y = 0;
            camera.position.z = 400;
            camera.up.x = 0;
            camera.up.y = 1;
            camera.up.z = 0;
            camera.lookAt({
                x: 0,
                y: 0,
                z: 0
            });
            break;
        case '3d':
            camera = new THREE.PerspectiveCamera(90, width / height, 1, 10000);
            camera.position.x = 0;
            camera.position.y = 0;
            camera.position.z = 400;
            camera.up.x = 0;
            camera.up.y = 1;
            camera.up.z = 0;
            camera.lookAt({
                x: 0,
                y: 0,
                z: 0
            });
            break;
        default:
            break;
    }
}

var scene;
function initScene() {
    scene = new THREE.Scene();
}

var light;
function initLight() {
    //light = new THREE.AmbientLight(0xFFFFFF);
    light = new THREE.PointLight(0xFFFFFF);
    light.position.x = 300;
    light.position.y = 300;
    light.position.z = 500;
    scene.add(light);
}

var squares;
var gSquare;
var points;
var gPoint;
var gLine, gConnectPoint;
function initObject() {
    var size = ((width < height) ? width : height) * 1;
    pos.gripsize = size / map.n;
    pos.x = pos.y = (pos.gripsize - size) / 2;

    mapPlay = [];
    completion = 0;
    for (var i = 0; i < map.n; i++) {
        mapPlay.push([]);
        for (var j = 0; j < map.n; j++) {
            mapPlay[i].push({ index: -1 });
        }
    }

    squares = [];
    gSquare = new THREE.BoxGeometry(pos.gripsize, pos.gripsize, 1);
    for (var i = 0; i < map.n; i++) {
        squares.push([]);
        for (var j = 0; j < map.n; j++) {
            let material = new THREE.MeshLambertMaterial({ color: colorTable.square });
            let s = new THREE.Mesh(gSquare, material);
            s.position.x = pos.x + pos.gripsize * i;
            s.position.y = pos.y + pos.gripsize * j;
            s.position.z = 0;
            s.$x = i;
            s.$y = j;
            scene.add(s);
            squares[i].push(s);
        }
    }

    points = [];
    gPoint = new THREE.SphereGeometry(pos.gripsize * 0.2 * Math.sqrt(2), 32, 32);
    for (var i = 0; i < map.points.length; i++) {
        let material = new THREE.MeshLambertMaterial({ color: colorTable.points[i] });
        let s1 = new THREE.Mesh(gPoint, material);
        s1.position.x = pos.x + pos.gripsize * map.points[i].x1;
        s1.position.y = pos.y + pos.gripsize * map.points[i].y1;
        s1.position.z = -pos.gripsize * 0.2;
        scene.add(s1);
        let s2 = new THREE.Mesh(gPoint, material);
        s2.position.x = pos.x + pos.gripsize * map.points[i].x2;
        s2.position.y = pos.y + pos.gripsize * map.points[i].y2;
        s2.position.z = -pos.gripsize * 0.2;
        scene.add(s2);
        points.push([s1, s2]);

        mapPlay[map.points[i].x1][map.points[i].y1] = { index: i, rank: -1, origx: map.points[i].x1, origy: map.points[i].y1 };
        mapPlay[map.points[i].x2][map.points[i].y2] = { index: i, rank: -1, origx: map.points[i].x2, origy: map.points[i].y2 };
        completion += 2;
    }

    var rad = pos.gripsize * 0.17 * Math.sqrt(2);
    gLine = new THREE.CylinderGeometry(rad, rad, pos.gripsize, 32, 32);
    gConnectPoint = new THREE.SphereGeometry(rad, 32, 32);
}

function threeStart() {
    initMap();
    initThree();
    initCamera();
    initScene();
    initLight();
    initObject();
    renderer.clear();
    renderer.render(scene, camera);
}

// 以下为各种事件以及重绘函数
window.onresize = function () {
    initThree();
    initCamera();
    initScene();
    initLight();
    initObject();
    renderer.clear();
    renderer.render(scene, camera);
}

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var currentSquare;
var currentSphere;
var currentCoordinate;
var mouseState = false;
var lastCoordinate = undefined;
var startCoordinate = undefined;
function update() {
    currentSquare = currentSphere = currentCoordinate = undefined;
    var x, y;
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(scene.children);
    for (var i = 0; i < intersects.length; i++) {
        var o = intersects[i].object;
        if (o.geometry === gSquare && !currentSquare) {
            currentSquare = o;
            currentCoordinate = { x: o.$x, y: o.$y };
        }
        else if (o.geometry === gPoint && !currentSquare) {
            currentSphere = o;
        }
    }
}

window.onmousedown = function (event) {
    mouseState = true;
    startCoordinate = lastCoordinate = currentCoordinate ? { x: currentCoordinate.x, y: currentCoordinate.y } : undefined;
    if (currentCoordinate) {
        var g = mapPlay[currentCoordinate.x][currentCoordinate.y];
        if (g.index !== -1) {
            for (var i = 0; i < map.n; i++) {
                for (var j = 0; j < map.n; j++) {
                    if (mapPlay[i][j].index === g.index && mapPlay[i][j].rank > ((g.rank === -1) ? 0 : g.rank)) {
                        scene.remove(mapPlay[i][j].line);
                        scene.remove(mapPlay[i][j].connectPoint);
                        mapPlay[i][j].index = -1;
                        completion--;
                    }
                    else if (mapPlay[i][j].index === g.index && mapPlay[i][j].rank === -1) {
                        scene.remove(mapPlay[i][j].line);
                        mapPlay[i][j].rank = 0;
                    }
                }
            }
        }
    }
    render();
}

window.onmousemove = function (event) {
    mouse.x = (event.clientX / width) * 2 - 1;
    mouse.y = -(event.clientY / height) * 2 + 1;
    update();
    if (mouseState && lastCoordinate && currentCoordinate) {
        var ox = lastCoordinate.x, oy = lastCoordinate.y;
        var og = mapPlay[ox][oy]; // old grip
        var nx = currentCoordinate.x, ny = currentCoordinate.y;
        var ng = mapPlay[nx][ny]; // new grip
        var colorIndex = mapPlay[ox][oy].index;
        if (og.index !== -1
            && og.rank !== -1
            && ng.index === -1
            && ((ox === nx && (oy === ny + 1 || oy === ny - 1))
                || (oy === ny && (ox === nx + 1 || ox === nx - 1)))
        ) {
            lastCoordinate = { x: currentCoordinate.x, y: currentCoordinate.y }
            ng.index = og.index;
            ng.rank = og.rank + 1;
            ng.origx = og.origx;
            ng.origy = og.origy;
            let material = new THREE.MeshLambertMaterial({ color: colorTable.points[colorIndex] });
            let s1 = new THREE.Mesh(gLine, material);
            s1.position.x = pos.x + pos.gripsize * ((ox + nx) / 2);
            s1.position.y = pos.y + pos.gripsize * ((oy + ny) / 2);
            s1.position.z = -pos.gripsize * 0.2;
            s1.rotation.z = (ox === nx) ? 0 : (90 * Math.PI / 180);
            scene.add(s1);
            ng.line = s1;
            let s2 = new THREE.Mesh(gConnectPoint, material);
            s2.position.x = pos.x + pos.gripsize * nx;
            s2.position.y = pos.x + pos.gripsize * ny;
            s2.position.z = -pos.gripsize * 0.2;
            scene.add(s2);
            ng.connectPoint = s2;
            completion++;
        }
        else if (og.index !== -1
            && ng.index === og.index
            && ng.rank === 0
            && !(nx === og.origx && ny === og.origy)
            && ((ox === nx && (oy === ny + 1 || oy === ny - 1))
                || (oy === ny && (ox === nx + 1 || ox === nx - 1)))
        ) {
            lastCoordinate = { x: currentCoordinate.x, y: currentCoordinate.y }
            ng.index = og.index;
            ng.rank = -1;
            let material = new THREE.MeshLambertMaterial({ color: colorTable.points[colorIndex] });
            let s1 = new THREE.Mesh(gLine, material);
            s1.position.x = pos.x + pos.gripsize * ((ox + nx) / 2);
            s1.position.y = pos.y + pos.gripsize * ((oy + ny) / 2);
            s1.position.z = -pos.gripsize * 0.2;
            s1.rotation.z = (ox === nx) ? 0 : (90 * Math.PI / 180);
            scene.add(s1);
            ng.line = s1;
        }
    }
    render();
}

window.onmouseup = function (event) {
    mouseState = false;
}

function render() {
    for (var i = 0; i < map.n; i++) {
        for (var j = 0; j < map.n; j++) {
            squares[i][j].material.color.set(colorTable.square);
        }
    }
    for (var i = 0; i < points.length; i++) {
        // 一对点的 material 为同一个对象，只要设置其中一个就行
        points[i][0].material.color.set(colorTable.points[i]);
    }
    if (currentSquare) {
        currentSquare.material.color.set(colorTable.lightSquare);
    }
    if (currentSphere) {
        currentSphere.material.color.set(colorTable.lightPoint);
    }
    renderer.render(scene, camera);
}

//window.requestAnimationFrame(render);