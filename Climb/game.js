// (function () {
'use strict';
// import * as Mod from './Game-Lib/CommonModule.js';
var pause_panel = document.getElementById('pause');
var canvas = document.querySelector('canvas');
canvas.width = window.visualViewport.width;
canvas.height = window.visualViewport.height;
console.log(canvas.width, canvas.height);
var ctx = canvas.getContext("2d");
const pi = Math.PI, sin = Math.sin, cos = Math.cos, rand = Math.random,
    max_abs = (a, b) => { Math.max(Math.abs(a), Math.abs(b)) };

class Cell {
    constructor(pos = [0, 0], size = [10, 10], spd = [0, 0, 0, 0], color = '#000') {
        this.left = pos[0];
        this.top = pos[1];
        this.width = size[0];
        this.height = size[1];
        this.spd = spd;
        this.color = color;
        this.isskip = true;
        this.skip_num = 0;
    }
    pathStyle(lineWidth = 5, lineCap = 'butt') {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = lineCap; //末端样式
    }
    textStyle(size = 10, family = '微软雅黑', textAlign = 'center') {
        ctx.fillStyle = this.color;
        ctx.font = size + 'px ' + family;
        ctx.textAlign = textAlign;
    }
    rect() {
        ctx.fillRect(this.left, this.top, this.width, this.height);
    }
    arc(r, angle = [0, 2 * pi], anticlosewise) {
        var c0 = cos(angle[0]), c1 = cos(angle[1]), s0 = sin(angle[0]), s1 = sin(angle[1]);
        this.width = (c0 * c1 >= 0) ? r * max_abs(c0, c1) : r * abs(c0 - c1);
        this.height = (s0 * s1 >= 0) ? r * max_abs(s0, s1) : r * abs(s0 - s1);
        ctx.arc(this.left, this.top, r, angle[0], angle[1], anticlosewise);
        ctx.fill();
    }
    path(point_begin, point_end) {
        this.width = abs(point_begin[0] - point_end[0]) + ctx.lineWidth * 2;
        this.height = abs(point_begin[1] - point_end[1]) + ctx.lineWidth * 2;
        ctx.beginPath();
        ctx.moveTo(point_begin[0], point_begin[1]);
        ctx.lineTo(point_end[0], point_end[1]);
        ctx.stroke(); //描边
    }
    shape(points) {
        var max_l = 0, min_l = 0, max_t = 0, min_t = 0;
        ctx.beginPath();
        for (let i of points) {
            if (i[0] > max_l)
                max_l = i[0]; if (i[0] < min_l)
                min_l = i[0];
            if (i[1] > max_t)
                max_t = i[1]; if (i[1] < min_t)
                min_t = i[1];
            if (i.toString() === points[0].toString())
                ctx.moveTo(i[0], i[1]);
            else
                ctx.lineTo(i[0], i[1]);
        }
        this.width = max_l - min_l;
        this.height = max_t - min_t;
        ctx.closePath(); //闭合路径, ctx指向context
        ctx.fill(); //填充
    }
    text(str, maxWidth) {
        ctx.fillText(str, this.left, this.top, maxWidth);
    }
    img(img, scale) {
        this.width = img.width * scale;
        this.height = img.height * scale;
        img.onload = function () {
            ctx.drawImage(img, this.left, this.top, this.width, this.height);
        };
    }
    move() {
        this.left += this.spd[0];
        this.top += this.spd[1];
    }
}
{ //构建场景
    const size = [40, 40], space = [30, 30]; var offset = [10, 10];
    var exit = new Cell([Math.round(rand() * (canvas.width - 10)), 0], [10, 10], undefined, '#090');
    var angle = 1, cells = [], poss = [];
    Array.prototype.in = function (elm) { for (let i of this) if (i.toString() === elm.toString()) return true; }
    var construct_cell = function (pos) {
        let c = angle;
        for (let i = c; i < 2 * pi + c; i += 2 * pi / 4) {
            var x = Math.round(pos[0] + cos(i) * (size[0] + space[0])),
                y = Math.round(pos[1] + sin(i) * (size[1] + space[1]));
            if (!poss.in([x, y]) && between_matrix([x, y], [-size[0], -size[1], canvas.width, canvas.height])) {
                poss.push([x, y]); if (poss.length > 1000) throw 'cells exceed';
                let cell = new Cell([x, y], [size[0] * rand() + 10, size[1] * (rand() + 0.1)], undefined, '#0002');
                cell.pathStyle();
                cell.rect();
                cells.push(cell);
                construct_cell([x, y]);
            }
        }
    }
    construct_cell([canvas.width / 2 + offset[0], canvas.height / 2 + offset[1]]);
    /*var construct = function (pos) {
        pos;
        var x = Math.round(rand() * (canvas.width - size[0])),
            y = Math.round(rand() * (canvas.height - size[1]));
        if (poss.length < 50) {
            poss.push([x, y]); if (poss.length > 1000) throw 'cells exceed';
            let cell = new Cell([x, y], size, undefined, '#0003');
            cell.rect();
            cells.push(cell);
            construct([x, y]);
        }
    }//*/
}
{ //添加boss
    var bosses = [], boss_num = 20; const size = [10, 10];
    var construct_boss = function () {
        if (bosses.length < boss_num) {
            let ward;
            let boss = new Cell(rand() > 0.5 ?
                (ward = 1, rand() > 0.5 ?
                    [Math.round(rand() * (canvas.width - size[0])), 0] :
                    [size[0] * 2, Math.round(rand() * (canvas.height - size[1]))]) :
                (ward = -1, rand() > 0.5 ?
                    [Math.round(rand() * (canvas.width - size[0])), 0] :
                    [canvas.width - size[0] * 2, Math.round(rand() * (canvas.height - size[1]))])
                , undefined, undefined, '#fa0'
            );
            boss.ward = ward;
            bosses.push(boss);
        }
    }
}
{ //主程序
    var player = new Cell([canvas.width / 2 + 10, canvas.height - 50], [10, 10], undefined, '#f88');
    var dl = 0, dt = 0, dr = 0, dd = 0;
    let g = 0.1;
    let expend = 100;
    var draw = function () {
        // try {
        n++;
        if (n >= 5 * 60 * 60) boss_num = 999;
        ctx.clearRect(-expend, -expend, canvas.width + expend, canvas.height + expend);

        if (n % 300 == 0) angle += pi / 180 * 10;
        // poss = [], cells = [];
        // construct_cell([canvas.width / 2 + offset[0], canvas.height / 2 + offset[1]]);
        cells.forEach((cell) => { //cell碰撞检测
            cell.pathStyle();
            cell.rect();
            Obj_Crash(player, cell, [
                function () { player.spd[0] = 0; player.left = cell.left + cell.width; },
                function () { player.spd[1] = 0; player.top = cell.top + cell.height; player.isskip = false; },
                function () { player.spd[0] = 0; player.left = cell.left - player.width; },
                function () { player.spd[1] = 0; player.top = cell.top - player.height; player.isskip = true; }
            ]);
            Obj_Crash(exit, cell, [
                function () { exit.spd[0] = 0; exit.left = cell.left + cell.width; },
                function () { exit.spd[1] = 0; exit.top = cell.top + cell.height; exit.isskip = false; },
                function () { exit.spd[0] = 0; exit.left = cell.left - exit.width; },
                function () { exit.spd[1] = 0; exit.top = cell.top - exit.height; exit.isskip = true; }
            ]);
            bosses.forEach((boss) => {
                Obj_Crash(boss, cell, [
                    function () { boss.spd[0] = 0; boss.left = cell.left + cell.width; },
                    function () { boss.spd[1] = 0; boss.top = cell.top + cell.height; boss.isskip = false; },
                    function () { boss.spd[0] = 0; boss.left = cell.left - boss.width; },
                    function () { boss.spd[1] = 0; boss.top = cell.top - boss.height; boss.isskip = true; }
                ]);
            });
        })

        let boss_sur = [], boss_sur_str = [];
        construct_boss();
        bosses.forEach((boss) => { //boss碰撞检测
            boss.pathStyle();
            Obj_Crash(player, boss, [dead]);
            Obj_Crash(exit, boss, [
                function () { exit.spd[0] = 0; exit.left = boss.left + boss.width; },
                function () { exit.spd[1] = 0; exit.top = boss.top + boss.height; exit.isskip = false; },
                function () { exit.spd[0] = 0; exit.left = boss.left - exit.width; },
                function () { exit.spd[1] = 0; exit.top = boss.top - exit.height; exit.isskip = true; }
            ]);
            Move_Range(boss, [0, -100, canvas.width, canvas.height], undefined,
                function () {
                    boss.rect();
                    if (!boss_sur_str.in(JSON.stringify(boss))) {
                        boss_sur_str.push(JSON.stringify(boss));
                        boss_sur.push(boss);
                    }
                }
            );
            Move_Ctrl(boss, 1, [0, 1, boss.ward, 0], 'grivity');
            boss.spd[1] += g;
            boss.move();
        });
        bosses = boss_sur;

        exit.pathStyle();
        exit.rect(0);
        Obj_Crash(player, exit, [nice]);
        Move_Range(exit, [0, 0, canvas.width, canvas.height], [
            function () { exit.spd[0] = 0; exit.left = 0; },
            function () { exit.spd[1] = 0; exit.top = 0; exit.isskip = false; },
            function () { exit.spd[0] = 0; exit.left = canvas.width - exit.width; },
            function () { exit.spd[1] = 0; exit.top = canvas.height - exit.height; exit.isskip = true; }
        ]);
        Move_Ctrl(exit, 1, [0, 0, 0, 0], 'grivity');
        exit.spd[1] += g;
        exit.move();

        Move_Range(player, [0, 0, canvas.width, canvas.height], [ //边界碰撞
            function () { player.spd[0] = 0; player.left = 0; },
            function () { player.spd[1] = 0; player.top = 0; player.isskip = false; nice(); },
            function () { player.spd[0] = 0; player.left = canvas.width - player.width; },
            function () { player.spd[1] = 0; player.top = canvas.height - player.height; player.isskip = true; dead(); }
        ]);
        Move_Ctrl(player, 1, [dl, dt, dr, dd], 'grivity');
        player.spd[1] += g;
        player.move();
        player.pathStyle();
        player.rect();

        if (ispause) clearInterval(Stop);
        // } catch (error) { clearInterval(Stop); throw error; }
    }
    var n = 0, ispause = false;
    var Stop = setInterval(draw, 1000 / 60);
}
{ //键盘事件
    document.onkeydown = function (e) {
        // console.log(e)
        switch (e.keyCode) {
            case 37: dl = 1; break;
            case 39: dr = 1; break;
            case 38: dt = 1; break;
            case 40: dd = 1; break;
            // case 16: spd = 2; break; //shift
            // case 90: isfire = true; break; //z
            // case 88: isbomb = true; break; //x
            case 32: pause(); break; //space
            case 65: dl = 1; break; //a
            case 68: dr = 1; break; //d
            case 87: dt = 1; break; //w
            case 83: dd = 1; break; //s
            case 82: break; //r
        }
    }
    document.onkeyup = function (e) {
        switch (e.keyCode) {
            case 37: dl = 0; break;
            case 39: dr = 0; break;
            case 38: dt = 0; break;
            case 40: dd = 0; break;
            // case 16: spd = 4.5; break;
            // case 90: isfire = false; break;
            // case 88: isbomb = false; break;
            case 32:
                break;
            case 65: dl = 0; break;
            case 68: dr = 0; break;
            case 87: dt = 0; break;
            case 83: dd = 0; break;
            case 82: remake(); break;
        }
    }
}
//功能组
function remake() {
    if (ispause) {
        player.left = canvas.width / 2 + player.width;
        player.top = canvas.height / 2 - player.height;
        ispause = false;
        pause_panel.style.display = 'none';
        Stop = setInterval(draw, 1000 / 60);
    }
}
function pause() {
    ispause = !ispause;
    if (ispause) {
        pause_panel.style.display = 'flex';
    }
    else {
        pause_panel.style.display = 'none';
        Stop = setInterval(draw, 1000 / 60);
    }
}
function nice() { pause(); pause_panel.innerText = 'nice'; }
function dead() { pause(); pause_panel.innerText = 'dead'; pause = () => { }; remake = () => { }; }
// })();