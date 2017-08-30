import * as React from "react";
import * as ReactDOM from "react-dom";

import { Hello } from "./components/Hello";


function main() {
    try{
    let canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    canvas.width = 1000;
    canvas.height = 500;
    let ctx = new AudioContext();
    let analyser = ctx.createAnalyser();
    //analyser.minDecibels = -90;
    analyser.maxDecibels = -50;
    //analyser.smoothingTimeConstant = 0.85;
    let gainNode = ctx.createGain();
    gainNode.gain.value = 0;
    
    navigator.getUserMedia({audio: true}, (stream: MediaStream)=>{
        let source = ctx.createMediaStreamSource(stream);
        source.connect(analyser);
        source.connect(gainNode);
        gainNode.connect(ctx.destination);
        visualize(canvas, analyser, ctx);
    }, (err: MediaStreamError) => {
        alert(err);
    });
    console.log("ok");
}catch(e){alert(e)}
}



function visualize(canvas: HTMLCanvasElement, analyser: AnalyserNode, ctx: AudioContext) {
    let WIDTH = canvas.width;
    let HEIGHT = canvas.height;
    let canvasCtx = canvas.getContext("2d");
    analyser.fftSize = 32768;
    let bufferLength = 2000 * analyser.fftSize / ctx.sampleRate; //analyser.frequencyBinCount;
    let dataArray = new Uint8Array(bufferLength);
    let bigPointsHist: number[][] = [];

    let loopCount = 0;

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    let drawAlt = function() {
        requestAnimationFrame(drawAlt);

        analyser.getByteFrequencyData(dataArray);

        if ((loopCount ++) % 8 == 0) {
            let bigPoints = retrieveBig(dataArray);
            if (bigPoints.length != 0) {
                if (bigPointsHist.length >= 10) {
                    bigPointsHist.shift();
                }
                bigPointsHist.push(bigPoints);
            }
        }

        canvasCtx.drawImage(canvas, 1, 0, WIDTH - 1, HEIGHT, 0, 0, WIDTH - 1, HEIGHT);

        let max = 0;
        let maxFreq = 0;
        for(let i = 0; i < bufferLength; i++) {
            let mag = dataArray[i];
            if (max < mag) {
                max = mag;
                maxFreq = i * ctx.sampleRate / analyser.fftSize;
            }

            canvasCtx.fillStyle = 'hsl(' +((1 - mag / 256) * 240) + ',100%,50%)';
            canvasCtx.fillRect(WIDTH - 1, (1 - i / bufferLength) * HEIGHT, WIDTH, (1 - (i + 1) / bufferLength) * HEIGHT);
        }
        document.getElementsByTagName("p")[0].innerText = "max = " + String(maxFreq) + "Hz";
        document.getElementsByTagName("p")[1].innerText = "big points = " + bigPointsHist.map((bigPoints) => {
            return "["+bigPoints.map((x) => { return Math.floor(x * ctx.sampleRate / analyser.fftSize); }).join(", ")+"]";
        }).join(", ");
    };

    drawAlt();
}

function retrieveBig(data: Uint8Array) {
    let length = data.length;
    let res : number [][] = [];
    for (let i = 0; i < length; i ++) {
        if (data[i] > 250) {
            if (res.length > 0 && res[res.length - 1][1] == i - 1) {
                let [start, end, repr, max] = res[res.length - 1];
                if (data[i] > max) {
                    max = data[i];
                    repr = i;
                }
                res[res.length - 1] = [start, i, repr, max];
            } else {
                res.push([i, i, i, data[i]]);
            }
            
        }
    }
    return res.map((tuple) => {
        let [start, end, repr, max] = tuple;
        return repr;
    });
}

main();
/*ReactDOM.render(
    <Hello compiler="TypeScript" framework="React" />,
    document.getElementById("example")
);  */