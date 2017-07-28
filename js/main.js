"use strict"
var l;
var state = 0;
var time = 0;
var t;
var score2d = new Array(8);
var score3d = new Array(8);
var str;
for(var i = 0;i < 8;i++){
    score2d[i] = 0;
    score3d[i] = 0;
}
str = document.cookie;
if(str.length > 16){
    str = str.substring(str.length - 16, str.length);
}
if(str.length === 16)
{
    var j = 0;
    for(var i = 0;i <8;i++){
        score2d[i] = parseInt(str[j]);
        j++;
        score3d[i] = parseInt(str[j]);
        j++;
    }
    //console.log(score2d);
}
var level = 1;
var Help = 0;
if(document.body.clientWidth > document.body.clientHeight)
    l = document.body.clientHeight;
else
    l = document.body.clientWidth;
var Follow = function () {
    var $ = function (i) {return document.getElementById(i)},
        addEvent = function (o, e, f) {o.addEventListener ? o.addEventListener(e, f, false) : o.attachEvent('on'+e, function(){f.call(o)})},
        OBJ = [], sp, rs, N = 0, m;
    var init = function (id, config) {
        this.config = config || {};
        this.obj = $(id);
        sp = this.config.speed || 4;
        rs = this.config.animR || 1;
        m = {x: $(id).offsetWidth * .5, y: $(id).offsetHeight * .5};
        this.setXY();
        this.start();
    };
    init.prototype = {
        setXY : function () {
            var _this = this;
            addEvent(this.obj, 'mousemove', function (e) {
                e = e || window.event;
                m.x = e.clientX;
                m.y = e.clientY;
            })
        },
        start : function () {
            var k = 180 / Math.PI, OO, o, _this = this, fn = this.config.fn;
            OBJ[N++] = OO = new CObj(null, 0, 0);
            for(var i=0;i<360;i+=20){
                var O = OO;

                for(var j=10; j<20; j+=1){
                    var x = fn(i, j).x,
                        y = fn(i, j).y;
                    OBJ[N++] = o = new CObj(O , x, y);
                    O = o;
                }
            }
            setInterval(function() {
                for (var i = 0; i < N; i++) OBJ[i].run();
            }, 16);
        }
    };
    var CObj = function (p, cx, cy) {
        var obj = document.createElement("span");
        this.css = obj.style;
        this.css.position = "absolute";
        this.css.left = "-1000px";
        this.css.zIndex = 1000 - N;
        document.getElementById("canvasdiv").appendChild(obj);
        this.ddx = 0;
        this.ddy = 0;
        this.PX = 0;
        this.PY = 0;
        this.x = 0;
        this.y = 0;
        this.x0 = 0;
        this.y0 = 0;
        this.cx = cx;
        this.cy = cy;
        this.parent = p;
    };
    CObj.prototype.run = function () {
        if (!this.parent) {
            this.x0 = m.x;
            this.y0 = m.y;
        } else {
            this.x0 = this.parent.x;
            this.y0 = this.parent.y;
        }
        this.x = this.PX += (this.ddx += ((this.x0 - this.PX - this.ddx) + this.cx) / rs) / sp;
        this.y = this.PY += (this.ddy += ((this.y0 - this.PY - this.ddy) + this.cy) / rs) / sp;
        this.css.left = Math.round(this.x) + 'px';
        this.css.top = Math.round(this.y) + 'px';
    };
    return init;
}();
new Follow('canvasdiv', {
    speed: 4,
    animR : 1,
    fn : function (i, j) {
        return {
            x : j/4*Math.cos(i),
            y : j/4*Math.sin(i)
        }
    }
});
function start() {
    var can = document.getElementById('canvas');
    var ctx = can.getContext('2d');

    if(document.body.clientWidth > document.body.clientHeight)
        l = document.body.clientHeight;
    else
        l = document.body.clientWidth;

    can.width = document.body.clientWidth;
    can.height = document.body.clientHeight;
    ctx.translate(can.width / 3, can.height/5);
    if(state !== 3 && state !== 4){
        var help = new Image();
        help.src = "img/help.png";
        help.onload = function () {
            ctx.drawImage(help, can.width/5*3,can.height/3*2,l/10, l/10);
        };
    }

    if(Help === 1){
        ctx.font = l / 15 + "px Juice ITC";
        ctx.fillStyle = 'white';
        ctx.fillText("Back",-can.width / 3, -can.height/20*3);

        ctx.fillText("点击鼠标拖动连线，直至将所有点对连接", 0, 0);
        ctx.fillText("并占满所有格子即取得胜利。", 0, can.height/10);
        ctx.fillText("三星条件：", 0, can.height/5);
        ctx.fillText("2D：20秒内通关。", 0, can.height/10*3);
        ctx.fillText("3D：30秒内通关。", 0, can.height/10*4);
    }
    else {
        if (state === 0) {
            ctx.font = l / 8 + "px Snap ITC";
            ctx.fillStyle = 'white';
            ctx.textBaseline = "hanging";
            ctx.fillText("Join The Dots", 0, 0);
            ctx.font = l / 12 + "px Juice ITC";
            ctx.fillText("Start 2D", can.width / 15, can.height / 5);
            ctx.fillText("Start 3D", can.width / 15, can.height / 3);
        }

        if (state === 1) {
            ctx.font = l / 10 + "px serif";
            ctx.strokeStyle = 'white';
            ctx.fillStyle = 'white';
            ctx.textBaseline = "hanging"

            ctx.fillText("Level Choose", l / 20, 0);
            ctx.translate(-can.width / 3, -can.height / 5);
            /*ctx.beginPath();
            ctx.lineWidth = l/150;
            ctx.moveTo(can.width/30, 0);
            ctx.lineTo(0,can.height/40);
            ctx.lineTo(can.width/30, can.height/20);
            ctx.moveTo(can.width/60, can.height/70);
            ctx.lineTo(can.width/15, can.height/70);
            ctx.moveTo(can.width/60, can.height/26);
            ctx.lineTo(can.width/15, can.height/26);
            ctx.stroke();*/
            ctx.font = l / 15 + "px Juice ITC";
            ctx.fillText("Back", 0, 0);
            var img = new Image();
            var s1 = new Image();
            s1.src = "img/score" + score2d[0] + ".png";
            s1.onload = function () {
                ctx.drawImage(s1, -can.width / 150, can.height / 24 * 7, l / 20 * 3, l / 20);
            };
            var s2 = new Image();
            s2.src = "img/score" + score2d[1] + ".png";
            s2.onload = function () {
                ctx.drawImage(s2, -can.width / 150 + l / 5, can.height / 24 * 7, l / 20 * 3, l / 20);
            };
            var s3 = new Image();
            s3.src = "img/score" + score2d[2] + ".png";
            s3.onload = function () {
                ctx.drawImage(s3, -can.width / 150 + l / 5 * 2, can.height / 24 * 7, l / 20 * 3, l / 20);
            };
            var s4 = new Image();
            s4.src = "img/score" + score2d[3] + ".png";
            s4.onload = function () {
                ctx.drawImage(s4, -can.width / 150 + l / 5 * 3, can.height / 24 * 7, l / 20 * 3, l / 20);
            };
            var s5 = new Image();
            s5.src = "img/score" + score2d[4] + ".png";
            s5.onload = function () {
                ctx.drawImage(s5, -can.width / 150, can.height / 24 * 7 + can.height / 5, l / 20 * 3, l / 20);
            };
            var s6 = new Image();
            s6.src = "img/score" + score2d[5] + ".png";
            s6.onload = function () {
                ctx.drawImage(s6, -can.width / 150 + l / 5, can.height / 24 * 7 + can.height / 5, l / 20 * 3, l / 20);
            };
            var s7 = new Image();
            s7.src = "img/score" + score2d[6] + ".png";
            s7.onload = function () {
                ctx.drawImage(s7, -can.width / 150 + l / 5 * 2, can.height / 24 * 7 + can.height / 5, l / 20 * 3, l / 20);
            };
            var s8 = new Image();
            s8.src = "img/score" + score2d[7] + ".png";
            s8.onload = function () {
                ctx.drawImage(s8, -can.width / 150 + l / 5 * 3, can.height / 24 * 7 + can.height / 5, l / 20 * 3, l / 20);
            };

            ctx.font = l / 15 + "px serif";
            ctx.strokeStyle = 'rgb(250, 250, 250)';
            img.src = "img/level.png";
            ctx.lineWidth = l / 150;
            img.onload = function () {
                for (var i = 0; i < 4; i++) {
                    ctx.drawImage(img, l / 5 * i, can.height / 5, l / 10, l / 10);
                    ctx.strokeText(i + 1, l / 30 + l / 5 * i, l / 70 + can.height / 5);
                }
                for (var i = 0; i < 4; i++) {
                    ctx.drawImage(img, l / 5 * i, can.height / 5 * 2, l / 10, l / 10);
                    ctx.strokeText(i + 5, l / 30 + l / 5 * i, l / 50 + can.height / 5 * 2);
                }
                //ctx.drawImage(img, 0, can.height/5, l/10,l/10);
                //ctx.drawImage(img, l/5, can.height/5, l/10,l/10);
            };
            ctx.translate(can.width / 3, can.height / 5);
        }
        if (state === 2) {
            ctx.font = l / 10 + "px serif";
            ctx.strokeStyle = 'white';
            ctx.textBaseline = "hanging"
            ctx.fillStyle = 'white';
            ctx.fillText("Level Choose", l / 20, 0);
            ctx.lineWidth = l / 150;
            ctx.translate(-can.width / 3, -can.height / 5);
            /*ctx.beginPath();

            ctx.moveTo(can.width/30, 0);
            ctx.lineTo(0,can.height/40);
            ctx.lineTo(can.width/30, can.height/20);
            ctx.moveTo(can.width/60, can.height/70);
            ctx.lineTo(can.width/15, can.height/70);
            ctx.moveTo(can.width/60, can.height/26);
            ctx.lineTo(can.width/15, can.height/26);
            ctx.stroke();*/
            ctx.font = l / 15 + "px Juice ITC";
            ctx.fillText("Back", 0, 0);
            var s1 = new Image();
            s1.src = "img/score" + score3d[0] + ".png";
            s1.onload = function () {
                ctx.drawImage(s1, -can.width / 150, can.height / 24 * 7, l / 20 * 3, l / 20);
            };
            var s2 = new Image();
            s2.src = "img/score" + score3d[1] + ".png";
            s2.onload = function () {
                ctx.drawImage(s2, -can.width / 150 + l / 5, can.height / 24 * 7, l / 20 * 3, l / 20);
            };
            var s3 = new Image();
            s3.src = "img/score" + score3d[2] + ".png";
            s3.onload = function () {
                ctx.drawImage(s3, -can.width / 150 + l / 5 * 2, can.height / 24 * 7, l / 20 * 3, l / 20);
            };
            var s4 = new Image();
            s4.src = "img/score" + score3d[3] + ".png";
            s4.onload = function () {
                ctx.drawImage(s4, -can.width / 150 + l / 5 * 3, can.height / 24 * 7, l / 20 * 3, l / 20);
            };
            var s5 = new Image();
            s5.src = "img/score" + score3d[4] + ".png";
            s5.onload = function () {
                ctx.drawImage(s5, -can.width / 150, can.height / 24 * 7 + can.height / 5, l / 20 * 3, l / 20);
            };
            var s6 = new Image();
            s6.src = "img/score" + score3d[5] + ".png";
            s6.onload = function () {
                ctx.drawImage(s6, -can.width / 150 + l / 5, can.height / 24 * 7 + can.height / 5, l / 20 * 3, l / 20);
            };
            var s7 = new Image();
            s7.src = "img/score" + score3d[6] + ".png";
            s7.onload = function () {
                ctx.drawImage(s7, -can.width / 150 + l / 5 * 2, can.height / 24 * 7 + can.height / 5, l / 20 * 3, l / 20);
            };
            var s8 = new Image();
            s8.src = "img/score" + score3d[7] + ".png";
            s8.onload = function () {
                ctx.drawImage(s8, -can.width / 150 + l / 5 * 3, can.height / 24 * 7 + can.height / 5, l / 20 * 3, l / 20);
            };
            var img = new Image();
            ctx.font = l / 15 + "px serif";
            ctx.strokeStyle = 'rgb(250, 250, 250)';
            img.src = "img/level.png";
            img.onload = function () {
                for (var i = 0; i < 4; i++) {
                    ctx.drawImage(img, l / 5 * i, can.height / 5, l / 10, l / 10);
                    ctx.strokeText(i + 1, l / 30 + l / 5 * i, l / 50 + can.height / 5);
                }
                for (var i = 0; i < 4; i++) {
                    ctx.drawImage(img, l / 5 * i, can.height / 5 * 2, l / 10, l / 10);
                    ctx.strokeText(i + 5, l / 30 + l / 5 * i, l / 50 + can.height / 5 * 2);
                }
                //ctx.drawImage(img, 0, can.height/5, l/10,l/10);
                //ctx.drawImage(img, l/5, can.height/5, l/10,l/10);
            };
            ctx.translate(can.width / 3, can.height / 5);
        }
        if (state === 3) {
            ctx.fillStyle = 'white';
            ctx.font = l / 10 + "px Juice ITC";
            t = setInterval(function () {
                time++;
                ctx.clearRect(-can.width / 4, -can.height / 5, l, l);

                ctx.fillText("Level:" + level, -can.width / 4, -can.height / 20);
                ctx.fillText("Time:" + time, -can.width / 4, can.height / 20);
                ctx.fillText("Pairs:" + completion1 + "/" + map.points.length, -can.width / 4, can.height / 20 * 3);
                ctx.fillText("Lattices:" + completion2 + "/" + map.n * map.n, -can.width / 4, can.height / 20 * 5);
                if (completion1 === map.points.length && completion2 === map.n * map.n) {
                    state = 5;
                    clearInterval(t);
                    start();
                }
            }, 1000);
            ctx.fillText("Exit", can.width / 2, -can.height / 20);
        }
        if (state === 4) {
            ctx.fillStyle = 'white';
            ctx.font = l / 10 + "px Juice ITC";
            t = setInterval(function () {

                time++;
                ctx.clearRect(-can.width / 4, -can.height / 5, l, l);

                ctx.fillText("Level:" + level, -can.width / 4, -can.height / 20);
                ctx.fillText("Time:" + time, -can.width / 4, can.height / 20);
                ctx.fillText("Pairs:" + completion1 + "/" + map.points.length, -can.width / 4, can.height / 20 * 3);
                ctx.fillText("Lattices:" + completion2 + "/" + map.n * map.n * 6, -can.width / 4, can.height / 20 * 5);
                if (completion1 === map.points.length && completion2 === map.n * map.n * 6) {
                    state = 6;
                    clearInterval(t);
                    start();
                }
            }, 1000);
            ctx.fillText("Exit", can.width / 2, -can.height / 20);
        }
        ;
        if (state === 5) {
            canvasdiv = document.getElementById('canvasdiv');
            var len = canvasdiv.childNodes.length;
            for (var i = 0; i < len; i++) {
                if (canvasdiv.childNodes[i].tagName === "CANVAS") {
                    canvasdiv.removeChild(canvasdiv.childNodes[i]);
                }
            }
            if (time < 20)
                score2d[level - 1] = 3;
            else if (time < 30)
                score2d[level - 1] = 2;
            else
                score2d[level - 1] = 1;
            ctx.font = l / 5 + "px Tekton Pro";
            ctx.fillStyle = 'white';
            ctx.textBaseline = "hanging";
            ctx.fillText("Victory!", can.width / 15, 0);
            ctx.font = l / 10 + "px Juice ITC";
            ctx.fillText("Time:" + time, can.width / 8, can.height / 5);
            ctx.fillText("Next", can.width / 20, can.height / 5 * 3);
            ctx.fillText("Home", can.width / 20 * 3, can.height / 5 * 3);
            ctx.fillText("Replay", can.width / 4, can.height / 5 * 3);
            var im = new Image();
            im.src = "img/score" + score2d[level - 1] + ".png";
            im.onload = function () {
                ctx.drawImage(im, l / 5, can.height / 3, l / 2, l / 5);
            };
            str = "";
            for(var i = 0; i < 8;i++)
            {
                str+=score2d[i];
                str+=score3d[i];
            }
            document.cookie = str;
        }
        if (state === 6) {
            canvasdiv = document.getElementById('canvasdiv');
            var len = canvasdiv.childNodes.length;
            for (var i = 0; i < len; i++) {
                if (canvasdiv.childNodes[i].tagName === "CANVAS") {
                    canvasdiv.removeChild(canvasdiv.childNodes[i]);
                }
            }
            if (time < 30)
                score3d[level - 1] = 3;
            else if (time < 40)
                score3d[level - 1] = 2;
            else
                score3d[level - 1] = 1;
            ctx.font = l / 5 + "px Tekton Pro";
            ctx.fillStyle = 'white';
            ctx.textBaseline = "hanging";
            ctx.fillText("Victory!", can.width / 15, 0);
            ctx.font = l / 10 + "px Juice ITC";
            ctx.fillText("Time:" + time, can.width / 8, can.height / 5);
            ctx.fillText("Next", can.width / 20, can.height / 5 * 3);
            ctx.fillText("Home", can.width / 20 * 3, can.height / 5 * 3);
            ctx.fillText("Replay", can.width / 4, can.height / 5 * 3);
            var im = new Image();
            im.src = "img/score" + score3d[level - 1] + ".png";
            im.onload = function () {
                ctx.drawImage(im, l / 5, can.height / 3, l / 2, l / 5);
            };
            str = "";
            for(var i = 0; i < 8;i++)
            {
                str+=score2d[i];
                str+=score3d[i];
            }
            document.cookie = str;
        }
    }
    
}

