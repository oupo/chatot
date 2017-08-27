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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
var ReactDOM = __webpack_require__(2);
var Hello_1 = __webpack_require__(3);
function main() {
    try {
        var canvas_1 = document.createElement("canvas");
        document.body.appendChild(canvas_1);
        canvas_1.width = 1000;
        canvas_1.height = 500;
        var ctx_1 = new AudioContext();
        var analyser_1 = ctx_1.createAnalyser();
        //analyser.minDecibels = -90;
        //analyser.maxDecibels = -10;
        //analyser.smoothingTimeConstant = 0.85;
        var gainNode_1 = ctx_1.createGain();
        gainNode_1.gain.value = 0;
        navigator.getUserMedia({ audio: true }, function (stream) {
            var source = ctx_1.createMediaStreamSource(stream);
            source.connect(analyser_1);
            source.connect(gainNode_1);
            //gainNode.connect(ctx.destination);
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
    var bufferLengthAlt = 2000 * analyser.fftSize / ctx.sampleRate; //analyser.frequencyBinCount;
    var dataArrayAlt = new Uint8Array(bufferLengthAlt);
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    var drawAlt = function () {
        requestAnimationFrame(drawAlt);
        analyser.getByteFrequencyData(dataArrayAlt);
        canvasCtx.drawImage(canvas, 1, 0, WIDTH - 1, HEIGHT, 0, 0, WIDTH - 1, HEIGHT);
        var barWidth = (WIDTH / bufferLengthAlt);
        var x = 0;
        var max = 0;
        var maxFreq = 0;
        for (var i = 0; i < bufferLengthAlt; i++) {
            var mag = dataArrayAlt[i];
            if (max < mag) {
                max = mag;
                maxFreq = i * ctx.sampleRate / analyser.fftSize;
            }
            canvasCtx.fillStyle = 'rgb(' + mag + ',' + mag + ',' + mag + ')';
            canvasCtx.fillRect(WIDTH - 1, (1 - i / bufferLengthAlt) * HEIGHT, WIDTH, (1 - (i + 1) / bufferLengthAlt) * HEIGHT);
        }
        document.getElementsByTagName("p")[0].innerText = "max = " + String(maxFreq) + "Hz";
    };
    drawAlt();
}
main();
ReactDOM.render(React.createElement(Hello_1.Hello, { compiler: "TypeScript", framework: "React" }), document.getElementById("example"));


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
var Hello = (function (_super) {
    __extends(Hello, _super);
    function Hello() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Hello.prototype.render = function () {
        return React.createElement("h1", null,
            "Hello from ",
            this.props.compiler,
            " and ",
            this.props.framework,
            "!");
    };
    return Hello;
}(React.Component));
exports.Hello = Hello;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map