let width = window.innerWidth,
    height = window.innerHeight;
var canvas = document.getElementById('canvas-bg');
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext('2d');

let points = [];
// points[i] = {
//     x,
//     y,
//     closest: {x,y},
//     circle,
//     koef
// }
let colors = [];

let target = {
    x: width / 2,
    y: height / 2
};


// You can change this variables
const density = 12;
let palette = [
    "30, 86, 49",       // #1E5631
    "164, 222, 2",      // #A4DE02
    "118, 186, 27",     // #76BA1B
    "76, 154, 42",      // #4C9A2A
    "172, 223, 135",    // #ACDF87
    "104, 187, 89"      // #68BB59
];
const circle_size = 7;
