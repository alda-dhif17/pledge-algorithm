class Player {
  constructor(x, y, width = 60, height = 60) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = -1;
    this.width = width;
    this.height = height;

    this.turn_counter = 0;
  }
}
