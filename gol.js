function GOL(canvas, opts) {
    var width = opts.width || 900;
    var height = opts.height || 900;
    var squareWidth = opts.squareWidth || 10;
    var squareHeight = opts.squareHeight || 10;
    var ctx = canvas.getContext('2d');
    var tick = null;
    var aliveX = {};

    this.init = function () {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        canvas.addEventListener('click', this.onClick);
        this.drawGrid(width, height);
    };

    function fillWrapper(x, y, color) {
        ctx.fillStyle = color || '#000000';
        if (isAlive(x, y)) {
            ctx.fillStyle = color || '#FFFFFF';
        }
        ctx.fillRect(((x - 1) * squareWidth) + 1, ((y - 1) * squareHeight) + 1, squareWidth - 2, squareHeight - 2);
    }

    function isAlive(x, y) {
        if (aliveX[y] && aliveX[y] === x) {
            aliveX[y] = null;
            return true;
        }
        aliveX[y] = x;
        return false;
    }

    this.onClick = function (event) {
        var x = event.pageX - canvas.offsetLeft;
        var y = event.pageY - canvas.offsetTop;
        fillWrapper(parseInt(x / squareWidth) + 1, parseInt(y / squareHeight) + 1);
    };

    this.drawGrid = function (w, h) {
        ctx.beginPath();
        for (var x = 0; x <= w; x = x + squareWidth) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, w);
        }
        for (var y = 0; y <= h; y = y + squareHeight) {
            ctx.moveTo(0, y);
            ctx.lineTo(h, y);
        }
        ctx.strokeStyle = '#000000';
        ctx.stroke();
    };

    this.fillRect = function (x, y, color) {
        if (isAlive(x, y)) {
            ctx.clearRect(((x - 1) * squareWidth) + 1, ((y - 1) * squareHeight) + 1, squareWidth - 2, squareHeight - 2);
            return;
        }
        ctx.fillStyle = color || '#000000';
        ctx.fillRect(((x - 1) * squareWidth) + 1, ((y - 1) * squareHeight) + 1, squareWidth - 2, squareHeight - 2);
    };

    this.clear = function () {
        ctx.clearRect(0, 0, width, height);
        canvas.removeEventListener('click', this.onClick);
        this.init();
    };

    this.start = function (miliseconds, cb) {
        tick = setInterval(function () {
            if (cb) {
                cb();
            }
            console.log('apply rules');
        }, miliseconds);
    };

    this.stop = function () {
        clearInterval(tick);
        tick = null;
    };

    this.init();
}
