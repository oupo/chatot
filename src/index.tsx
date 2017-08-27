import * as React from "react";
import * as ReactDOM from "react-dom";

import { Hello } from "./components/Hello";


function main() {
    let canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    canvas.width = 1000;
    canvas.height = 500;
    let ctx = new AudioContext();
    let analyser = ctx.createAnalyser();
    //analyser.minDecibels = -90;
    //analyser.maxDecibels = -10;
    //analyser.smoothingTimeConstant = 0.85;
    let gainNode = ctx.createGain();
    gainNode.gain.value = 0;
    
    navigator.getUserMedia({audio: true}, (stream: MediaStream)=>{
        let source = ctx.createMediaStreamSource(stream);
        source.connect(analyser);
        source.connect(gainNode);
        //gainNode.connect(ctx.destination);
        visualize(canvas, analyser, ctx);
    }, (err: MediaStreamError) => {

    });
    console.log("ok");
}



function visualize(canvas: HTMLCanvasElement, analyser: AnalyserNode, ctx: AudioContext) {
    let WIDTH = canvas.width;
    let HEIGHT = canvas.height;
    let canvasCtx = canvas.getContext("2d");
    analyser.fftSize = 32768;
    var bufferLengthAlt = 2000 * analyser.fftSize / ctx.sampleRate; //analyser.frequencyBinCount;
    var dataArrayAlt = new Uint8Array(bufferLengthAlt);

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    var drawAlt = function() {
        requestAnimationFrame(drawAlt);

        analyser.getByteFrequencyData(dataArrayAlt);

        canvasCtx.drawImage(canvas, 1, 0, WIDTH - 1, HEIGHT, 0, 0, WIDTH - 1, HEIGHT);

        var barWidth = (WIDTH / bufferLengthAlt);
        var x = 0;
        var max = 0;
        var maxFreq = 0;
        for(var i = 0; i < bufferLengthAlt; i++) {
            let mag = dataArrayAlt[i];
            if (max < mag) {
                max = mag;
                maxFreq = i * ctx.sampleRate / analyser.fftSize;
            }

            canvasCtx.fillStyle = 'rgb(' +mag + ','+mag+','+mag+')';
            canvasCtx.fillRect(WIDTH - 1, (1 - i / bufferLengthAlt) * HEIGHT, WIDTH, (1 - (i + 1) / bufferLengthAlt) * HEIGHT);
        }
        document.getElementsByTagName("p")[0].innerText = "max = " + String(maxFreq) + "Hz";
    };

    drawAlt();
}



main();
ReactDOM.render(
    <Hello compiler="TypeScript" framework="React" />,
    document.getElementById("example")
);  