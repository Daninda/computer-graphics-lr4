const width = 400;
const height = 400;

let numberLeft = 100;
let numberRight = 200;

const accept = document.getElementById('accept-button');
const inputLeft = document.getElementById('left');
const inputRight = document.getElementById('right');
inputLeft.value = numberLeft;
inputRight.value = numberRight;

const canvases = document.getElementsByClassName('canvas');
for (const i of canvases) {
    i.width = width;
    i.height = height;
}
const ctxImage_1 = canvases[0].getContext('2d');
const ctxImage_2 = canvases[1].getContext('2d');
const ctxImage_3 = canvases[2].getContext('2d');
const ctxImage_4 = canvases[3].getContext('2d');
const ctxImage_5 = canvases[4].getContext('2d');

let image = new Image();
image.src = 'img/jaguar.jpg';
// image.src = 'img/papug.jpg';
// image.src = 'img/image001.jpg';
// image.src = 'img/train.jpg';

let imageData_2;

image.onload = () => {
    ctxImage_1.drawImage(image, 0, 0, width, height);

    imageData_2 = ctxImage_1.getImageData(0, 0, width, height);
    toShadesOfGray(imageData_2);
    ctxImage_2.putImageData(imageData_2, 0, 0);

    let imageData_3 = ctxImage_2.getImageData(0, 0, width, height);
    luminanceСut(imageData_3, 100, 200);
    ctxImage_3.putImageData(imageData_3, 0, 0);

    let imageData_4 = ctxImage_2.getImageData(0, 0, width, height);
    contrast(imageData_4);
    ctxImage_4.putImageData(imageData_4, 0, 0);

    let imageData_5 = ctxImage_2.getImageData(0, 0, width, height);
    toblackwhite(imageData_5, 50);
    heuristicAlgorithm(imageData_5, 4, 3);
    ctxImage_5.putImageData(imageData_5, 0, 0);
};

accept.onclick = () => {
    let imageData_3 = ctxImage_2.getImageData(0, 0, width, height);
    numberLeft = +inputLeft.value;
    numberRight = +inputRight.value;
    luminanceСut(imageData_3, numberLeft, numberRight);
    ctxImage_3.putImageData(imageData_3, 0, 0);
}

function toShadesOfGray(imageData) {
    let shade;
    for (let x = 0; x < imageData.width; x++) {
        for (let y = 0; y < imageData.height; y++) {
            let pixel = getPixel(imageData, x, y);
            shade = pixel[0] * 0.299 + pixel[1] * 0.587 + pixel[2] * 0.114;
            shade = Math.round(shade);
            imageData.data[y * (imageData.width * 4) + x * 4 + 0] = shade;
            imageData.data[y * (imageData.width * 4) + x * 4 + 1] = shade;
            imageData.data[y * (imageData.width * 4) + x * 4 + 2] = shade;
        }
    }
}

function luminanceСut(imageData, f1, f2) {
    if (f1 > f2) return;
    let shade;
    for (let x = 0; x < imageData.width; x++) {
        for (let y = 0; y < imageData.height; y++) {
            shade = imageData.data[y * (imageData.width * 4) + x * 4 + 0];
            if (shade >= f1 && shade <= f2) {
                imageData.data[y * (imageData.width * 4) + x * 4 + 0] = 255;
                imageData.data[y * (imageData.width * 4) + x * 4 + 1] = 255;
                imageData.data[y * (imageData.width * 4) + x * 4 + 2] = 255;
            }
        }
    }
}

function toblackwhite(imageData, f0) {
    let shade;
    for (let x = 0; x < imageData.width; x++) {
        for (let y = 0; y < imageData.height; y++) {
            shade = imageData.data[y * (imageData.width * 4) + x * 4 + 0];
            if (shade > f0) {
                imageData.data[y * (imageData.width * 4) + x * 4 + 0] = 255;
                imageData.data[y * (imageData.width * 4) + x * 4 + 1] = 255;
                imageData.data[y * (imageData.width * 4) + x * 4 + 2] = 255;
            }
            else if (shade <= f0) {
                imageData.data[y * (imageData.width * 4) + x * 4 + 0] = 0;
                imageData.data[y * (imageData.width * 4) + x * 4 + 1] = 0;
                imageData.data[y * (imageData.width * 4) + x * 4 + 2] = 0;
            }
        }
    }
}

