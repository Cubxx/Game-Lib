function Bullet(pos_initial, v_initial, type, move_type) {
    this.lives = 1;
    this.element = document.createElement('div');
    this.super_elm;
    this.type = type;
    this.move_type = move_type;
    this.pos_initial = pos_initial;
    this.v_initial = v_initial;

    var situation_num = 0,
        move_num = 0,
        dx = this.v_initial[0],
        dy = this.v_initial[1];
    var ax, ay, v_int, phase, angle_i;

    this.move = function (situation) { //situation obj_list
        var elm_ol = this.element.offsetLeft,
            elm_ot = this.element.offsetTop;

        //运动方式
        switch (this.move_type) {
            case 'track': //live_res专用
                for (obj of [player]) {
                    var angle = degree(obj.element, this.element),
                        dis = distance(obj.element, this.element);
                    if (dis < 50) {
                        dx = 5 * Math.cos(angle);
                        dy = 5 * Math.sin(angle);
                    }
                } break;
            case 'attract': //player专用
                for (obj of boss_list) {
                    var angle = degree(obj.element, this.element),
                        dis = distance(obj.element, this.element),
                        a = 30000 / (dis ** 2); //合加速度
                    if (dis < 150) {
                        dx = 10 * Math.cos(angle);
                        dy = 10 * Math.sin(angle);
                    } else {
                        dx += a * Math.cos(angle);
                        dy += a * Math.sin(angle);
                    }
                } break;
            case 'rand_accelerate':
                var v = 5, s = 800,
                    a = v * v / 2 / s;
                if (move_num == 0) {
                    ax = Math.random() < 0.5 ? a : -a;
                    ay = Math.random() < 0.5 < 0 ? a : -a;
                    move_num = 1;
                }
                dx -= ax * 1.2;
                dy -= ay / 2;
                break;
            case 'shake':
                move_num += 1;
                dx += Math.sin(move_num) * 1 - 0.01;
                dy += Math.cos(move_num) * 5 + 0.02;
                break;
            case 'circle':
                angle_i = degree(player.element, this.super_elm, [0, 0]);
                v_int = Math.sqrt(this.v_initial[1] ** 2 + this.v_initial[0] ** 2);
                phase = Math.atan2(this.v_initial[1], this.v_initial[0]);

                var r = 70;
                move_num -= v_int / r;
                dx = v_int * Math.cos(move_num + phase) + Math.cos(angle_i);
                dy = v_int * Math.sin(move_num + phase) + Math.sin(angle_i);
                break;
            default: break;
        }

        //环境类型
        switch (situation) {
            case 'transfer':
                if (elm_ot <= 0 || elm_ot - body_ct >= body_ch) { this.element.style.top = elm_ot <= 0 ? '530px' : '0px'; situation_num++ }
                if (elm_ol <= 0 || elm_ol - body_cl >= body_cw) { this.element.style.left = elm_ol <= 0 ? '530px' : '0px'; situation_num++ }
                if (situation_num > 1) { this.lives = 0 }
                break;
            case 'reflect':
                if (elm_ot <= 0 || elm_ot - body_ct >= body_ch) { this.element.style.top = elm_ot <= 0 ? '0px' : '530px'; dy = -dy; situation_num++ }
                if (elm_ol <= 0 || elm_ol - body_cl >= body_cw) { this.element.style.left = elm_ol <= 0 ? '0px' : '530px'; dx = -dx; situation_num++ }
                if (situation_num > 1) { this.lives = 0 }
                break;
            case 'gravity':
                dy += 0.01;
                if (elm_ot - body_ct >= body_ch) { this.element.style.top = '530px'; dy = -dy; dy -= 0.5; }
                if (elm_ot <= 0) { this.lives = 0 }
                if (elm_ol <= 0 || elm_ol - body_cl >= body_cw) { this.element.style.left = elm_ol <= 0 ? '0px' : '530px'; dx = -dx }
                break;
            default:
                if (elm_ot <= 0 || elm_ot - body_ct >= body_ch || elm_ol <= 0 || elm_ol - body_cl >= body_cw) { this.lives = 0; };
                break;
        }
        //移动
        this.element.style.left = parseFloat(this.element.style.left) + dx + 'px';
        this.element.style.top = parseFloat(this.element.style.top) + dy + 'px';
    }
    this.draw = function () {
        this.element.style.left = pos_initial[0] - 10 / 2 + 'px';
        this.element.style.top = pos_initial[1] - 10 / 2 + 'px';
        switch (this.type) {
            case 'bullet_player':
                this.element.className = 'bullet_player';
                player_bullets_elm.appendChild(this.element);
                break;
            case 'bullet_boss':
                this.element.className = 'bullet_boss';
                boss_bullets_elm.appendChild(this.element);
                break;
            case 'live_res':
                this.element.className = 'live_res';
                live_res_elm.appendChild(this.element);
                break;
            default: console.log('bullet绘制错误'); break;
        }
    }
}
var boss_bullets_elm = document.createElement('div');
boss_bullets_elm.id = 'bullet_boss_elm';
document.body.insertBefore(boss_bullets_elm, document.querySelector('script'));

var player_bullets_elm = document.createElement('div');
player_bullets_elm.id = 'bullet_player_elm';
document.body.insertBefore(player_bullets_elm, document.querySelector('script'));

var live_res_elm = document.createElement('div');
live_res_elm.id = 'live_res_elm';
document.body.insertBefore(live_res_elm, document.querySelector('script'));