function Stage(level) {
    switch (level) {
        case 1: //自狙击
            this.boss_lives = 10;
            this.boss_generate = function () {
                if (boss_bullets.length < 30 && boss_list.length < 3 && player.score < 400) {
                    boss_maker.generator('', 30, '', ''
                        , [Math.random() * 5 - 2, Math.random() * 2 + 2]
                        , [Math.random() * 490, -70]
                        , '', this.boss_lives
                    );
                };
            }
            this.boss_fire = function (i) {
                bullet_boss_maker.generator(i, 12, 'locate', '', [0, 2]);
            }
            this.bullet_move = function (i) {
                i.move('transfer');
            }
            break;
        case 2: //螺旋下坠
            this.boss_lives = 15;
            this.boss_generate = function () {
                if (boss_bullets.length < 30 && boss_list.length < 1 && player.score < 700) {
                    boss_maker.generator('', 30, '', ''
                        , [0, Math.random() * 3 + 4]
                        , [Math.random() * 490, -70]
                        , '', this.boss_lives
                    );
                };
            }
            this.boss_fire = function (i) {
                bullet_boss_maker.generator(i, 6, 'ring', '', [0, 2], '', 6);
            }
            this.bullet_move = function (i) {
                i.move('');
            }
            break;
        case 3: //龙纹
            this.boss_lives = 30;
            this.boss_generate = function () {
                if (boss_bullets.length < 30 && boss_list.length < 3 && player.score < 890) {
                    boss_maker.generator('', 15, '', ''
                        , [Math.random() > 0.5 ? 2 : - 2, Math.random() * 1 + 2]
                        , [Math.random() * 490, -70]
                        , '', this.boss_lives
                    );
                };
            }
            this.boss_fire = function (i) {
                bullet_boss_maker.generator(i, 240, 'ring', 'circle', [0, 2], '', 16);
            }
            this.bullet_move = function (i) {
                i.move('');
            }
            break;
        case 4: //双圆
            this.boss_lives = 300;
            this.boss_generate = function () {
                if (boss_bullets.length < 30 && boss_list.length < 1 && player.score < 920) {
                    boss_maker.generator('', 300, '', ''
                        , []//[Math.random() * 5 - 2, Math.random() * 2 + 2]
                        , [255, 150]//[Math.random() * 490, -70]
                        , '', this.boss_lives
                    );
                };
            }
            this.boss_fire = function (i) {
                bullet_boss_maker.generator(i, 60, 'ring', 'rand_accelerate', [0, 2], '', 32);
            }
            this.bullet_move = function (i) {
                i.move('');
            }
            break;
        case 5: //开花
            this.boss_lives = 400;
            this.boss_generate = function () {
                if (boss_bullets.length < 30 && boss_list.length < 1 && player.score < 960) {
                    boss_maker.generator('', 300, '', ''
                        , []//[Math.random() * 5 - 2, Math.random() * 2 + 2]
                        , [255, 150]//[Math.random() * 490, -70]
                        , '', this.boss_lives
                    );
                };
            }
            this.boss_fire = function (i) {
                bullet_boss_maker.generator(i, 180, 'ring', '', [0, 5], '', 5);
                for (b of boss_bullets) {
                    if (b.super_elm === i.element) {
                        bullet_boss_maker2.generator(b, 60, 'ring', 'gravity'
                            , [0, Math.random() * 2 + 1], '', 16);
                    }
                }
            }
            this.bullet_move = function (i) {
                i.move('');
            }
            break;
        case 6: //波粒
            this.boss_lives = 500;
            this.boss_generate = function () {
                if (boss_bullets.length < 30 && boss_list.length < 1) {
                    boss_maker.generator('', 300, '', ''
                        , []//[Math.random() * 5 - 2, Math.random() * 2 + 2]
                        , [255, 150]//[Math.random() * 490, -70]
                        , '', this.boss_lives
                    );
                };
            }
            this.boss_fire = function (i) {
                bullet_boss_maker.generator(i, 3, 'ring', '', [0, 4], '', 4);
                /* for (b of boss_bullets) {
                    if (b.super_elm == i.element) {
                        bullet_boss_maker2.generator(b, 6, 'ring', 'circle', [0, Math.random() * 2 + 1], '', 6);
                    }
                } */
            }
            this.bullet_move = function (i) {
                i.move('');
            }
            break;
    }
}


function Maker(obj_type) {
    this.obj_type = obj_type; //发生的对象类型
    this.v_initial = [0, 0];
    this.pos_rel = [0, 0];
    var t_first = 0,
        generate_num = 0;

    this.generator = function (super_obj, t_lag, generate_type, move_type, v_initial, pos_rel, other, lives) {
        var obj, pos_initial,
            obj_type = this.obj_type,
            v_value = v_initial ? Math.sqrt(v_initial[0] ** 2 + v_initial[1] ** 2) : 0;
        //创建对象
        var creator = function (v_initial, pos_rel) {
            pos_initial = super_obj ? position(super_obj.element, pos_rel) : pos_rel;
            switch (obj_type) {
                case 'bullet_boss':
                    obj = new Bullet(pos_initial, v_initial, obj_type, move_type);
                    obj.super_elm = super_obj.element;
                    // obj.style = undefined;
                    obj.draw();
                    boss_bullets.push(obj);
                    break;
                case 'bullet_player':
                    obj = new Bullet(pos_initial, v_initial, obj_type, move_type);
                    // obj.style = undefined;
                    obj.draw();
                    player_bullets.push(obj);
                    break;
                case 'live_res':
                    obj = new Bullet(pos_initial, v_initial, obj_type, move_type);
                    // obj.style = undefined;
                    obj.draw();
                    live_res.push(obj);
                    break;
                case 'boss':
                    obj = new Boss(pos_initial, v_initial, obj_type, move_type, lives);
                    // obj.style = undefined;
                    obj.draw();
                    boss_list.push(obj);
                    break;
                default:
                    console.log('[Err]方法generator 参数obj_type');
                    break;
            }
        }
        //定时发生
        // setTimeout('t_first--')
        t_first++;
        if (t_first > t_lag || t_lag == 999) {
            t_first = 0;
            //发生方式
            switch (generate_type) {
                case 'ring':
                    generate_num += Math.PI / 30;
                    var c = generate_num ** 1.85;//+ Math.random() * Math.PI * 2; //相位
                    for (var i = c; i < Math.PI * 2 + c; i += Math.PI * 2 / other) {
                        this.v_initial = [v_value * Math.cos(i + c), v_value * Math.sin(i + c)];
                        // this.pos_rel = [0, 0];
                        creator(this.v_initial, pos_rel || this.pos_rel);
                    }
                    break;
                case 'locate':
                    var angle = degree(player.element, super_obj.element, [0, 0]);
                    this.v_initial = [v_value * Math.cos(angle), v_value * Math.sin(angle)];
                    creator(this.v_initial, pos_rel || this.pos_rel);
                    break;
                default:
                    creator(v_initial || this.v_initial, pos_rel || this.pos_rel);
                    break;
            }
        }
    }
}