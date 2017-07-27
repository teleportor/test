const colorTable = {
    background: 0xE0EEEE,
    background_1: 0xC1CDCD,
    square: 0x898989,
    lightSquare: 0x999999,
    points: [
        0xFF6347, 0x32CD32, 0xFFD700, 0x00BFFF, 0x9932CC
    ],
    lightPoint: 0xFFFFFF
}

var map = {};
var mapIndex;
var pos = {};
var mapPlay = [];
var completion1, completion2;
function initMap(index, is3d) {
    mapIndex = index || 0;
    is3d = is3d || false;
    if (is3d) {
        map = mapData_3d[mapIndex];
    }
    else {
        map = mapData[mapIndex];
    }
}

function mapToMap_3d(o) {
    var x = o.x, y = o.y, z = o.z;
    if (z === -1) {
        return mapPlay[0][x][y];
    }
    else if (z === map.n) {
        return mapPlay[1][x][y];
    }
    else if (y === -1) {
        return mapPlay[2][x][z];
    }
    else if (y === map.n) {
        return mapPlay[3][x][z];
    }
    else if (x === -1) {
        return mapPlay[4][y][z];
    }
    else if (x === map.n) {
        return mapPlay[5][y][z];
    }
    return null;
}

var canvasdiv;
var width;
var height;
var lastSize, size;

var renderer;
function initThree() {
    canvasdiv = document.getElementById('canvasdiv');
    var childList = canvasdiv.childNodes;
    for (var i = 0; i < childList.length; i++) {
        canvasdiv.removeChild(childList[i]);
    }
    width = canvasdiv.clientWidth;
    height = canvasdiv.clientHeight;
    lastSize = size;
    size = ((width < height) ? width : height) * 1;
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(width, height);
    canvasdiv.appendChild(renderer.domElement);
    renderer.setClearColor(colorTable.background, 1.0);
}

