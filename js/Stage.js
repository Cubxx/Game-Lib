function Stage(level) {
    switch (level) {
        case 1: //自狙击
            this.boss_lives = 10;
            this.boss_generate = function () {
                if (boss_bullets.length < 30 && boss_list.length < 5) {
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
                if (boss_bullets.length < 30 && boss_list.length < 1) {
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
            this.boss_lives = 20;
            this.boss_generate = function () {
                if (boss_bullets.length < 50 && boss_list.length < 3) {
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
            this.boss_lives = 300+400+500;
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
                bullet_boss_maker.generator(i, 60, 'ring', 'rand_accelerate', [0, 2], '', 32);
            }
            this.bullet_move = function (i) {
                i.move('');
            }
            break;
        case 5: //开花
            this.boss_lives = 400;
            this.boss_generate = function () {
                /* if (boss_bullets.length < 30 && boss_list.length < 1) {
                    boss_maker.generator('', 300, '', ''
                        , []//[Math.random() * 5 - 2, Math.random() * 2 + 2]
                        , [255, 150]//[Math.random() * 490, -70]
                        , '', this.boss_lives
                    );
                }; */
            }
            this.boss_fire = function (i) {
                bullet_boss_maker.generator(i, 180, 'ring', '', [0, 5], '', 5);
                for (b of boss_bullets) {
                    if (b.super_elm === i.element) {
                        bullet_boss_maker2.generator(b, 60, 'ring', ''
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
                /* if (boss_bullets.length < 30 && boss_list.length < 1) {
                    boss_maker.generator('', 300, '', ''
                        , []//[Math.random() * 5 - 2, Math.random() * 2 + 2]
                        , [255, 150]//[Math.random() * 490, -70]
                        , '', this.boss_lives
                    );
                }; */
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