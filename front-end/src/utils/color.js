import {randomColor} from 'randomcolor';

const color = randomColor({
    luminosity: 'random', // dark, light, bright or random
    format: 'rgb',
    count: 20
 });

 let count = -1;

function colorRandom() {
    console.log("color", color)
    count++;
    if(count === 20){
        count = -1
    }
    return color[count];
};

export {colorRandom};