var camera;
var camRadius;
function initCamera() {
    switch (map.type) {
        case '2d':
            camera = new THREE.PerspectiveCamera(90, width / height, 1, 10000);
            camRadius = 360;
            camera.position.x = 0;
            camera.position.y = 0;
            camera.position.z = camRadius;
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
            camRadius = 540000 / size;
            camera.position.x = camRadius * Math.sqrt(1 / 3);
            camera.position.y = camRadius * Math.sqrt(1 / 3);
            camera.position.z = camRadius * Math.sqrt(1 / 3);
            camera.up.x = -Math.sqrt(1 / 6);
            camera.up.y = Math.sqrt(2 / 3);
            camera.up.z = -Math.sqrt(1 / 6);
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

var light1, light2, light3, light4;
function initLight() {
    switch (map.type) {
        case '2d':
            light1 = new THREE.PointLight(0xFFFFFF);
            light1.position.x = size * 0.5;
            light1.position.y = size * 0.5;
            light1.position.z = size * 0.8;
            scene.add(light1);
            break;
        case '3d':
            light1 = new THREE.PointLight(0xB9B9B9);
            light1.position.x = size * 1.6;
            light1.position.y = size * 1.6;
            light1.position.z = size * 1.6;
            scene.add(light1);
            light2 = new THREE.PointLight(0xB9B9B9);
            light2.position.x = size * -1.6;
            light2.position.y = size * -1.6;
            light2.position.z = size * 1.6;
            scene.add(light2);
            light3 = new THREE.PointLight(0xB9B9B9);
            light3.position.x = size * -1.6;
            light3.position.y = size * 1.6;
            light3.position.z = size * -1.6;
            scene.add(light3);
            light4 = new THREE.PointLight(0xB9B9B9);
            light4.position.x = size * 1.6;
            light4.position.y = size * -1.6;
            light4.position.z = size * -1.6;
            scene.add(light4);
            break;
        default:
            break;
    }
}

var squares;
var gSquare;
var edges, corners;
var gEdge, gCorner;
var points;
var gPoint;
var gLine, gConnectPoint;
var gLine_3d, gShortLine_3d, gConnectPoint_3d;
function initObject() {
    switch (map.type) {
        case '2d':

            pos.gripsize = size / map.n;
            pos.x = pos.y = (pos.gripsize - size) / 2;

            mapPlay = [];
            completion1 = completion2 = 0;
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

                mapPlay[map.points[i].x1][map.points[i].y1] = { index: i, rank: 0, origx: map.points[i].x1, origy: map.points[i].y1 };
                mapPlay[map.points[i].x2][map.points[i].y2] = { index: i, rank: 0, origx: map.points[i].x2, origy: map.points[i].y2 };
                completion2 += 2;
            }

            var rad = pos.gripsize * 0.17 * Math.sqrt(2);
            gLine = new THREE.CylinderGeometry(rad, rad, pos.gripsize, 32, 32);
            gConnectPoint = new THREE.SphereGeometry(rad, 32, 32);

            break;
        case '3d':

            pos.gripsize = size / map.n;
            pos.x = pos.y = pos.z = (pos.gripsize - size) / 2;

            mapPlay = [[], [], [], [], [], []];
            completion1 = completion2 = 0;
            for (var k = 0; k < 6; k++) {
                for (var i = 0; i < map.n; i++) {
                    mapPlay[k].push([]);
                    for (var j = 0; j < map.n; j++) {
                        mapPlay[k][i].push({ index: -1 });
                    }
                }
            }

            squares = [[], [], [], [], [], []];
            gSquare = new THREE.BoxGeometry(pos.gripsize, pos.gripsize, 1);
            for (var i = 0; i < map.n; i++) {
                squares[0].push([]);
                for (var j = 0; j < map.n; j++) {
                    let material = new THREE.MeshLambertMaterial({ color: colorTable.square });
                    let s = new THREE.Mesh(gSquare, material);
                    s.position.x = pos.x + pos.gripsize * i;
                    s.position.y = pos.y + pos.gripsize * j;
                    s.position.z = pos.z - pos.gripsize / 2;
                    s.$x = i;
                    s.$y = j;
                    s.$z = -1;
                    scene.add(s);
                    squares[0][i].push(s);
                }
                squares[1].push([]);
                for (var j = 0; j < map.n; j++) {
                    let material = new THREE.MeshLambertMaterial({ color: colorTable.square });
                    let s = new THREE.Mesh(gSquare, material);
                    s.position.x = pos.x + pos.gripsize * i;
                    s.position.y = pos.y + pos.gripsize * j;
                    s.position.z = pos.z + pos.gripsize * (map.n - 1 / 2);
                    s.$x = i;
                    s.$y = j;
                    s.$z = map.n;
                    scene.add(s);
                    squares[1][i].push(s);
                }
                squares[2].push([]);
                for (var j = 0; j < map.n; j++) {
                    let material = new THREE.MeshLambertMaterial({ color: colorTable.square });
                    let s = new THREE.Mesh(gSquare, material);
                    s.position.x = pos.x + pos.gripsize * i;
                    s.position.y = pos.y - pos.gripsize / 2;
                    s.position.z = pos.z + pos.gripsize * j;
                    s.rotation.x = 90 * Math.PI / 180;
                    s.$x = i;
                    s.$y = -1;
                    s.$z = j;
                    scene.add(s);
                    squares[2][i].push(s);
                }
                squares[3].push([]);
                for (var j = 0; j < map.n; j++) {
                    let material = new THREE.MeshLambertMaterial({ color: colorTable.square });
                    let s = new THREE.Mesh(gSquare, material);
                    s.position.x = pos.x + pos.gripsize * i;
                    s.position.y = pos.y + pos.gripsize * (map.n - 1 / 2);
                    s.position.z = pos.z + pos.gripsize * j;
                    s.rotation.x = 90 * Math.PI / 180;
                    s.$x = i;
                    s.$y = map.n;
                    s.$z = j;
                    scene.add(s);
                    squares[3][i].push(s);
                }
                squares[4].push([]);
                for (var j = 0; j < map.n; j++) {
                    let material = new THREE.MeshLambertMaterial({ color: colorTable.square });
                    let s = new THREE.Mesh(gSquare, material);
                    s.position.x = pos.x - pos.gripsize / 2;
                    s.position.y = pos.y + pos.gripsize * i;
                    s.position.z = pos.z + pos.gripsize * j;
                    s.rotation.y = 90 * Math.PI / 180;
                    s.$x = -1;
                    s.$y = i;
                    s.$z = j;
                    scene.add(s);
                    squares[4][i].push(s);
                }
                squares[5].push([]);
                for (var j = 0; j < map.n; j++) {
                    let material = new THREE.MeshLambertMaterial({ color: colorTable.square });
                    let s = new THREE.Mesh(gSquare, material);
                    s.position.x = pos.x + pos.gripsize * (map.n - 1 / 2);
                    s.position.y = pos.y + pos.gripsize * i;
                    s.position.z = pos.z + pos.gripsize * j;
                    s.rotation.y = 90 * Math.PI / 180;
                    s.$x = map.n;
                    s.$y = i;
                    s.$z = j;
                    scene.add(s);
                    squares[5][i].push(s);
                }
            }

            points = [];
            gPoint = new THREE.SphereGeometry(pos.gripsize * 0.2 * Math.sqrt(2), 32, 32);
            for (var i = 0; i < map.points.length; i++) {
                let material = new THREE.MeshLambertMaterial({ color: colorTable.points[i] });
                let s1 = new THREE.Mesh(gPoint, material);
                let num1, a1, b1;
                if (map.points[i].z1 === -1) {
                    s1.position.x = pos.x + pos.gripsize * map.points[i].x1;
                    s1.position.y = pos.y + pos.gripsize * map.points[i].y1;
                    s1.position.z = pos.z - pos.gripsize / 2 + pos.gripsize * 0.2;
                    num1 = 0;
                    a1 = map.points[i].x1;
                    b1 = map.points[i].y1;
                }
                else if (map.points[i].z1 === map.n) {
                    s1.position.x = pos.x + pos.gripsize * map.points[i].x1;
                    s1.position.y = pos.y + pos.gripsize * map.points[i].y1;
                    s1.position.z = pos.z + pos.gripsize * (map.n - 1 / 2) - pos.gripsize * 0.2;
                    num1 = 1;
                    a1 = map.points[i].x1;
                    b1 = map.points[i].y1;
                }
                else if (map.points[i].y1 === -1) {
                    s1.position.x = pos.x + pos.gripsize * map.points[i].x1;
                    s1.position.y = pos.y - pos.gripsize / 2 + pos.gripsize * 0.2;
                    s1.position.z = pos.z + pos.gripsize * map.points[i].z1;
                    num1 = 2;
                    a1 = map.points[i].x1;
                    b1 = map.points[i].z1;
                }
                else if (map.points[i].y1 === map.n) {
                    s1.position.x = pos.x + pos.gripsize * map.points[i].x1;
                    s1.position.y = pos.y + pos.gripsize * (map.n - 1 / 2) - pos.gripsize * 0.2;
                    s1.position.z = pos.z + pos.gripsize * map.points[i].z1;
                    num1 = 3;
                    a1 = map.points[i].x1;
                    b1 = map.points[i].z1;
                }
                else if (map.points[i].x1 === -1) {
                    s1.position.x = pos.y - pos.gripsize / 2 + pos.gripsize * 0.2;
                    s1.position.y = pos.x + pos.gripsize * map.points[i].y1;
                    s1.position.z = pos.z + pos.gripsize * map.points[i].z1;
                    num1 = 4;
                    a1 = map.points[i].y1;
                    b1 = map.points[i].z1;
                }
                else if (map.points[i].x1 === map.n) {
                    s1.position.x = pos.x + pos.gripsize * (map.n - 1 / 2) - pos.gripsize * 0.2;
                    s1.position.y = pos.y + pos.gripsize * map.points[i].y1;
                    s1.position.z = pos.z + pos.gripsize * map.points[i].z1;
                    num1 = 5;
                    a1 = map.points[i].y1;
                    b1 = map.points[i].z1;
                }
                scene.add(s1);
                let s2 = new THREE.Mesh(gPoint, material);
                let num2, a2, b2;
                if (map.points[i].z2 === -1) {
                    s2.position.x = pos.x + pos.gripsize * map.points[i].x2;
                    s2.position.y = pos.y + pos.gripsize * map.points[i].y2;
                    s2.position.z = pos.z - pos.gripsize / 2 + pos.gripsize * 0.2;
                    num2 = 0;
                    a2 = map.points[i].x2;
                    b2 = map.points[i].y2;
                }
                else if (map.points[i].z2 === map.n) {
                    s2.position.x = pos.x + pos.gripsize * map.points[i].x2;
                    s2.position.y = pos.y + pos.gripsize * map.points[i].y2;
                    s2.position.z = pos.z + pos.gripsize * (map.n - 1 / 2) - pos.gripsize * 0.2;
                    num2 = 1;
                    a2 = map.points[i].x2;
                    b2 = map.points[i].y2;
                }
                else if (map.points[i].y2 === -1) {
                    s2.position.x = pos.x + pos.gripsize * map.points[i].x2;
                    s2.position.y = pos.y - pos.gripsize / 2 + pos.gripsize * 0.2;
                    s2.position.z = pos.z + pos.gripsize * map.points[i].z2;
                    num2 = 2;
                    a2 = map.points[i].x2;
                    b2 = map.points[i].z2;
                }
                else if (map.points[i].y2 === map.n) {
                    s2.position.x = pos.x + pos.gripsize * map.points[i].x2;
                    s2.position.y = pos.y + pos.gripsize * (map.n - 1 / 2) - pos.gripsize * 0.2;
                    s2.position.z = pos.z + pos.gripsize * map.points[i].z2;
                    num2 = 3;
                    a2 = map.points[i].x2;
                    b2 = map.points[i].z2;
                }
                else if (map.points[i].x2 === -1) {
                    s2.position.x = pos.y - pos.gripsize / 2 + pos.gripsize * 0.2;
                    s2.position.y = pos.x + pos.gripsize * map.points[i].y2;
                    s2.position.z = pos.z + pos.gripsize * map.points[i].z2;
                    num2 = 4;
                    a2 = map.points[i].y2;
                    b2 = map.points[i].z2;
                }
                else if (map.points[i].x2 === map.n) {
                    s2.position.x = pos.x + pos.gripsize * (map.n - 1 / 2) - pos.gripsize * 0.2;
                    s2.position.y = pos.y + pos.gripsize * map.points[i].y2;
                    s2.position.z = pos.z + pos.gripsize * map.points[i].z2;
                    num2 = 5;
                    a2 = map.points[i].y2;
                    b2 = map.points[i].z2;
                }
                scene.add(s2);
                points.push([s1, s2]);

                mapPlay[num1][a1][b1] = { index: i, rank: 0, origx: map.points[i].x1, origy: map.points[i].y1, origz: map.points[i].z1 };
                mapPlay[num2][a2][b2] = { index: i, rank: 0, origx: map.points[i].x2, origy: map.points[i].y2, origz: map.points[i].z2 };
                completion2 += 2;
            }

            var rad = pos.gripsize * 0.17 * Math.sqrt(2);
            gLine = new THREE.CylinderGeometry(rad, rad, pos.gripsize, 32, 32);
            gConnectPoint = new THREE.SphereGeometry(rad, 32, 32);
            var rad_3d = pos.gripsize * 0.08;
            gLine_3d = new THREE.CylinderGeometry(rad_3d, rad_3d, pos.gripsize, 32, 32);
            gShortLine_3d = new THREE.CylinderGeometry(rad_3d, rad_3d, pos.gripsize / 2, 32, 32);
            gConnectPoint_3d = new THREE.SphereGeometry(rad_3d, 32, 32);

            break;
        default:
            break;
    }
}

function threeStart(index, is3d) {
    initMap(index, is3d);
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
    var p = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
    var u = { x: camera.up.x, y: camera.up.y, z: camera.up.z };
    initCamera();
    camera.position.x = p.x;
    camera.position.y = p.y;
    camera.position.z = p.z;
    camera.position.multiplyScalar(lastSize / size);
    camera.up.x = u.x;
    camera.up.y = u.y;
    camera.up.z = u.z;
    camera.lookAt({
        x: 0,
        y: 0,
        z: 0
    });
    renderer.clear();
    renderer.render(scene, camera);
}

var raycaster = new THREE.Raycaster();
var lastMouse = new THREE.Vector2();
var mouse = new THREE.Vector2();
var currentSquare;
var currentSphere;
var currentCoordinate;
var mouseState = false;
var lastCoordinate = undefined;
function update() {
    currentSquare = currentSphere = currentCoordinate = undefined;
    var x, y;
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(scene.children);
    for (var i = 0; i < intersects.length; i++) {
        var o = intersects[i].object;
        if (o.geometry === gSquare && !currentSquare) {
            currentSquare = o;
            switch (map.type) {
                case '2d':
                    currentCoordinate = { x: o.$x, y: o.$y };
                    break;
                case '3d':
                    currentCoordinate = { x: o.$x, y: o.$y, z: o.$z };
                    break;
                default:
                    break;
            }
        }
        else if (o.geometry === gPoint && !currentSquare) {
            currentSphere = o;
        }
    }
}

window.onmousedown = function (event) {
    mouseState = true;
    switch (map.type) {
        case '2d':
            lastCoordinate = currentCoordinate ? { x: currentCoordinate.x, y: currentCoordinate.y } : undefined;
            if (currentCoordinate) {
                var g = mapPlay[currentCoordinate.x][currentCoordinate.y];
                if (g.index !== -1) {
                    for (var i = 0; i < map.n; i++) {
                        for (var j = 0; j < map.n; j++) {
                            if (mapPlay[i][j].index === g.index && mapPlay[i][j].rank > ((g.rank === -1) ? 0 : g.rank)) {
                                scene.remove(mapPlay[i][j].line);
                                scene.remove(mapPlay[i][j].connectPoint);
                                mapPlay[i][j].index = -1;
                                completion2--;
                            }
                            else if (mapPlay[i][j].index === g.index && mapPlay[i][j].rank === -1) {
                                scene.remove(mapPlay[i][j].line);
                                mapPlay[i][j].rank = 0;
                                completion1--;
                            }
                        }
                    }
                }
            }
            break;
        case '3d':
            lastCoordinate = currentCoordinate ? { x: currentCoordinate.x, y: currentCoordinate.y, z: currentCoordinate.z } : undefined;
            if (currentCoordinate) {
                var g = mapToMap_3d(currentCoordinate);
                if (g.index !== -1) {
                    for (var k = 0; k < 6; k++) {
                        for (var i = 0; i < map.n; i++) {
                            for (var j = 0; j < map.n; j++) {
                                if (mapPlay[k][i][j].index === g.index && mapPlay[k][i][j].rank > ((g.rank === -1) ? 0 : g.rank)) {
                                    scene.remove(mapPlay[k][i][j].line);
                                    if (mapPlay[k][i][j].line2) {
                                        scene.remove(mapPlay[k][i][j].line2);
                                        mapPlay[k][i][j].line2 = undefined;
                                        scene.remove(mapPlay[k][i][j].line3);
                                        mapPlay[k][i][j].line3 = undefined;
                                    }
                                    scene.remove(mapPlay[k][i][j].connectPoint);
                                    mapPlay[k][i][j].index = -1;
                                    completion2--;
                                }
                                else if (mapPlay[k][i][j].index === g.index && mapPlay[k][i][j].rank === -1) {
                                    scene.remove(mapPlay[k][i][j].line);
                                    if (mapPlay[k][i][j].line2) {
                                        scene.remove(mapPlay[k][i][j].line2);
                                        mapPlay[k][i][j].line2 = undefined;
                                        scene.remove(mapPlay[k][i][j].line3);
                                        mapPlay[k][i][j].line3 = undefined;
                                    }
                                    mapPlay[k][i][j].rank = 0;
                                    completion1--;
                                }
                            }
                        }
                    }
                }
            }
            break;
        default:
            break;
    }
    render();
}

window.onmousemove = function (event) {
    lastMouse.x = mouse.x;
    lastMouse.y = mouse.y;
    mouse.x = (event.clientX / width) * 2 - 1;
    mouse.y = -(event.clientY / height) * 2 + 1;
    update();
    switch (map.type) {
        case '2d':
            if (mouseState && lastCoordinate && currentCoordinate) {
                var ox = lastCoordinate.x, oy = lastCoordinate.y;
                var og = mapPlay[ox][oy]; // old grip
                var nx = currentCoordinate.x, ny = currentCoordinate.y;
                var ng = mapPlay[nx][ny]; // new grip
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
                    let material = new THREE.MeshLambertMaterial({ color: colorTable.points[og.index] });
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
                    completion2++;
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
                    let material = new THREE.MeshLambertMaterial({ color: colorTable.points[og.index] });
                    let s1 = new THREE.Mesh(gLine, material);
                    s1.position.x = pos.x + pos.gripsize * ((ox + nx) / 2);
                    s1.position.y = pos.y + pos.gripsize * ((oy + ny) / 2);
                    s1.position.z = -pos.gripsize * 0.2;
                    s1.rotation.z = (ox === nx) ? 0 : (90 * Math.PI / 180);
                    scene.add(s1);
                    ng.line = s1;
                    completion1++;
                }
            }
            break;
        case '3d':
            if (mouseState && (!lastCoordinate || mapToMap_3d(lastCoordinate).index === -1)) {
                var deltaX = -(mouse.x - lastMouse.x) * 2000 / size;
                var deltaY = (mouse.y - lastMouse.y) * 2000 / size;
                var matrix1 = new THREE.Matrix4();
                matrix1.makeRotationAxis(camera.up, deltaX);
                camera.position.applyMatrix4(matrix1);
                var matrix2 = new THREE.Matrix4();
                var axis = new THREE.Vector3();
                axis.crossVectors(camera.up, camera.position);
                axis.normalize();
                matrix2.makeRotationAxis(axis, deltaY);
                camera.up.applyMatrix4(matrix2);
                camera.position.applyMatrix4(matrix2);
                camera.up.normalize();
                camera.position.normalize();
                camera.position.multiplyScalar(camRadius);
                camera.lookAt({
                    x: 0,
                    y: 0,
                    z: 0
                });
            }
            else if (mouseState && lastCoordinate && currentCoordinate) {
                var ox = lastCoordinate.x, oy = lastCoordinate.y, oz = lastCoordinate.z;
                var og = mapToMap_3d(lastCoordinate); // old grip
                var nx = currentCoordinate.x, ny = currentCoordinate.y, nz = currentCoordinate.z;
                var ng = mapToMap_3d(currentCoordinate); // new grip
                var caseCode = -1;
                if (oz === -1 && nz === -1 && Math.abs(ox - nx) + Math.abs(oy - ny) === 1) {
                    caseCode = 0;
                }
                else if (oz === map.n && nz === map.n && Math.abs(ox - nx) + Math.abs(oy - ny) === 1) {
                    caseCode = 1;
                }
                else if (oy === -1 && ny === -1 && Math.abs(ox - nx) + Math.abs(oz - nz) === 1) {
                    caseCode = 2;
                }
                else if (oy === map.n && ny === map.n && Math.abs(ox - nx) + Math.abs(oz - nz) === 1) {
                    caseCode = 3;
                }
                else if (ox === -1 && nx === -1 && Math.abs(oy - ny) + Math.abs(oz - nz) === 1) {
                    caseCode = 4;
                }
                else if (ox === map.n && nx === map.n && Math.abs(oy - ny) + Math.abs(oz - nz) === 1) {
                    caseCode = 5;
                }
                else if (oz === nz && (ox + nx === -1 || ox + nx === 2 * map.n - 1) && (oy + ny === -1 || oy + ny === 2 * map.n - 1)) {
                    caseCode = 6;
                }
                else if (oy === ny && (ox + nx === -1 || ox + nx === 2 * map.n - 1) && (oz + nz === -1 || oz + nz === 2 * map.n - 1)) {
                    caseCode = 7;
                }
                else if (ox === nx && (oy + ny === -1 || oy + ny === 2 * map.n - 1) && (oy + ny === -1 || oy + ny === 2 * map.n - 1)) {
                    caseCode = 8;
                }
                if (og.index !== -1
                    && og.rank !== -1
                    && ng.index === -1
                    && caseCode !== -1
                ) {
                    lastCoordinate = { x: currentCoordinate.x, y: currentCoordinate.y, z: currentCoordinate.z }
                    ng.index = og.index;
                    ng.rank = og.rank + 1;
                    ng.origx = og.origx;
                    ng.origy = og.origy;
                    ng.origz = og.origz;
                    let material = new THREE.MeshLambertMaterial({ color: colorTable.points[og.index] });
                    let s1 = new THREE.Mesh(gLine_3d, material);
                    let s1_2 = new THREE.Mesh(gShortLine_3d, material);
                    let s1_3 = new THREE.Mesh(gShortLine_3d, material);
                    let s1_4 = new THREE.Mesh(gConnectPoint_3d, material);
                    switch (caseCode) {
                        case 0:
                            s1.position.x = pos.x + pos.gripsize * ((ox + nx) / 2);
                            s1.position.y = pos.y + pos.gripsize * ((oy + ny) / 2);
                            s1.position.z = pos.z - pos.gripsize / 2;
                            s1.rotation.z = (ox === nx) ? 0 : (90 * Math.PI / 180);
                            scene.add(s1);
                            ng.line = s1;
                            break;
                        case 1:
                            s1.position.x = pos.x + pos.gripsize * ((ox + nx) / 2);
                            s1.position.y = pos.y + pos.gripsize * ((oy + ny) / 2);
                            s1.position.z = pos.z + pos.gripsize * (map.n - 1 / 2);
                            s1.rotation.z = (ox === nx) ? 0 : (90 * Math.PI / 180);
                            scene.add(s1);
                            ng.line = s1;
                            break;
                        case 2:
                            s1.position.x = pos.x + pos.gripsize * ((ox + nx) / 2);
                            s1.position.y = pos.y - pos.gripsize / 2;
                            s1.position.z = pos.z + pos.gripsize * ((oz + nz) / 2);
                            s1.rotation.x = (oz === nz) ? 0 : (90 * Math.PI / 180);
                            s1.rotation.z = (ox === nx) ? 0 : (90 * Math.PI / 180);
                            scene.add(s1);
                            ng.line = s1;
                            break;
                        case 3:
                            s1.position.x = pos.x + pos.gripsize * ((ox + nx) / 2);
                            s1.position.y = pos.y + pos.gripsize * (map.n - 1 / 2);
                            s1.position.z = pos.z + pos.gripsize * ((oz + nz) / 2);
                            s1.rotation.x = (oz === nz) ? 0 : (90 * Math.PI / 180);
                            s1.rotation.z = (ox === nx) ? 0 : (90 * Math.PI / 180);
                            scene.add(s1);
                            ng.line = s1;
                            break;
                        case 4:
                            s1.position.x = pos.x - pos.gripsize / 2;
                            s1.position.y = pos.y + pos.gripsize * ((oy + ny) / 2);
                            s1.position.z = pos.z + pos.gripsize * ((oz + nz) / 2);
                            s1.rotation.x = (oz === nz) ? 0 : (90 * Math.PI / 180);
                            scene.add(s1);
                            ng.line = s1;
                            break;
                        case 5:
                            s1.position.x = pos.x + pos.gripsize * (map.n - 1 / 2);
                            s1.position.y = pos.y + pos.gripsize * ((oy + ny) / 2);
                            s1.position.z = pos.z + pos.gripsize * ((oz + nz) / 2);
                            s1.rotation.x = (oz === nz) ? 0 : (90 * Math.PI / 180);
                            scene.add(s1);
                            ng.line = s1;
                            break;
                        case 6:
                            s1_2.position.x = (ox + nx === -1) ? (pos.x - pos.gripsize / 4)
                                : (pos.x + pos.gripsize * (map.n - 3 / 4));
                            s1_2.position.y = (oy + ny === -1) ? (pos.y - pos.gripsize / 2)
                                : (pos.y + pos.gripsize * (map.n - 1 / 2));
                            s1_2.position.z = pos.z + pos.gripsize * nz;
                            s1_2.rotation.z = 90 * Math.PI / 180;
                            scene.add(s1_2);
                            ng.line = s1_2;
                            s1_3.position.x = (ox + nx === -1) ? (pos.x - pos.gripsize / 2)
                                : (pos.x + pos.gripsize * (map.n - 1 / 2));
                            s1_3.position.y = (oy + ny === -1) ? (pos.y - pos.gripsize / 4)
                                : (pos.y + pos.gripsize * (map.n - 3 / 4));
                            s1_3.position.z = s1_2.position.z;
                            scene.add(s1_3);
                            ng.line2 = s1_3;
                            s1_4.position.x = s1_3.position.x;
                            s1_4.position.y = s1_2.position.y;
                            s1_4.position.z = s1_2.position.z;
                            scene.add(s1_4);
                            ng.line3 = s1_4;
                            break;
                        case 7:
                            s1_2.position.x = (ox + nx === -1) ? (pos.x - pos.gripsize / 4)
                                : (pos.x + pos.gripsize * (map.n - 3 / 4));
                            s1_2.position.y = pos.y + pos.gripsize * ny;
                            s1_2.position.z = (oz + nz === -1) ? (pos.z - pos.gripsize / 2)
                                : (pos.z + pos.gripsize * (map.n - 1 / 2));
                            s1_2.rotation.z = 90 * Math.PI / 180;
                            scene.add(s1_2);
                            ng.line = s1_2;
                            s1_3.position.x = (ox + nx === -1) ? (pos.x - pos.gripsize / 2)
                                : (pos.x + pos.gripsize * (map.n - 1 / 2));
                            s1_3.position.y = s1_2.position.y;
                            s1_3.position.z = (oz + nz === -1) ? (pos.z - pos.gripsize / 4)
                                : (pos.z + pos.gripsize * (map.n - 3 / 4));
                            s1_3.rotation.x = 90 * Math.PI / 180;
                            scene.add(s1_3);
                            ng.line2 = s1_3;
                            s1_4.position.x = s1_3.position.x;
                            s1_4.position.y = s1_2.position.y;
                            s1_4.position.z = s1_2.position.z;
                            scene.add(s1_4);
                            ng.line3 = s1_4;
                            break;
                        case 8:
                            s1_2.position.x = pos.x + pos.gripsize * nx;
                            s1_2.position.y = (oy + ny === -1) ? (pos.y - pos.gripsize / 4)
                                : (pos.y + pos.gripsize * (map.n - 3 / 4));
                            s1_2.position.z = (oz + nz === -1) ? (pos.z - pos.gripsize / 2)
                                : (pos.z + pos.gripsize * (map.n - 1 / 2));
                            scene.add(s1_2);
                            ng.line = s1_2;
                            s1_3.position.x = s1_2.position.x;
                            s1_3.position.y = (oy + ny === -1) ? (pos.y - pos.gripsize / 2)
                                : (pos.y + pos.gripsize * (map.n - 1 / 2));
                            s1_3.position.z = (oz + nz === -1) ? (pos.z - pos.gripsize / 4)
                                : (pos.z + pos.gripsize * (map.n - 3 / 4));
                            s1_3.rotation.x = 90 * Math.PI / 180;
                            scene.add(s1_3);
                            ng.line2 = s1_3;
                            s1_4.position.x = s1_2.position.x;
                            s1_4.position.y = s1_3.position.y;
                            s1_4.position.z = s1_2.position.z;
                            scene.add(s1_4);
                            ng.line3 = s1_4;
                            break;
                        default:
                            break;
                    }
                    let s2 = new THREE.Mesh(gConnectPoint_3d, material);
                    if (nz === -1) {
                        s2.position.x = pos.x + pos.gripsize * nx;
                        s2.position.y = pos.y + pos.gripsize * ny;
                        s2.position.z = pos.z - pos.gripsize / 2;
                    }
                    else if (nz === map.n) {
                        s2.position.x = pos.x + pos.gripsize * nx;
                        s2.position.y = pos.y + pos.gripsize * ny;
                        s2.position.z = pos.z + pos.gripsize * (map.n - 1 / 2);
                    }
                    else if (ny === -1) {
                        s2.position.x = pos.x + pos.gripsize * nx;
                        s2.position.y = pos.y - pos.gripsize / 2;
                        s2.position.z = pos.z + pos.gripsize * nz;
                    }
                    else if (ny === map.n) {
                        s2.position.x = pos.x + pos.gripsize * nx;
                        s2.position.y = pos.y + pos.gripsize * (map.n - 1 / 2);
                        s2.position.z = pos.z + pos.gripsize * nz;
                    }
                    else if (nx === -1) {
                        s2.position.x = pos.x - pos.gripsize / 2;
                        s2.position.y = pos.y + pos.gripsize * ny;
                        s2.position.z = pos.z + pos.gripsize * nz;
                    }
                    else if (nx === map.n) {
                        s2.position.x = pos.x + pos.gripsize * (map.n - 1 / 2);
                        s2.position.y = pos.y + pos.gripsize * ny;
                        s2.position.z = pos.z + pos.gripsize * nz;
                    }
                    scene.add(s2);
                    ng.connectPoint = s2;
                    completion2++;
                }
                else if (og.index !== -1
                    && ng.index === og.index
                    && ng.rank === 0
                    && caseCode !== -1
                ) {
                    lastCoordinate = { x: currentCoordinate.x, y: currentCoordinate.y, z: currentCoordinate.z }
                    ng.index = og.index;
                    ng.rank = -1;
                    let material = new THREE.MeshLambertMaterial({ color: colorTable.points[og.index] });
                    let s1 = new THREE.Mesh(gLine_3d, material);
                    let s1_2 = new THREE.Mesh(gShortLine_3d, material);
                    let s1_3 = new THREE.Mesh(gShortLine_3d, material);
                    let s1_4 = new THREE.Mesh(gConnectPoint_3d, material);
                    switch (caseCode) {
                        case 0:
                            s1.position.x = pos.x + pos.gripsize * ((ox + nx) / 2);
                            s1.position.y = pos.y + pos.gripsize * ((oy + ny) / 2);
                            s1.position.z = pos.z - pos.gripsize / 2;
                            s1.rotation.z = (ox === nx) ? 0 : (90 * Math.PI / 180);
                            scene.add(s1);
                            ng.line = s1;
                            break;
                        case 1:
                            s1.position.x = pos.x + pos.gripsize * ((ox + nx) / 2);
                            s1.position.y = pos.y + pos.gripsize * ((oy + ny) / 2);
                            s1.position.z = pos.z + pos.gripsize * (map.n - 1 / 2);
                            s1.rotation.z = (ox === nx) ? 0 : (90 * Math.PI / 180);
                            scene.add(s1);
                            ng.line = s1;
                            break;
                        case 2:
                            s1.position.x = pos.x + pos.gripsize * ((ox + nx) / 2);
                            s1.position.y = pos.y - pos.gripsize / 2;
                            s1.position.z = pos.z + pos.gripsize * ((oz + nz) / 2);
                            s1.rotation.x = (oz === nz) ? 0 : (90 * Math.PI / 180);
                            s1.rotation.z = (ox === nx) ? 0 : (90 * Math.PI / 180);
                            scene.add(s1);
                            ng.line = s1;
                            break;
                        case 3:
                            s1.position.x = pos.x + pos.gripsize * ((ox + nx) / 2);
                            s1.position.y = pos.y + pos.gripsize * (map.n - 1 / 2);
                            s1.position.z = pos.z + pos.gripsize * ((oz + nz) / 2);
                            s1.rotation.x = (oz === nz) ? 0 : (90 * Math.PI / 180);
                            s1.rotation.z = (ox === nx) ? 0 : (90 * Math.PI / 180);
                            scene.add(s1);
                            ng.line = s1;
                            break;
                        case 4:
                            s1.position.x = pos.x - pos.gripsize / 2;
                            s1.position.y = pos.y + pos.gripsize * ((oy + ny) / 2);
                            s1.position.z = pos.z + pos.gripsize * ((oz + nz) / 2);
                            s1.rotation.x = (oz === nz) ? 0 : (90 * Math.PI / 180);
                            scene.add(s1);
                            ng.line = s1;
                            break;
                        case 5:
                            s1.position.x = pos.x + pos.gripsize * (map.n - 1 / 2);
                            s1.position.y = pos.y + pos.gripsize * ((oy + ny) / 2);
                            s1.position.z = pos.z + pos.gripsize * ((oz + nz) / 2);
                            s1.rotation.x = (oz === nz) ? 0 : (90 * Math.PI / 180);
                            scene.add(s1);
                            ng.line = s1;
                            break;
                        case 6:
                            s1_2.position.x = (ox + nx === -1) ? (pos.x - pos.gripsize / 4)
                                : (pos.x + pos.gripsize * (map.n - 3 / 4));
                            s1_2.position.y = (oy + ny === -1) ? (pos.y - pos.gripsize / 2)
                                : (pos.y + pos.gripsize * (map.n - 1 / 2));
                            s1_2.position.z = pos.z + pos.gripsize * nz;
                            s1_2.rotation.z = 90 * Math.PI / 180;
                            scene.add(s1_2);
                            ng.line = s1_2;
                            s1_3.position.x = (ox + nx === -1) ? (pos.x - pos.gripsize / 2)
                                : (pos.x + pos.gripsize * (map.n - 1 / 2));
                            s1_3.position.y = (oy + ny === -1) ? (pos.y - pos.gripsize / 4)
                                : (pos.y + pos.gripsize * (map.n - 3 / 4));
                            s1_3.position.z = s1_2.position.z;
                            scene.add(s1_3);
                            ng.line2 = s1_3;
                            s1_4.position.x = s1_3.position.x;
                            s1_4.position.y = s1_2.position.y;
                            s1_4.position.z = s1_2.position.z;
                            scene.add(s1_4);
                            ng.line3 = s1_4;
                            break;
                        case 7:
                            s1_2.position.x = (ox + nx === -1) ? (pos.x - pos.gripsize / 4)
                                : (pos.x + pos.gripsize * (map.n - 3 / 4));
                            s1_2.position.y = pos.y + pos.gripsize * ny;
                            s1_2.position.z = (oz + nz === -1) ? (pos.z - pos.gripsize / 2)
                                : (pos.z + pos.gripsize * (map.n - 1 / 2));
                            s1_2.rotation.z = 90 * Math.PI / 180;
                            scene.add(s1_2);
                            ng.line = s1_2;
                            s1_3.position.x = (ox + nx === -1) ? (pos.x - pos.gripsize / 2)
                                : (pos.x + pos.gripsize * (map.n - 1 / 2));
                            s1_3.position.y = s1_2.position.y;
                            s1_3.position.z = (oz + nz === -1) ? (pos.z - pos.gripsize / 4)
                                : (pos.z + pos.gripsize * (map.n - 3 / 4));
                            s1_3.rotation.x = 90 * Math.PI / 180;
                            scene.add(s1_3);
                            ng.line2 = s1_3;
                            s1_4.position.x = s1_3.position.x;
                            s1_4.position.y = s1_2.position.y;
                            s1_4.position.z = s1_2.position.z;
                            scene.add(s1_4);
                            ng.line3 = s1_4;
                            break;
                        case 8:
                            s1_2.position.x = pos.x + pos.gripsize * nx;
                            s1_2.position.y = (oy + ny === -1) ? (pos.y - pos.gripsize / 4)
                                : (pos.y + pos.gripsize * (map.n - 3 / 4));
                            s1_2.position.z = (oz + nz === -1) ? (pos.z - pos.gripsize / 2)
                                : (pos.z + pos.gripsize * (map.n - 1 / 2));
                            scene.add(s1_2);
                            ng.line = s1_2;
                            s1_3.position.x = s1_2.position.x;
                            s1_3.position.y = (oy + ny === -1) ? (pos.y - pos.gripsize / 2)
                                : (pos.y + pos.gripsize * (map.n - 1 / 2));
                            s1_3.position.z = (oz + nz === -1) ? (pos.z - pos.gripsize / 4)
                                : (pos.z + pos.gripsize * (map.n - 3 / 4));
                            s1_3.rotation.x = 90 * Math.PI / 180;
                            scene.add(s1_3);
                            ng.line2 = s1_3;
                            s1_4.position.x = s1_2.position.x;
                            s1_4.position.y = s1_3.position.y;
                            s1_4.position.z = s1_2.position.z;
                            scene.add(s1_4);
                            ng.line3 = s1_4;
                            break;
                        default:
                            break;
                    }
                    completion1++;
                }
            }
            break;
        default:
            break;
    }
    render();
}

