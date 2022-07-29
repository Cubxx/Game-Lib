function Player(x, y) {
    this.lives = 5;
    this.element = document.createElement('div');
    this.score = 0;
    this.bombs = 0;
    this.invincible_time = 0;
    var bomb_time = 180,
        bombs_reduce = 0;

    this.move = function (dr, dl, dd, dt) {
        var elm_ol = this.element.offsetLeft,
            elm_ot = this.element.offsetTop;
        if (elm_ot <= 10) { dt = 0 } //上
        else if (elm_ot >= body_ch - 10) { dd = 0 } //下
        if (elm_ol <= 10) { dl = 0 } //左
        else if (elm_ol >= body_cw - 10) { dr = 0 } //右
        this.element.style.left = parseFloat(this.element.style.left) + (dr - dl) + 'px';
        this.element.style.top = parseFloat(this.element.style.top) + (dd - dt) + 'px';
    }
    this.fire = function (isfire) {
        if (isfire && bomb_time >= 180) { //每16帧射bullet
            bullet_player_maker.generator(player, 16, '', 'attract', [1, -5], [14, 0]);
            bullet_player_maker.generator(player, 16, '', 'attract', [-1, -5], [-14, 0]);
            bullet_player_maker.generator(player, 16, '', '', [0, -10], [7, 0]);
            bullet_player_maker.generator(player, 16, '', '', [0, -10], [-7, 0]);
        }
    }
    this.fire_bomb = function (isbomb) {
        var bombs = this.bombs;
        var differ = Math.floor(this.score / 150) - bombs;  //每100分加bomb
        if (differ > bombs_reduce && bombs < 5) { bombs++ }

        if (bomb_time < 180) { //恢复bomb
            bomb_time++;
            bomb_time_elm.style.width = bomb_time / 180 * 530 + 'px ';
            bullet_player_maker.generator(player, 4, '', 'attract', [1, -5], [14, 0]);
            bullet_player_maker.generator(player, 4, '', 'attract', [-1, -5], [-14, 0]);
            bullet_player_maker.generator(player, 4, '', 'attract', [0, -10], [7, 0]);
            bullet_player_maker.generator(player, 4, '', 'attract', [0, -10], [-7, 0]);
            boss_bullets = update(boss_bullets, function () { }, function () {
                if (Math.random() > 0.9) { i.lives -= 0.5 }
            });
        } else if (isbomb && bombs > 0) { //用bomb
            bombs_reduce++;
            bomb_time = 0;
            this.invincible_time = 0;
            bombs--;
            if (audio_fx) {
                audio_fx.src = './media/u____.aac';
                audio_fx.play();
            }
        }

        this.bombs = bombs;
    }
    this.crash = function (i, dist) {
        var hit_judge = true;
        if (this.invincible_time < 180) { //恢复判定
            this.element.style.opacity = this.invincible_time % 20 > 10 ? 0.8 : 0.2;
            hit_judge = false;
        }
        if (distance(this.element, i.element) < dist) {
            if (i.type == 'live_res') { //live_res吸收
                i.lives = 0;
                this.score += 0.1;
                this.lives = this.lives < 5 ? this.lives + 1 / 32 : this.lives;
            } else if (hit_judge) { //boss bullet_boss判定
                if (i.type == 'bullet_boss') { i.lives = 0; }
                this.lives--;
                this.invincible_time = 60;
                if (this.bombs < 3) {
                    this.bombs += 2;
                    bombs_reduce -= 2;
                }
            }
        }
    }
    this.draw = function () {
        this.element.id = 'player';
        this.element.style.left = x + 'px';
        this.element.style.top = y + 'px';
        document.body.insertBefore(this.element, document.querySelector('script'));
    }
}


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
            player.score += 0.05;
            i.lives = 0;
            if (this.lives == 0) { //加分 掉资源
                player.score += 20;
                live_res_maker.generator(this, 999, '', 'track', [0, 2], [0, 15]);
                live_res_maker.generator(this, 999, '', 'track', [0, 2], [0, -15]);
                live_res_maker.generator(this, 999, '', 'track', [0, 2], [15, 0]);
                live_res_maker.generator(this, 999, '', 'track', [0, 2], [-15, 0]);
                if (audio_fx) {
                    audio_fx.src = './media/boom.aac';
                    audio_fx.play();
                }
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