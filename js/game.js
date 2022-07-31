var position = function () { //obj.element []位移
    var obj_elm = arguments[0], pos = arguments[1] || [0, 0];
    return [parseInt(obj_elm.style.left) + obj_elm.offsetWidth / 2 + pos[0]
        , parseInt(obj_elm.style.top) + obj_elm.offsetHeight / 2 + pos[1]];
}
var distance = function (elm_1, elm_2) {
    var pos_1 = position(elm_1);
    var pos_2 = position(elm_2);
    var x = pos_1[0] - pos_2[0];
    var y = pos_1[1] - pos_2[1];
    return Math.sqrt(x * x + y * y)
}
var degree = function (elm_1, elm_2) {
    var p_1 = arguments[3] || [0, 0],
        p_2 = arguments[2] || [0, 0],
        pos_1 = position(elm_1, p_1),
        pos_2 = position(elm_2, p_2),
        x = pos_1[0] - pos_2[0],
        y = pos_1[1] - pos_2[1];
    return Math.atan2(y, x)
}
var update = function () { //list func有生命i func所有i
    var survive = [];
    for (i of arguments[0]) {
        if (arguments[2] != undefined) { arguments[2]() }
        if (i.lives > 0) {
            survive.push(i);
            arguments[1]();
        } else { i.element.remove() }
    }
    return survive;
}
var timer = function (int_time, time_lag, func) { //定时执行
    int_time++;
    if (int_time > time_lag) {
        int_time = 0;
        func();
    }
    return int_time;
}

var boss_list_elm = document.createElement('div');
boss_list_elm.id = 'boss';
document.body.insertBefore(boss_list_elm, document.querySelector('script'));

var boss_bullets_elm = document.createElement('div');
boss_bullets_elm.id = 'bullet_boss_elm';
document.body.insertBefore(boss_bullets_elm, document.querySelector('script'));

var player_bullets_elm = document.createElement('div');
player_bullets_elm.id = 'bullet_player_elm';
document.body.insertBefore(player_bullets_elm, document.querySelector('script'));

var live_res_elm = document.createElement('div');
live_res_elm.id = 'live_res_elm';
document.body.insertBefore(live_res_elm, document.querySelector('script'));

var Stop, stage,
    spd = 4.5,
    dl = 0,
    dr = 0,
    dt = 0,
    dd = 0,
    isfire = false,
    isbomb = false,
    ispause = true,
    exe_int_time = 0,
    player_bullets = [],
    boss_bullets = [],
    boss_list = [],
    live_res = [],
    body_cl = document.body.clientLeft,
    body_ct = document.body.clientTop,
    body_ch = document.body.clientHeight,
    body_cw = document.body.clientWidth,
    pause_elm = document.getElementById('pause'),
    panel_elm = document.getElementById('panel').children[0],
    invincible_time_elm = document.getElementById('panel').children[1],
    bomb_time_elm = document.getElementById('panel').children[2],
    img_bad = document.querySelectorAll('img')[0];
    img_happy = document.querySelectorAll('img')[1];

invincible_time_elm.style.top = 20 + 'px ';
bomb_time_elm.style.top = 40 + 'px ';

//音效加载
if (confirm('是否打开音效？')) {
    var audio_fx_u = new Audio();
    audio_fx_u.volume = 0.1;
    audio_fx_u.src = './media/u____.aac';
    var audio_fx_boom = new Audio();
    audio_fx_boom.volume = 0.1;
    audio_fx_boom.src = './media/boom.aac';
    var audio_fx_ayo = new Audio();
    audio_fx_ayo.volume = 0.1;
    audio_fx_ayo.src = './media/ayo.aac';
}
var audio_end_bad = new Audio();
audio_end_bad.volume = 0.1;
audio_end_bad.src = "./media/死了啦都你害得啦.aac";
var audio_end_happy = new Audio();
audio_end_happy.volume = 0.1;
audio_end_happy.src = "./media/Never Gonna Give You Up.aac";

