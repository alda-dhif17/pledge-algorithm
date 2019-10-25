window.onload = () => {
    let can = document.getElementById('main-canvas'),
        ctx = can.getContext('2d');
    let cbr = can.getBoundingClientRect();
    
    let drumm3rB01;
    let b01img = new Image();
    b01img.src = '/res/b01.jpg';

    b01img.onload = () => {
        fetch('/lab.json').then(res => {
            if (res.ok)
                return res.json();
        }
        ).then(res => {
            if (!res) {
                window.alert('ALARM; ALRAM; ERROR!');
            } else {
                let lab = res;

                can.onclick = e => {
                    let cx = e.clientX - cbr.left,
                        cy = e.clientY - cbr.top;
                    drumm3rB01 = new Elias(cx, cy);
                    refresh();
                };

                window.onresize = () => {
                    can.width = window.innerWidth;
                    can.height = window.innerHeight;
                    refresh();
                };
                window.onresize();

                function refresh () {
                    ctx.clearRect(0, 0, can.width, can.height);

                    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                    ctx.fillRect(lab.x, lab.y, lab.width, lab.height);

                    lab.walls.forEach(w => {
                        ctx.moveTo(w.xf, w.yf);
                        ctx.lineTo(w.xt, w.yt);
                        ctx.lineWidth = 7;
                        ctx.strokeStyle = '#f42069';
                        ctx.lineCap = 'round';
                        ctx.stroke();
                    });

                    if (drumm3rB01) {
                        draw_player();
                    }
                }

                function clear_player() {
                    ctx.clearRect(
                        drumm3rB01.x, drumm3rB01.y,
                        drumm3rB01.width, drumm3rB01.height
                    );
                }

                function draw_player() {
                    ctx.drawImage(b01img, 
                        drumm3rB01.x, drumm3rB01.y, 
                        drumm3rB01.width, drumm3rB01.height);
                }

                function hit_wall() {
                    for (let w of lab.walls) {
                        if (
                            (
                                (drumm3rB01.x >= w.xf && drumm3rB01.x <= w.xt) 
                                && (drumm3rB01.y === w.yf - 1 || drumm3rB01.y === w.yf +1)
                            )
                            || (
                                (drumm3rB01.y >= w.yf && drumm3rB01.y <= w.yt)
                                && (drumm3rB01.x === w.xf - 1 || drumm3rB01.x === w.xf + 1)
                            )
                        ) {
                            return true;
                        }
                    }
                    return false;
                }

                let intval;

                function play() {
                    if (!hit_wall()) {
                        clear_player();
                        drumm3rB01.y--;
                        draw_player();
                    } else {
                        console.log('asdf');
                        window.clearInterval(intval);
                    }
                }

                function start_game() {
                    intval = window.setInterval(play, 15);
                }

                window.onkeydown = e => {
                    if (e.keyCode === 32) {
                        start_game();
                    }
                };
            }
        });
    };
};