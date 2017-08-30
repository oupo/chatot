/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function main() {
    try {
        var canvas_1 = document.createElement("canvas");
        document.body.appendChild(canvas_1);
        canvas_1.width = 1000;
        canvas_1.height = 500;
        var ctx_1 = new AudioContext();
        var analyser_1 = ctx_1.createAnalyser();
        //analyser.minDecibels = -90;
        analyser_1.maxDecibels = -50;
        //analyser.smoothingTimeConstant = 0.85;
        var gainNode_1 = ctx_1.createGain();
        gainNode_1.gain.value = 0;
        navigator.getUserMedia({ audio: true }, function (stream) {
            var source = ctx_1.createMediaStreamSource(stream);
            source.connect(analyser_1);
            source.connect(gainNode_1);
            gainNode_1.connect(ctx_1.destination);
            visualize(canvas_1, analyser_1, ctx_1);
        }, function (err) {
            alert(err);
        });
        console.log("ok");
    }
    catch (e) {
        alert(e);
    }
}
function visualize(canvas, analyser, ctx) {
    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;
    var canvasCtx = canvas.getContext("2d");
    analyser.fftSize = 32768;
    var bufferLength = 2000 * analyser.fftSize / ctx.sampleRate; //analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    var bigPointsHist = [];
    var loopCount = 0;
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    var drawAlt = function () {
        requestAnimationFrame(drawAlt);
        analyser.getByteFrequencyData(dataArray);
        if ((loopCount++) % 8 == 0) {
            var bigPoints = retrieveBig(dataArray);
            if (bigPoints.length != 0) {
                if (bigPointsHist.length >= 10) {
                    bigPointsHist.shift();
                }
                bigPointsHist.push(bigPoints);
            }
        }
        canvasCtx.drawImage(canvas, 1, 0, WIDTH - 1, HEIGHT, 0, 0, WIDTH - 1, HEIGHT);
        var max = 0;
        var maxFreq = 0;
        for (var i = 0; i < bufferLength; i++) {
            var mag = dataArray[i];
            if (max < mag) {
                max = mag;
                maxFreq = i * ctx.sampleRate / analyser.fftSize;
            }
            canvasCtx.fillStyle = 'hsl(' + ((1 - mag / 256) * 240) + ',100%,50%)';
            canvasCtx.fillRect(WIDTH - 1, (1 - i / bufferLength) * HEIGHT, WIDTH, (1 - (i + 1) / bufferLength) * HEIGHT);
        }
        document.getElementsByTagName("p")[0].innerText = "max = " + String(maxFreq) + "Hz";
        document.getElementsByTagName("p")[1].innerText = "big points = " + bigPointsHist.map(function (bigPoints) {
            return "[" + bigPoints.map(function (x) { return Math.floor(x * ctx.sampleRate / analyser.fftSize); }).join(", ") + "]";
        }).join(", ");
    };
    drawAlt();
}
function retrieveBig(data) {
    var length = data.length;
    var res = [];
    for (var i = 0; i < length; i++) {
        if (data[i] > 250) {
            if (res.length > 0 && res[res.length - 1][1] == i - 1) {
                var _a = res[res.length - 1], start = _a[0], end = _a[1], repr = _a[2], max = _a[3];
                if (data[i] > max) {
                    max = data[i];
                    repr = i;
                }
                res[res.length - 1] = [start, i, repr, max];
            }
            else {
                res.push([i, i, i, data[i]]);
            }
        }
    }
    return res.map(function (tuple) {
        var start = tuple[0], end = tuple[1], repr = tuple[2], max = tuple[3];
        return repr;
    });
}
main();
/*ReactDOM.render(
    <Hello compiler="TypeScript" framework="React" />,
    document.getElementById("example")
);  */ 


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map