function Player(x, y) {
    this.lives = 5;
    this.element = document.createElement('div');
    this.score = 0;
    this.bombs = 0;
    var fire_int_time = 0,
        bomb_time = 180,
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
        if (isfire) { //每16帧射bullet
            var elm_this = this.element;
            function gun(pos, fire_intspd) {
                var bullet = new Bullet(position(elm_this, pos), 'player', fire_intspd);
                bullet.draw();
                player_bullets.push(bullet);
            }
            fire_int_time = timer(fire_int_time, 16, function () {
                gun([14, 0], [1, -5]);
                gun([-14, 0], [-1, -5]);
            });
            fire_int_time = timer(fire_int_time, 16, function () {
                gun([-7, 0], [0, -5]);
                gun([7, 0], [0, -5]);
            });
        }
    }
    this.fire_bomb = function (isbomb) {
        var bombs = this.bombs;
        var differ = Math.floor(this.score / 100) - bombs;  //每100分加bomb
        if (differ > bombs_reduce && bombs < 5) { bombs++ }

        if (bomb_time < 180) { bomb_time++ } else {
            if (isbomb && bombs > 0) { //每180帧用bomb
                bombs_reduce++;
                bomb_time = 0;
                bombs--;
                boss_bullets = update(boss_bullets, function () { }, function () { i.lives = 0 });
                boss_list = update(boss_list, function () { }, function () { i.lives -= 15 });
            }
        }
        this.bombs = bombs;
    }
    this.crash = function (i, dist) {
        if (this.lives > 0) {
            if (distance(this.element, i.element) < dist) {
                this.lives--;
                i.lives = 0;
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