/*
document.getElementById('canvasdiv').onmousedown =  function(){
    var x = event.pageX - canvas.getBoundingClientRect().left;
    var y = event.pageY - canvas.getBoundingClientRect().top;
    if(state === 0){
       // console.log(x,y);
        //console.log(document.body.clientWidth, document.body.clientHeight);
        if(x > document.body.clientWidth * 0.4 && x <  document.body.clientWidth * 0.47 && y > document.body.clientHeight * 0.38 && y < document.body.clientHeight * 0.45){

            state = 1;
            start();
        }
        if(x > document.body.clientWidth * 0.4 && x <  document.body.clientWidth * 0.47 && y > document.body.clientHeight * 0.52 && y < document.body.clientHeight * 0.58){
            state = 2;
            start();
        }
        return;
    }
    if(state === 1 || state === 2){
        if(x < document.body.clientWidth/15 && y < document.body.clientHeight/25){
            state = 0;
            start();
        }
        x -= document.body.clientWidth/3;
        y -= document.body.clientHeight/3;
        //console.log(x, y, l);
        if(x > 0 && y > 0 && x < l*7/10 && y < document.body.clientHeight*0.4){
            var d = Math.ceil(x*10/l);

            if(d % 2 === 1){
                level = Math.ceil(d/2);
                if(y > document.body.clientHeight*0.25){
                    level+=4;
                }
                state += 2;
                if(state === 3)
                    threeStart(level-1, false);
                if(state === 4)
                    threeStart(level-1, true);
                start();
            }
        }
    }
};
window.onresize=function(){
    clearInterval(t);
    start();
};
*/
start();





