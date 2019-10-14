window.addEventListener('mousemove', (e) => {
    let x = 0,
        y = 0;
    if (e.pageX || e.pageY) {
        x = e.pageX;
        y = e.pageY;
    } else if (e.clientX || e.clientY) {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    target.x = x;
    target.y = y;
});
window.addEventListener('resize', (e) => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
});

let lastAddedPoint = {
    x: 0,
    y: 0
};
window.addEventListener('click', (e) => {
    let x = target.x;
    let y = target.y;
    if (lastAddedPoint.x == target.x) {
        let stat = 10 + Math.random() * height * 0.1;
        x += (stat > 10 + height * 0.05 / 2) ? -stat : stat;
        y += (stat > 10 + height * 0.05 / 2) ? -stat : stat;
    }
    let newPoint = {
        x: x,
        y: y,
        circle: new Circle({
            x: x,
            y: y
        }, 4 + Math.random() * circle_size, points.length),
        koef: 1,
    }


    // find closest points
    let closest = [];
    for (let j = 0; j < points.length; j++) {
        let p2 = points[j];
        if (!(newPoint == p2)) {
            let placed = false;
            for (let k = 0; k < 7; k++)
                if (!placed)
                    if (closest[k] == undefined) {
                        closest[k] = p2;
                        placed = true;
                    }

            for (var k = 0; k < 7; k++)
                if (!placed)
                    if (getDistance(newPoint, p2) < getDistance(newPoint, closest[k])) {
                        closest[k] = p2;
                        placed = true;
                    }
        }
    }
    newPoint.closest = closest;


    points.push(newPoint);
    colors.push(palette[Math.floor(Math.random() * palette.length)]);



    let staticRandomX = Math.random();
    let staticRandomY = Math.random();
    movingNewPoint({
        duration: 1000,
        timing(timeFraction) {
            return elastic(1, 1 - timeFraction)
        },
        draw(progress) {
            newPoint.x = x + staticRandomX * 170 * progress;
            newPoint.y = y + staticRandomY * 170 * progress;
            newPoint.circle.pos = {
                x: newPoint.x,
                y: newPoint.y
            };
        }
    });

    function back(x, timeFraction) {
        return Math.pow(timeFraction, 2) * ((x + 1) * timeFraction - x)
    }

    function bounce(timeFraction) {
        for (let a = 0, b = 1, result; 1; a += b, b /= 2)
            if (timeFraction >= (7 - 4 * a) / 11)
                return -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) + Math.pow(b, 2)
    }

    function elastic(x, timeFraction) {
        return Math.pow(2, 10 * (timeFraction - 1)) * Math.cos(20 * Math.PI * x / 3 * timeFraction)
    }
    lastAddedPoint = Object.assign({}, target);
});

function movingNewPoint({timing, draw, duration}) {
    let start = performance.now();
    requestAnimationFrame(function movingNewPoint(time) {
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1;

        let progress = timing(timeFraction);
        
        draw(progress);

        if (timeFraction < 1)
            requestAnimationFrame(movingNewPoint);
    });
}


function init() {
    for (let x = 0; x < width; x += width / density) {
        for (let y = 0; y < height; y += height / density) {
            let px = x + Math.random() * width / density;
            let py = y + Math.random() * height / density;

            points.push({
                x: px,
                y: py
            });
        }
    }

    //horizontal axes
    for (let i = 0; i < width; i += width / density * 2) {
        //top
        let px = Math.random() * width;
        points.push({
            x: px,
            y: 0
        });

        //button
        px = Math.random() * width;
        points.push({
            x: px,
            y: height - 10
        });
    }

    //vertical axes
    for (let i = 0; i < height; i += height / density * 2) {
        //right
        let py = Math.random() * height;
        points.push({
            x: 0,
            y: py
        });

        //left
        py = Math.random() * height;
        points.push({
            x: width - 10,
            y: py
        });
    }

    findClosest();

    // assign a circle to each point
    for (let i in points) {
        let c = new Circle(points[i], 2 + Math.random() * circle_size, i);
        points[i].circle = c;
        colors.push(palette[Math.floor(Math.random() * palette.length)]);
    }

    // animation
    animate();
}
init();


function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i in points) {
        // detect points in range
        if (getDistance(target, points[i]) < 70) {
            points[i].koef = 1;
            points[i].circle.koef = 1;
        } else if (getDistance(target, points[i]) < 150) {
            points[i].koef = 0.6;
            points[i].circle.koef = 0.6;
        } else if (getDistance(target, points[i]) < 300) {
            points[i].koef = 0.3;
            points[i].circle.koef = 0.3;
        } else {
            points[i].koef = 0;
            points[i].circle.koef = 0;
        }
        drawLines(points[i]);
        points[i].circle.draw();
    }
    requestAnimationFrame(animate);
}

function findClosest() {
    // for each point find the 5 closest points
    for (let i = 0; i < points.length; i++) {
        let closest = [];
        let p1 = points[i];

        for (let j = 0; j < points.length; j++) {
            let p2 = points[j];
            if (!(p1 == p2)) {
                let placed = false;
                for (let k = 0; k < 5; k++)
                    if (!placed)
                        if (closest[k] == undefined) {
                            closest[k] = p2;
                            placed = true;
                        }

                for (var k = 0; k < 5; k++)
                    if (!placed)
                        if (getDistance(p1, p2) < getDistance(p1, closest[k])) {
                            closest[k] = p2;
                            placed = true;
                        }
            }
        }
        p1.closest = closest;
    }
}

function drawLines(p) {
    if (!p.koef)
        return;
    for (let i in p.closest) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.closest[i].x, p.closest[i].y);
        ctx.strokeStyle = 'rgba(' + palette[2] + ',' + p.koef + ')';
        ctx.stroke();
    }
}


function Circle(pos, radius, id) {
    this.pos = pos || null;
    this.radius = radius || null;
    this.id = id;
    this.koef = 1;

    this.draw = () => {
        if (!this.koef)
            return;
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(' + colors[this.id] + ',' + this.koef + ')';
        ctx.fill();
    }
}

function getDistance(p1, p2) {
    let r = Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    return Math.sqrt(r);
}