//主程序
var player = new Player(255, 450),
    bullet_player_maker = new Maker('bullet_player'),
    bullet_boss_maker = new Maker('bullet_boss'),
    bullet_boss_maker2 = new Maker('bullet_boss'),
    boss_maker = new Maker('boss'),
    live_res_maker = new Maker('live_res');
player.draw();

var main = function () {
    //信息面版
    panel_elm.innerHTML =
        "得分：" + parseInt(player.score) +
        "<br>生命：" + parseInt(player.lives) +
        "<br>开大：" + player.bombs;
    invincible_time_elm.style.width = player.invincible_time / 180 * 530 + 'px ';
    if (player.invincible_time < 180) { player.invincible_time++ }
    //BAD END
    if (player.lives < 1) {
        ispause = !ispause;
        img_bad.style.display='block';
        audio_end_bad.play();
    }
    //游戏关卡
    if (player.score >= 1000 && boss_bullets.length == 0) {
        // HAPPY END
        pause_elm.innerHTML = 'Rick恭喜你通关'
        ispause = !ispause;
        img_happy.style.display='block';
        audio_end_happy.play();
    } else if (boss_list.length == 0) {
        if (player.score >= 960) { stage = new Stage(6); }
        else if (player.score >= 920) { stage = new Stage(5); }
        else if (player.score >= 880) { stage = new Stage(4); }
        else if (player.score >= 700) { stage = new Stage(3); }
        else if (player.score >= 400) { stage = new Stage(2); }
        else if (player.score >= 0) { stage = new Stage(1); }
    }
    //boss生成
    stage.boss_generate();
    //player方法
    player.move(spd * dr, spd * dl, spd * dd, spd * dt);
    player.fire(isfire);
    player.fire_bomb(isbomb);
    //player_bullets方法
    player_bullets = update(player_bullets, function () {
        i.move();
        var bullet = i;
        boss_list = update(boss_list, function () { }, function () {
            i.crash(bullet);
        });
    });
    //boss方法
    boss_list = update(boss_list, function () {
        // i.fire();
        stage.boss_fire(i);
        i.element.style.opacity = i.lives / stage.boss_lives;
        player.crash(i, 20 + 2);
    }, function () {
        i.move();
    });
    //boss_bullets方法
    boss_bullets = update(boss_bullets, function () {
        stage.bullet_move(i);
        player.crash(i, 5 + 2);
    });
    //live_res方法
    live_res = update(live_res, function () {
        i.move();
        player.crash(i, 5 + 2);
    })
    //暂停
    if (ispause) { clearInterval(Stop) }
    pause_elm.style.display = ispause ? 'block' : 'none';
}

document.onkeydown = function (e) {
    // console.log(e)
    switch (e.keyCode) {
        case 37: dl = 1; break;
        case 39: dr = 1; break;
        case 38: dt = 1; break;
        case 40: dd = 1; break;
        case 16: spd = 2; break; //shift
        case 90: isfire = true; break; //z
        case 88: isbomb = true; break; //x
        case 32: ispause = !ispause; break; //space
    }
}
document.onkeyup = function (e) {
    switch (e.keyCode) {
        case 37: dl = 0; break;
        case 39: dr = 0; break;
        case 38: dt = 0; break;
        case 40: dd = 0; break;
        case 16: spd = 4.5; break;
        case 90: isfire = false; break;
        case 88: isbomb = false; break;
        case 32: Stop = ispause ? Stop : setInterval('main()', 1000 / 60);
    }
}
var box = player.element;
box.onmousedown = function (e) { //拖拽事件
    var dx = box.offsetLeft - e.clientX - 10;
    var dy = box.offsetTop - e.clientY - 10;
    document.onmousemove = function (e) {
        box.style.left = dx + e.clientX + 'px';
        box.style.top = dy + e.clientY + 'px';
    }
    document.onmouseup = function () {
        document.onmousemove = null;
    }
}
document.oncontextmenu = function (e) { //右键定位
    box.style.left = e.layerX - box.offsetWidth + 'px';
    box.style.top = e.layerY - box.offsetHeight + 'px';
    //console.log(e)
    return false;
}