const colorTable = {
    background: 0xE0EEEE,
    background_1: 0xC1CDCD,
    square: 0x898989,
    lightSquare: 0x999999,
    points: [
        0xFF6347, 0x32CD32, 0xFFD700, 0x00BFFF, 0x9932CC, 0xFFA500, 0x0000CD
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
    var len = canvasdiv.childNodes.length;
    for (var i = 0; i < len; i++) {
        if (canvasdiv.childNodes[i].tagName === "CANVAS") {
            canvasdiv.removeChild(canvasdiv.childNodes[i]);
        }
    }
    width = canvasdiv.clientWidth;
    height = canvasdiv.clientHeight;
    lastSize = size;
    size = ((width < height) ? width : height) * 1;
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setSize(width, height);
    canvasdiv.appendChild(renderer.domElement);
}

var camera;
var camRadius;
function initCamera() {
    switch (map.type) {
        case '2d':
            camera = new THREE.PerspectiveCamera(90, width / height, 1, 10000);
            camRadius = 500;
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
            camRadius = 1000;
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
                    var material = new THREE.MeshLambertMaterial({ color: colorTable.square });
                    var s = new THREE.Mesh(gSquare, material);
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
                var material = new THREE.MeshLambertMaterial({ color: colorTable.points[i] });
                var s1 = new THREE.Mesh(gPoint, material);
                s1.position.x = pos.x + pos.gripsize * map.points[i].x1;
                s1.position.y = pos.y + pos.gripsize * map.points[i].y1;
                s1.position.z = -pos.gripsize * 0.2;
                scene.add(s1);
                var s2 = new THREE.Mesh(gPoint, material);
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
                    var material = new THREE.MeshLambertMaterial({ color: colorTable.square });
                    var s = new THREE.Mesh(gSquare, material);
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
                    var material = new THREE.MeshLambertMaterial({ color: colorTable.square });
                    var s = new THREE.Mesh(gSquare, material);
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
                    var material = new THREE.MeshLambertMaterial({ color: colorTable.square });
                    var s = new THREE.Mesh(gSquare, material);
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
                    var material = new THREE.MeshLambertMaterial({ color: colorTable.square });
                    var s = new THREE.Mesh(gSquare, material);
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
                    var material = new THREE.MeshLambertMaterial({ color: colorTable.square });
                    var s = new THREE.Mesh(gSquare, material);
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
                    var material = new THREE.MeshLambertMaterial({ color: colorTable.square });
                    var s = new THREE.Mesh(gSquare, material);
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
                var material = new THREE.MeshLambertMaterial({ color: colorTable.points[i] });
                var s1 = new THREE.Mesh(gPoint, material);
                var num1, a1, b1;
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
                var s2 = new THREE.Mesh(gPoint, material);
                var num2, a2, b2;
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
    clearInterval(t);
    start();
    if (state !== 3 && state !== 4) {
        return;
    }
    initThree();
    var p = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
    var u = { x: camera.up.x, y: camera.up.y, z: camera.up.z };
    initCamera();
    camera.position.x = p.x;
    camera.position.y = p.y;
    camera.position.z = p.z;
    camera.up.x = u.x;
    camera.up.y = u.y;
    camera.up.z = u.z;
    camera.lookAt({
        x: 0,
        y: 0,
        z: 0
    });
    render();
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

document.getElementById('canvasdiv').onmousedown = function (event) {
    var x = event.pageX - canvas.getBoundingClientRect().left;
    var y = event.pageY - canvas.getBoundingClientRect().top;
    //console.log(x,y);
    //console.log(document.body.clientWidth, document.body.clientHeight);
    if (state !== 3 && state !== 4)
        if (x > document.body.clientWidth * 0.93 && y > document.body.clientHeight * 0.86) {
            //console.log("help");
            Help = 1;
            start();
        }
    if (Help === 1) {
        if (x < document.body.clientWidth / 15 && y < document.body.clientHeight / 25) {
            Help = 0;
            start();
        }
        return;
    }
    if (state === 0) {
        // console.log(x,y);
        //console.log(document.body.clientWidth, document.body.clientHeight);
        if (x > document.body.clientWidth * 0.4 && x < document.body.clientWidth * 0.47 && y > document.body.clientHeight * 0.38 && y < document.body.clientHeight * 0.45) {

            state = 1;
            start();
        }
        if (x > document.body.clientWidth * 0.4 && x < document.body.clientWidth * 0.47 && y > document.body.clientHeight * 0.52 && y < document.body.clientHeight * 0.58) {
            state = 2;
            start();
        }
        return;
    }
    if (state === 1 || state === 2) {
        if (x < document.body.clientWidth / 15 && y < document.body.clientHeight / 25) {
            state = 0;
            start();
        }
        x -= document.body.clientWidth / 3;
        y -= document.body.clientHeight / 3;
        //console.log(x, y, l);
        if (x > 0 && y > 0 && x < l * 7 / 10 && y < document.body.clientHeight * 0.4) {
            var d = Math.ceil(x * 10 / l);

            if (d % 2 === 1) {
                level = Math.ceil(d / 2);
                if (y > document.body.clientHeight * 0.25) {
                    level += 4;
                }
                state += 2;
                if (state === 3)
                    threeStart(level - 1, false);
                if (state === 4)
                    threeStart(level - 1, true);
                start();
            }
        }
    }
    if (state === 3) {
        //console.log(x, y);
        //console.log(document.body.clientWidth, document.body.clientHeight);
        if (x > document.body.clientWidth * 0.83 && x < document.body.clientWidth * 0.875 && y > document.body.clientHeight * 0.07 && y < document.body.clientHeight * 0.15) {
            state = 1;
            clearInterval(t);
            time = 0;
            canvasdiv = document.getElementById('canvasdiv');
            var len = canvasdiv.childNodes.length;
            for (var i = 0; i < len; i++) {
                if (canvasdiv.childNodes[i].tagName === "CANVAS") {
                    canvasdiv.removeChild(canvasdiv.childNodes[i]);
                }
            }
            start();
        }
    }
    if (state === 4) {
        //console.log(x, y);
        //console.log(document.body.clientWidth, document.body.clientHeight);
        if (x > document.body.clientWidth * 0.83 && x < document.body.clientWidth * 0.875 && y > document.body.clientHeight * 0.07 && y < document.body.clientHeight * 0.15) {
            state = 2;
            clearInterval(t);
            time = 0;
            canvasdiv = document.getElementById('canvasdiv');
            var len = canvasdiv.childNodes.length;
            for (var i = 0; i < len; i++) {
                if (canvasdiv.childNodes[i].tagName === "CANVAS") {
                    canvasdiv.removeChild(canvasdiv.childNodes[i]);
                }
            }
            start();
        }
    }
    if (state === 5) {
        //
        if (y > document.body.clientHeight * 0.79 && y < document.body.clientHeight * 0.865) {
            if (x > document.body.clientWidth * 0.38 && x < document.body.clientWidth * 0.43) {
                level++;
                state = 3;
                time = 0;
                threeStart(level - 1, false);
                
            }
            if (x > document.body.clientWidth * 0.48 && x < document.body.clientWidth * 0.53) {
                state = 1;
                time = 0;
            }
            if (x > document.body.clientWidth * 0.58 && x < document.body.clientWidth * 0.65) {
                state = 3;
                time = 0;
                threeStart(level - 1, false);
            }
            start();
        }
    }
    if (state === 6) {
        //console.log(x, y);
        //console.log(document.body.clientWidth, document.body.clientHeight);
        if (y > document.body.clientHeight * 0.79 && y < document.body.clientHeight * 0.865) {
            if (x > document.body.clientWidth * 0.38 && x < document.body.clientWidth * 0.43) {
                level++;
                state = 4;
                time = 0;
                threeStart(level - 1, true);
            }
            if (x > document.body.clientWidth * 0.48 && x < document.body.clientWidth * 0.53) {
                state = 2;
                time = 0;
            }
            if (x > document.body.clientWidth * 0.58 && x < document.body.clientWidth * 0.65) {
                state = 4;
                time = 0;
                threeStart(level - 1, true);
            }
            start();
        }
    }
    if (state !== 3 && state !== 4) {
        return;
    }
    mouseState = true;
    switch (map.type) {
        case '2d':
            lastCoordinate = currentCoordinate ? {x: currentCoordinate.x, y: currentCoordinate.y} : undefined;
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
            lastCoordinate = currentCoordinate ? {
                x: currentCoordinate.x,
                y: currentCoordinate.y,
                z: currentCoordinate.z
            } : undefined;
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

    document.getElementById('canvasdiv').onmousemove = function (event) {
        if (state !== 3 && state !== 4) {
            return;
        }
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
                        lastCoordinate = {x: currentCoordinate.x, y: currentCoordinate.y}
                        ng.index = og.index;
                        ng.rank = og.rank + 1;
                        ng.origx = og.origx;
                        ng.origy = og.origy;
                        var material = new THREE.MeshLambertMaterial({color: colorTable.points[og.index]});
                        var s1 = new THREE.Mesh(gLine, material);
                        s1.position.x = pos.x + pos.gripsize * ((ox + nx) / 2);
                        s1.position.y = pos.y + pos.gripsize * ((oy + ny) / 2);
                        s1.position.z = -pos.gripsize * 0.2;
                        s1.rotation.z = (ox === nx) ? 0 : (90 * Math.PI / 180);
                        scene.add(s1);
                        ng.line = s1;
                        var s2 = new THREE.Mesh(gConnectPoint, material);
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
                        lastCoordinate = {x: currentCoordinate.x, y: currentCoordinate.y}
                        ng.index = og.index;
                        ng.rank = -1;
                        var material = new THREE.MeshLambertMaterial({color: colorTable.points[og.index]});
                        var s1 = new THREE.Mesh(gLine, material);
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
                        lastCoordinate = {x: currentCoordinate.x, y: currentCoordinate.y, z: currentCoordinate.z}
                        ng.index = og.index;
                        ng.rank = og.rank + 1;
                        ng.origx = og.origx;
                        ng.origy = og.origy;
                        ng.origz = og.origz;
                        var material = new THREE.MeshLambertMaterial({color: colorTable.points[og.index]});
                        var s1 = new THREE.Mesh(gLine_3d, material);
                        var s1_2 = new THREE.Mesh(gShortLine_3d, material);
                        var s1_3 = new THREE.Mesh(gShortLine_3d, material);
                        var s1_4 = new THREE.Mesh(gConnectPoint_3d, material);
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
                        var s2 = new THREE.Mesh(gConnectPoint_3d, material);
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
                        && !(nx === og.origx && ny === og.origy && nz === oz.origz)
                        && caseCode !== -1
                    ) {
                        lastCoordinate = {x: currentCoordinate.x, y: currentCoordinate.y, z: currentCoordinate.z}
                        ng.index = og.index;
                        ng.rank = -1;
                        var material = new THREE.MeshLambertMaterial({color: colorTable.points[og.index]});
                        var s1 = new THREE.Mesh(gLine_3d, material);
                        var s1_2 = new THREE.Mesh(gShortLine_3d, material);
                        var s1_3 = new THREE.Mesh(gShortLine_3d, material);
                        var s1_4 = new THREE.Mesh(gConnectPoint_3d, material);
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

    document.getElementById('canvasdiv').onmouseup = function (event) {
        mouseState = false;
    };

    function render() {
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

