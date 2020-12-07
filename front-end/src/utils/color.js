import { randomColor } from 'randomcolor';

const randColor = randomColor({
    luminosity: 'random', // dark, light, bright or random
    format: 'rgb',
    count: 20
});

const brightColor = randomColor({
    luminosity: 'light', // dark, light, bright or random
    format: 'rgb',
    count: 20
});

let count = -1;

function colorRandom() {
    count++;
    if (count === 20) {
        count = -1
    }
    return randColor[count];
};

function brightColorRandom() {
    count++;
    if (count === 20) {
        count = -1
    }
    return brightColor[count];
};

export { colorRandom, brightColorRandom };