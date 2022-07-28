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