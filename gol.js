function GOL(canvas, opts) {
    var width = opts.width || 900;
    var height = opts.height || 900;
    var squareWidth = opts.squareWidth || 10;
    var squareHeight = opts.squareHeight || 10;
    var ctx = canvas.getContext('2d');
    var tick = null;
    var cells = [];
    var started = false;
    var dead = [];

    function init() {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        canvas.addEventListener('click', onClick);
        drawGrid(width, height);
    }

    function createGrid(w, h) {
        var newCells = [];
        var i = 1;
        for (var x = squareWidth; x <= w; x = x + squareWidth) {
            newCells[i] = [];
            var j = 1;
            for (var y = squareHeight; y <= h; y = y + squareHeight) {
                newCells[i][j++] = [false];
            }
            i++;
        }
        return newCells;
    }

    function drawGrid(w, h) {
        cells = createGrid(w, h);
        ctx.beginPath();
        for (var x = squareWidth; x <= w; x = x + squareWidth) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, w);
        }
        for (var y = 0; y <= h; y = y + squareHeight) {
            ctx.moveTo(0, y);
            ctx.lineTo(h, y);
        }
        ctx.strokeStyle = '#000000';
        ctx.stroke();
    }

    function fillWrapper(x, y, color) {
        if (isAlive(x, y)) {
            kill(x, y);
            ctx.fillStyle = color || '#FFFFFF';
            ctx.fillRect(((x - 1) * squareWidth) + 1, ((y - 1) * squareHeight) + 1, squareWidth - 2, squareHeight - 2);
            return;
        }
        live(x, y);
        ctx.fillStyle = color || '#000000';
        ctx.fillRect(((x - 1) * squareWidth) + 1, ((y - 1) * squareHeight) + 1, squareWidth - 2, squareHeight - 2);
    }

    function getAlive() {
        var alive = createGrid(width, height);
        for (var x in cells) {
            for (var y in cells[x]) {
                var neighbpursAlive = getNeighboursAlive(x, y);
                if (cells[x][y][0] === false && neighbpursAlive.length === 3) {
                    alive[x][y][0] = true;
                }
                if (cells[x][y][0] === true) {
                    if (neighbpursAlive.length === 2 || neighbpursAlive.length === 3) {
                        alive[x][y][0] = true;
                    }
                }
            }
        }
        return alive;
    }

    function merge(alive) {
        for (var x in alive) {
            for (var y in alive) {
                if (alive[x][y][0] === true && cells[x][y][0] === false) {
                    fillWrapper(x, y);
                }
                if (alive[x][y][0] === false && cells[x][y][0] === true) {
                    fillWrapper(x, y);
                }
            }
        }
    }

    function getNeighboursAlive(x, y) {
        x = parseInt(x);
        y = parseInt(y);
        var neighbours = [];

        if (isInGrid(x - 1, y - 1) && isAlive(x - 1, y - 1)) {
            neighbours.push([x - 1, y - 1]);
        }
        if (isInGrid(x, y - 1) && isAlive(x, y - 1)) {
            neighbours.push([x, y - 1]);
        }
        if (isInGrid(x + 1, y - 1) && isAlive(x + 1, y - 1)) {
            neighbours.push([x + 1, y - 1]);
        }
        if (isInGrid(x - 1, y) && isAlive(x - 1, y)) {
            neighbours.push([x - 1, y]);
        }
        if (isInGrid(x + 1, y) && isAlive(x + 1, y)) {
            neighbours.push([x + 1, y]);
        }
        if (isInGrid(x - 1, y + 1) && isAlive(x - 1, y + 1)) {
            neighbours.push([x - 1, y + 1]);
        }
        if (isInGrid(x, y + 1) && isAlive(x, y + 1)) {
            neighbours.push([x, y + 1]);
        }
        if (isInGrid(x + 1, y + 1) && isAlive(x + 1, y + 1)) {
            neighbours.push([x + 1, y + 1]);
        }
        return neighbours;
    }

    function live(x, y) {
        cells[x][y][0] = true;
        if (!dead[x]) {
            dead[x] = [];
        }
        if (!dead[x][y]) {
            dead[x][y] = [false];
        }
    }

    function kill(x, y) {
        cells[x][y][0] = false;
        if (!dead[x]) {
            dead[x] = [];
        }
        if (!dead[x][y]) {
            dead[x][y] = [true];
        }
    }

    function isAlive(x, y) {
        if (cells[x] && cells[x][y] && cells[x][y][0] === true) {
            return true;
        }
        return false;
    }

    function isInGrid(x, y) {
        var min = 1;
        var max = cells.length - 1;
        if (x < min || x > max) {
            return false;
        }
        if (y < min || y > max) {
            return false;
        }
        return true;
    }

    function onClick(event) {
        var x = event.pageX - canvas.offsetLeft;
        var y = event.pageY - canvas.offsetTop;
        fillWrapper(parseInt(x / squareWidth) + 1, parseInt(y / squareHeight) + 1);
    }

    function clear() {
        ctx.clearRect(0, 0, width, height);
        canvas.removeEventListener('click', onClick);
        init();
    }

    this.fillRect = function (x, y, color) {
        fillWrapper(x, y, color);
    };

    this.start = function (miliseconds, cb) {
        started = true;
        tick = setInterval(function () {
            var alive = getAlive();
            merge(alive);
            cells = alive;
            if (cb) {
                cb();
            }
            dead = [];
        }, miliseconds);
    };

    this.stop = function () {
        started = false;
        tick = clearInterval(tick);
    };

    init();
}