function contrast(imageData) {
    let data_2 = _.clone(imageData.data);
    let imageData_2 = new ImageData(data_2, imageData.width, imageData.height);
    let a = 0;
    let b = 1/4;
    let mask = [[0, -1, 0],
                [-1, 8, -1],
                [0, -1, 0]];
    let newShade = 0;
    let lx = 0, rx = 0, ly = 0, ry = 0;
    for (let x = 0; x < imageData_2.width; x++) {
        lx = x == 0;
        rx = x == imageData_2.width - 1;
        for (let y = 0; y < imageData_2.height; y++) {
            ly = y == 0;
            ry = y == imageData_2.height - 1;
            newShade = a + b * (getPixel(imageData_2, x-1+lx, y-1+ly)[0] * mask[0][0] + 
                                    getPixel(imageData_2, x, y-1+ly)[0] * mask[0][1] +
                                    getPixel(imageData_2, x+1-rx, y-1+ly)[0] * mask[0][2] +
                                    getPixel(imageData_2, x-1+lx, y)[0] * mask[1][0] +
                                    getPixel(imageData_2, x, y)[0] * mask[1][1] +
                                    getPixel(imageData_2, x+1-rx, y)[0] * mask[1][2] +
                                    getPixel(imageData_2, x-1+lx, y+1-ry)[0] * mask[2][0] +
                                    getPixel(imageData_2, x, y+1-ry)[0] * mask[2][1] +
                                    getPixel(imageData_2, x+1-rx, y+1-ry)[0] * mask[2][2]);
            newShade = Math.round(newShade);
            
            imageData.data[y * (imageData.width * 4) + x * 4 + 0] = newShade;
            imageData.data[y * (imageData.width * 4) + x * 4 + 1] = newShade;
            imageData.data[y * (imageData.width * 4) + x * 4 + 2] = newShade;                    
        }
    }
}

function heuristicAlgorithm(imageData, f1, f2) {
    let data_2 = _.clone(imageData.data);
    let imageData_2 = new ImageData(data_2, imageData.width, imageData.height);
    let d, D;
    for (let x = 0; x < imageData.width; x++) {
        for (let y = 0; y < imageData.height; y++) {
            d = calcd(imageData_2, x, y);
            D = calcD(imageData_2, x, y);
            if (d <= f1 || D <= f2) {
                imageData.data[y * (imageData.width * 4) + x * 4 + 0] = 255;
                imageData.data[y * (imageData.width * 4) + x * 4 + 1] = 255;
                imageData.data[y * (imageData.width * 4) + x * 4 + 2] = 255;
            }
        }
    }
}

function calcd(imageData, x, y) {
    let res = 0;
    let shade;
    shade = getPixel(imageData, x, y)[0] / 255;
    let lx = 0, rx = 0, ly = 0, ry = 0;
    lx = x == 0;
    rx = x == imageData.width - 1;
    ly = y == 0;
    ry = y == imageData.height - 1;
    for (let i = -1 + lx; i <= 1 - rx; i++) {
        for (let j = -1 + ly; j <= 1 - ry; j++) {
            res += getPixel(imageData, x + i, y + j)[0] / 255;
        }
    }  
    return res - shade;
}

function calcD(imageData, x, y) {
    let res = 0;
    let d;
    d = calcd(imageData, x, y);
    let lx = 0, rx = 0, ly = 0, ry = 0;
    lx = x == 0;
    rx = x == imageData.width - 1;
    ly = y == 0;
    ry = y == imageData.height - 1;
    for (let i = -1 + lx; i <= 1 - rx; i++) {
        for (let j = -1 + ly; j <= 1 - ry; j++) {
            res += calcd(imageData, x + i, y + j);
        }
    } 
    return res - d;
}

function getPixel(imageData, x, y) {
    return [imageData.data[y * (imageData.width * 4) + x * 4 + 0],
            imageData.data[y * (imageData.width * 4) + x * 4 + 1],
            imageData.data[y * (imageData.width * 4) + x * 4 + 2],
            imageData.data[y * (imageData.width * 4) + x * 4 + 3]]
}