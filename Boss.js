function Boss(pos, move_intspd) {
    this.lives = 20;
    this.element = document.createElement('div');
    this.move_intspd = move_intspd || [0, 1];
    var fire_int_time = 200;
    var ci = 0;

    this.move = function () {
        var elm_ol = this.element.offsetLeft,
            elm_ot = this.element.offsetTop;
        var dx = this.move_intspd[0],
            dy = this.move_intspd[1];
        this.element.style.left = parseFloat(this.element.style.left) + dx + 'px';
        this.element.style.top = parseFloat(this.element.style.top) + dy + 'px';
        if (elm_ot + body_ct <= -80 || elm_ot - body_ct >= body_ch || elm_ol + body_cl <= 0 || elm_ol - body_cl >= body_cw) {
            this.lives = 0; //console.log(this.element.offsetTop, body_ct)
        }
    }
    this.fire = function () {
        var elm_this = this.element,
            pos = [0, 0];
        function gun(fire_intspd) {
            var bullet = new Bullet(position(elm_this, pos), 'boss', fire_intspd);
            bullet.draw();
            boss_bullets.push(bullet);
        }
        fire_int_time = timer(fire_int_time, 6, function () { //每6帧射bullet
            ci += 0.1;
            var r = 2,
                c = ci ** 1;//+ Math.random() * Math.PI * 2; //相位
            for (var i = c; i < Math.PI * 2 + c; i += Math.PI * 2 / 4) { //圆形射
                gun([r * Math.cos(i + c), r * Math.sin(i + c)])
            }
        });

    }
    this.crash = function (i) { //遍历player_bullets，击破boss加分
        if (distance(this.element, i.element) < 20 + 5) {
            this.lives--;
            i.lives = 0;
            if (this.lives == 0) {
                player.score += 20;
                this.position = undefined;
            }
        }
    }
    this.draw = function () {
        this.element.className = 'boss';
        this.element.style.left = pos[0] + 'px';
        this.element.style.top = pos[1] + 'px';
        boss_list_elm.appendChild(this.element);
    }
}
var boss_list_elm = document.createElement('div');
boss_list_elm.id = 'boss_list_elm';
document.body.insertBefore(boss_list_elm, document.querySelector('script'));