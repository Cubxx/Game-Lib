function Bullet(pos, str, fire_intspd) {
    this.lives = 1;
    this.element = document.createElement('div');
    this.type = str;
    this.power = 1;
    this.fire_intspd = fire_intspd || [0, -10]; //player fire 初速度
    var reflect_num = 0;

    this.move_track = function () { //obj_list
        var elm_ol = this.element.offsetLeft,
            elm_ot = this.element.offsetTop;
        // console.log(arguments)
        if (arguments[0] != undefined) { //跟踪
            for (obj of arguments[0]) {
                var pos_obj = position(obj.element);
                var pos_this = position(this.element);
                var dis = distance(obj.element, this.element);
                var a = 10000 / (dis * dis); //合加速度
                this.fire_intspd[0] += a * (pos_obj[0] - pos_this[0]) / dis;
                this.fire_intspd[1] += a * (pos_obj[1] - pos_this[1]) / dis;
            }
        }
        else {
            this.fire_intspd[0] += 0;
            this.fire_intspd[1] += 0;
        }

        var dx = this.fire_intspd[0],
            dy = this.fire_intspd[1];
        this.element.style.left = parseFloat(this.element.style.left) + dx + 'px';
        this.element.style.top = parseFloat(this.element.style.top) + dy + 'px';
        if (elm_ot <= 0 || elm_ot - body_ct >= body_ch || elm_ol <= 0 || elm_ol - body_cl >= body_cw) {
            this.lives = 0; //console.log(this.element.offsetTop, body_ct)
        }
    }
    this.move_regular = function (pos, type) {
        var elm_ol = this.element.offsetLeft,
            elm_ot = this.element.offsetTop;
        switch (type) {
            case 'transfer':
                if (elm_ot <= 0 || elm_ot - body_ct >= body_ch) { this.element.style.top = elm_ot <= 0 ? '530px' : '0px' }
                if (elm_ol <= 0 || elm_ol - body_cl >= body_cw) { this.element.style.left = elm_ol <= 0 ? '530px' : '0px' }
                break;
            case 'reflect':
                if (elm_ot <= 0 || elm_ot - body_ct >= body_ch) { this.element.style.top = elm_ot <= 0 ? '0px' : '530px'; this.fire_intspd[1] = -this.fire_intspd[1]; reflect_num++ }
                if (elm_ol <= 0 || elm_ol - body_cl >= body_cw) { this.element.style.left = elm_ol <= 0 ? '0px' : '530px'; this.fire_intspd[0] = -this.fire_intspd[0]; reflect_num++ }
                if (reflect_num > 1) { this.lives = 0 }
                break;
            case 'gravity':
                this.fire_intspd[1] += 0.01;
                if (elm_ot - body_ct >= body_ch) { this.element.style.top = '530px'; this.fire_intspd[1] = -this.fire_intspd[1]; this.fire_intspd[1] -= 0.5; }
                if (elm_ot <= 0) { this.lives = 0 }
                if (elm_ol <= 0 || elm_ol - body_cl >= body_cw) { this.element.style.left = elm_ol <= 0 ? '0px' : '530px'; this.fire_intspd[0] = -this.fire_intspd[0] }
                break;
        }
        var dx = this.fire_intspd[0],
            dy = this.fire_intspd[1];
        this.element.style.left = parseFloat(this.element.style.left) + dx + 'px';
        this.element.style.top = parseFloat(this.element.style.top) + dy + 'px';
    }
    this.draw = function () {
        this.element.style.left = pos[0] - 10 / 2 + 'px';
        this.element.style.top = pos[1] - 10 / 2 + 'px';
        switch (this.type) {
            case 'player':
                this.element.className = 'player_bullets';
                player_bullets_elm.appendChild(this.element);
                break;
            case 'boss':
                this.element.className = 'boss_bullets';
                boss_bullets_elm.appendChild(this.element);
                break;
            default: console.log('bullet绘制错误'); break;
        }
    }
}
var player_bullets_elm = document.createElement('div');
player_bullets_elm.id = 'player_bullets_elm';
var boss_bullets_elm = document.createElement('div');
boss_bullets_elm.id = 'boss_bullets_elm';
document.body.insertBefore(player_bullets_elm, document.querySelector('script'));
document.body.insertBefore(boss_bullets_elm, document.querySelector('script'));