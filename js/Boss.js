function Boss(pos_initial, v_initial, type, move_type, lives) {
    this.lives = lives;
    this.element = document.createElement('div');
    this.type = type;
    this.move_type = move_type;
    this.pos_initial = pos_initial;
    this.v_initial = v_initial;

    this.move = function () {
        var elm_ol = this.element.offsetLeft,
            elm_ot = this.element.offsetTop;
        var dx = this.v_initial[0],
            dy = this.v_initial[1];
        this.element.style.left = parseFloat(this.element.style.left) + dx + 'px';
        this.element.style.top = parseFloat(this.element.style.top) + dy + 'px';
        if (elm_ot + body_ct <= -80 || elm_ot - body_ct >= body_ch || elm_ol + body_cl <= 0 || elm_ol - body_cl >= body_cw) {
            this.lives = 0; //console.log(this.element.offsetTop, body_ct)
        }
    }

    this.fire = function () {
        bullet_boss_maker.generator(i, 120, 'locate', '', [0, 8], '', 1);
        for (b of boss_bullets) {
            if (b.super_elm == i.element) {
                bullet_boss_maker2.generator(b, 6, 'ring', 'circle', [0, Math.random() * 2 + 1], '', 6);
            }
        }
    }
    this.crash = function (i) { //遍历player_bullets
        if (distance(this.element, i.element) < 20 + 5) {
            this.lives--;
            player.score += 0.1;
            i.lives = 0;
            if (this.lives == 0) { //加分 掉资源
                player.score += 20;
                live_res_maker.generator(this, 999, '', 'track', [0, 1], [0, 15]);
                live_res_maker.generator(this, 999, '', 'track', [0, 1], [0, -15]);
                live_res_maker.generator(this, 999, '', 'track', [0, 1], [15, 0]);
                live_res_maker.generator(this, 999, '', 'track', [0, 1], [-15, 0]);
            }
        }
    }
    this.draw = function () {
        this.element.className = 'boss';
        this.element.style.left = pos_initial[0] + 'px';
        this.element.style.top = pos_initial[1] + 'px';
        boss_list_elm.appendChild(this.element);
    }
}
var boss_list_elm = document.createElement('div');
boss_list_elm.id = 'boss';
document.body.insertBefore(boss_list_elm, document.querySelector('script'));