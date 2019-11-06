let can = document.getElementById('main-canvas'),
ctx = can.getContext('2d');
window.onload = () => {
    let cbr = can.getBoundingClientRect();
    
    let drumm3rB01;
    let b01img = new Image();
    let running = false;
    b01img.src = '/res/elias.png';

    b01img.onload = () => {
        fetch('/lab.json').then(res => {
            if (res.ok)
                return res.json();
        }).then(res => {
            if (!res) {
                window.alert('ALARM; ALRAM; ERROR!');
            } else {
                let lab = res;

                can.onclick = e => {
                    let cx = e.clientX - cbr.left,
                        cy = e.clientY - cbr.top;
                    drumm3rB01 = new Elias(cx, cy);
                    drumm3rB01.vy = 1;
                    refresh();
                };

                window.onresize = () => {
                    can.width = window.innerWidth;
                    can.height = window.innerHeight;
                    refresh();
                };
                window.onresize();

                function refresh() {
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
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                    ctx.fillRect(drumm3rB01.x, drumm3rB01.y, drumm3rB01.width, drumm3rB01.height);
                }

                function draw_player() {
                    ctx.save();

                    if (drumm3rB01.vy === -1) {
                        ctx.rotate(0);
                    } else if (drumm3rB01.vy === 1) {
                        ctx.rotate(Math.PI / 2);
                    } else if (drumm3rB01.vx === -1) {
                        ctx.rotate(3*Math.PI/2);
                    } else if (drumm3rB01.vx === 1) {
                        ctx.rotate(Math.PI/2);
                    }

                    ctx.fillStyle = 'black';
                    ctx.fillRect(10, 10, 100, 100);

                    ctx.drawImage(b01img,
                        drumm3rB01.x, drumm3rB01.y,
                        drumm3rB01.width, drumm3rB01.height);

                    let gradient = ctx.createLinearGradient(drumm3rB01.x, 0, drumm3rB01.x+drumm3rB01.width, 0);

                    gradient.addColorStop(0, '#e6261f');
                    gradient.addColorStop(.125, '#eb7532');
                    gradient.addColorStop(.25, '#f7d038');
                    gradient.addColorStop(.375, '#a3e048');
                    gradient.addColorStop(.5, '#49da9a');
                    gradient.addColorStop(.625, '#34bbe6');
                    gradient.addColorStop(.75, '#4355db');
                    gradient.addColorStop(.875, '#d23be7');

                    ctx.fillStyle = gradient;
                    ctx.fillRect(drumm3rB01.x, drumm3rB01.y + drumm3rB01.height,
                        drumm3rB01.width, 25);

                    ctx.restore();
                }

                function hit_wall() {
                    for (let w of lab.walls) {
                        if (
                            (
                                (drumm3rB01.x >= w.xf && drumm3rB01.x <= w.xt) &&
                                (drumm3rB01.y === w.yf - 5 || drumm3rB01.y === w.yf + 5)
                            ) ||
                            (
                                (drumm3rB01.y >= w.yf && drumm3rB01.y <= w.yt) &&
                                (drumm3rB01.x === w.xf - 5 || drumm3rB01.x === w.xf + 5)
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

                        drumm3rB01.x += drumm3rB01.vx;
                        drumm3rB01.y += drumm3rB01.vy;

                        draw_player();
                    } else {
                        window.clearInterval(intval);
                    }
                }

                function start_game() {
                    intval = window.setInterval(play, 5);
                }

                function stop_game() {
                    window.clearInterval(intval);
                }

                window.onkeydown = e => {
                    if (e.keyCode === 32) {
                        if (!running) {
                            start_game();
                        } else {
                            stop_game();
                        }

                        running = !running;
                    }
                };
            }
        });
    };
};