window.onmouseup = function (event) {
    mouseState = false;
}

function render() {
    renderer.setClearColor((completion1 === map.points.length && completion2 === map.n * map.n * ((map.type === '2d') ? 1 : 6))
        ? colorTable.background_1 : colorTable.background, 1.0);
    switch (map.type) {
        case '2d':
            for (var i = 0; i < map.n; i++) {
                for (var j = 0; j < map.n; j++) {
                    squares[i][j].material.color.set(colorTable.square);
                }
            }
            break;
        case '3d':
            for (var k = 0; k < 6; k++) {
                for (var i = 0; i < map.n; i++) {
                    for (var j = 0; j < map.n; j++) {
                        squares[k][i][j].material.color.set(colorTable.square);
                    }
                }
            }
            break;
        default:
            break;
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

window.onkeydown = function (event) {
    switch (event.key) {
        case "ArrowRight":
            if (map.type === '2d' && mapIndex < mapData.length - 1) {
                threeStart(mapIndex + 1);
            }
            else if (map.type === '3d' && mapIndex < mapData_3d.length - 1) {
                threeStart(mapIndex + 1, true);
            }
            break;
        case "ArrowLeft":
            if (map.type === '2d' && mapIndex > 0) {
                threeStart(mapIndex - 1);
            }
            else if (map.type === '3d' && mapIndex > 0) {
                threeStart(mapIndex - 1, true);
            }
            break;
        case "ArrowUp":
        case "ArrowDown":
            if (map.type === '2d') {
                threeStart(0, true);
            }
            else if (map.type === '3d') {
                threeStart(0);
            }
            break;
        default:
            break;
    }
}