// library : Brass Engine
// version : 0.16.2
// author  : Wyatt Durbano (WD_STEVE)
// required: p5
// optional: p5.sound, matter.js, regl.js

var Brass = (function (exports, p5) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var p5__default = /*#__PURE__*/_interopDefaultLegacy(p5);

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    var arrayConstructors = {
        "any": Array,
        "int8": Int8Array,
        "int16": Int16Array,
        "int32": Int32Array,
        "uint8": Uint8Array,
        "uint16": Uint16Array,
        "uint32": Uint32Array,
        "float32": Float32Array,
        "float64": Float64Array
    };
    function assert(condition, message) {
        if (message === void 0) { message = "Assertion failed"; }
        if (!condition)
            throw Error(message);
    }
    function expect(condition, message) {
        if (message === void 0) { message = "Expectation failed"; }
        if (!condition)
            console.error(message);
    }
    function safeBind(func, thisArg) {
        var argArray = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            argArray[_i - 2] = arguments[_i];
        }
        assert(func.hasOwnProperty("prototype"), "Can't bind context to function (".concat(func.name, "); Use the Function keyword and do not bind before-hand"));
        return func.bind.apply(func, __spreadArray([thisArg], __read(argArray), false));
    }
    function createColor() {
        var colArgs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            colArgs[_i] = arguments[_i];
        }
        return color.apply(void 0, __spreadArray([], __read(colArgs), false));
    }
    function createFastGraphics(width, height, renderer, pInst) {
        return new FastGraphics(width, height, renderer, pInst);
    }
    var FastGraphics = (function (_super) {
        __extends(FastGraphics, _super);
        function FastGraphics(width, height, renderer, pInst) {
            if (renderer === void 0) { renderer = P2D; }
            var _this = this;
            var canvas = document.createElement("canvas");
            _this = _super.call(this, canvas, pInst) || this;
            _this._glAttributes = {};
            applyP5Prototype(_this, pInst);
            _this.canvas = canvas;
            _this.width = width;
            _this.height = height;
            _this._pixelDensity = _this.pInst.pixelDensity();
            if (renderer === WEBGL) {
                _this._renderer = new p5__default["default"].RendererGL(_this.canvas, _this, false);
            }
            else {
                _this._renderer = new p5__default["default"].Renderer2D(_this.canvas, _this, false);
            }
            _this._renderer.resize(width, height);
            _this._renderer._applyDefaults();
            return _this;
        }
        FastGraphics.prototype.reset = function () {
            this._renderer.resetMatrix();
            if (this._renderer.isP3D) {
                this._renderer._update();
            }
        };
        FastGraphics.prototype.remove = function () {
            for (var elt_ev in this._events) {
                this.elt.removeEventListener(elt_ev, this._events[elt_ev]);
            }
        };
        return FastGraphics;
    }(p5__default["default"].Element));
    function applyP5Prototype(obj, pInst) {
        obj.pInst = (pInst !== null && pInst !== void 0 ? pInst : window);
        for (var p in p5__default["default"].prototype) {
            if (obj[p])
                continue;
            if (typeof p5__default["default"].prototype[p] === "function") {
                obj[p] = p5__default["default"].prototype[p].bind(obj);
            }
            else {
                obj[p] = p5__default["default"].prototype[p];
            }
        }
        p5__default["default"].prototype._initializeInstanceVariables.apply(obj);
        return obj;
    }
    var Pool = (function () {
        function Pool(initalSize, limited, generator, cleaner) {
            this.pool = Array(initalSize).fill(null).map(generator);
            this.limited = limited;
            this.generator = generator;
            this.cleaner = cleaner !== null && cleaner !== void 0 ? cleaner : (function (obj) { return obj; });
        }
        Pool.prototype.get = function () {
            if (this.pool.length <= 0) {
                if (this.limited) {
                    throw Error("Limited pool ran out of objects");
                }
                return this.generator();
            }
            return this.cleaner(this.pool.pop());
        };
        Pool.prototype.release = function (obj) {
            this.pool.push(obj);
        };
        Object.defineProperty(Pool.prototype, "size", {
            get: function () {
                return this.pool.length;
            },
            enumerable: false,
            configurable: true
        });
        return Pool;
    }());
    var HeapAbstract = (function () {
        function HeapAbstract(data, compare) {
            if (data === void 0) { data = []; }
            if (compare === undefined)
                throw Error("Heap was expecting a compare function");
            this.data = data;
            this.compare = compare;
            if (this.data.length > 1)
                this.sort();
            return this;
        }
        HeapAbstract.prototype.insert = function (value) {
            this.data.push(value);
            this.siftUp(this.size - 1);
            return this;
        };
        HeapAbstract.prototype.remove = function (index) {
            if (index === void 0) { index = 0; }
            if (this.size === 0)
                return undefined;
            if (this.size === 1)
                return this.data.pop();
            if (this.data.length <= index)
                return undefined;
            this.swap(index, this.data.length - 1);
            var value = this.data.pop();
            this.siftDown(index);
            return value;
        };
        HeapAbstract.prototype.top = function () {
            return this.data[0];
        };
        HeapAbstract.prototype.sort = function () {
            for (var i = this.size - 1; i >= 0; i--) {
                this.siftDown(i);
            }
            return this;
        };
        HeapAbstract.prototype.log = function () {
            var fillChar = "\u00A0";
            var rows = Math.floor(Math.log2(this.size) + 1);
            var rowLength = Math.pow(2, rows - 1) * 4 - 1;
            var output = [];
            for (var r = 0, i = 0; r < rows; r++) {
                var cols = Math.pow(2, r);
                var str_1 = fillChar.repeat((Math.pow(2, rows - r - 1) - 1) * 2);
                var topStr = str_1;
                for (var c = 0; c < cols; c++) {
                    var dataStr = String(this.data[i]).substr(0, 3);
                    if (dataStr.length === 3)
                        str_1 += dataStr;
                    else if (dataStr.length === 2)
                        str_1 += fillChar + dataStr;
                    else if (dataStr.length === 1)
                        str_1 += fillChar + dataStr + fillChar;
                    else
                        str_1 += "???";
                    if (c % 2) {
                        topStr += "\\" + fillChar.repeat(2);
                    }
                    else {
                        topStr += fillChar.repeat(2) + "/";
                    }
                    i++;
                    if (i >= this.size)
                        break;
                    if (c + 1 < cols) {
                        var interStr = fillChar.repeat((Math.pow(2, rows - r) - 1) * 2 - 1);
                        str_1 += interStr;
                        topStr += interStr;
                    }
                }
                if (r > 0) {
                    output.push(topStr.padEnd(rowLength, fillChar));
                }
                output.push(str_1.padEnd(rowLength, fillChar));
            }
            console.log(output.join("\n"));
            return this;
        };
        HeapAbstract.prototype.siftUp = function (index) {
            if (index === 0)
                return this;
            var parentIndex = this.parent(index);
            if (!this.compare(this.data[index], this.data[parentIndex]))
                return this;
            this.swap(index, parentIndex)
                .siftUp(parentIndex);
            return this;
        };
        HeapAbstract.prototype.siftDown = function (index) {
            var leftIndex = this.childLeft(index);
            var rightIndex = this.childRight(index);
            if (rightIndex >= this.size) {
                if (leftIndex < this.size &&
                    this.compare(this.data[leftIndex], this.data[index])) {
                    this.swap(index, leftIndex);
                }
                return this;
            }
            if (this.compare(this.data[leftIndex], this.data[rightIndex])) {
                if (this.compare(this.data[leftIndex], this.data[index])) {
                    this.swap(index, leftIndex)
                        .siftDown(leftIndex);
                }
            }
            else {
                if (this.compare(this.data[rightIndex], this.data[index])) {
                    this.swap(index, rightIndex)
                        .siftDown(rightIndex);
                }
            }
            return this;
        };
        HeapAbstract.prototype.parent = function (index) {
            return (index - 1) >> 1;
        };
        HeapAbstract.prototype.childLeft = function (index) {
            return (index << 1) + 1;
        };
        HeapAbstract.prototype.childRight = function (index) {
            return (index << 1) + 2;
        };
        Object.defineProperty(HeapAbstract.prototype, "size", {
            get: function () {
                return this.data.length;
            },
            enumerable: false,
            configurable: true
        });
        return HeapAbstract;
    }());
    var Heap = (function (_super) {
        __extends(Heap, _super);
        function Heap() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Heap.prototype.swap = function (indexA, indexB) {
            var aValue = this.data[indexA];
            this.data[indexA] = this.data[indexB];
            this.data[indexB] = aValue;
            return this;
        };
        return Heap;
    }(HeapAbstract));
    var MappedHeap = (function (_super) {
        __extends(MappedHeap, _super);
        function MappedHeap(data, compare) {
            if (data === void 0) { data = []; }
            var _this = _super.call(this, [], compare) || this;
            _this.map = new Map();
            for (var i = 0; i < _this.data.length; i++) {
                _this.map.set(_this.data[i], i);
            }
            _this.data = data;
            if (_this.data.length > 1)
                _this.sort();
            return _this;
        }
        MappedHeap.prototype.insert = function (value) {
            if (this.map.get(value) !== undefined) {
                this.removeValue(value);
            }
            this.map.set(value, this.data.length);
            _super.prototype.insert.call(this, value);
            return this;
        };
        MappedHeap.prototype.removeValue = function (value) {
            var index = this.map.get(value);
            if (index === undefined)
                return undefined;
            _super.prototype.remove.call(this, index);
            this.map.delete(value);
            return value;
        };
        MappedHeap.prototype.swap = function (indexA, indexB) {
            var aValue = this.data[indexA];
            var bValue = this.data[indexB];
            this.data[indexA] = bValue;
            this.map.set(bValue, indexA);
            this.data[indexB] = aValue;
            this.map.set(aValue, indexB);
            return this;
        };
        return MappedHeap;
    }(HeapAbstract));
    var MaxHeap = (function (_super) {
        __extends(MaxHeap, _super);
        function MaxHeap(data) {
            return _super.call(this, data, function (a, b) { return a > b; }) || this;
        }
        return MaxHeap;
    }(Heap));
    var MinHeap = (function (_super) {
        __extends(MinHeap, _super);
        function MinHeap(data) {
            return _super.call(this, data, function (a, b) { return a < b; }) || this;
        }
        return MinHeap;
    }(Heap));
    var MappedMaxHeap = (function (_super) {
        __extends(MappedMaxHeap, _super);
        function MappedMaxHeap(data) {
            return _super.call(this, data, function (a, b) { return a > b; }) || this;
        }
        return MappedMaxHeap;
    }(MappedHeap));
    var MappedMinHeap = (function (_super) {
        __extends(MappedMinHeap, _super);
        function MappedMinHeap(data) {
            return _super.call(this, data, function (a, b) { return a < b; }) || this;
        }
        return MappedMinHeap;
    }(MappedHeap));
    function createDynamicArray(type, size) {
        var constructor = getArrayConstructor(type);
        return new constructor(size);
    }
    function cloneDynamicArray(resultType, data) {
        var _a;
        var constructor = getArrayConstructor(resultType);
        if (resultType === "any") {
            return new ((_a = constructor).bind.apply(_a, __spreadArray([void 0], __read(data), false)))();
        }
        else {
            return new constructor(data);
        }
    }
    function encodeDynamicTypedArray(data) {
        var raw = new Uint8Array(data.buffer);
        var binary = [];
        for (var i = 0; i < raw.byteLength; i++) {
            binary.push(String.fromCharCode(raw[i]));
        }
        return btoa(binary.join(""));
    }
    function decodeDynamicTypedArray(type, base64) {
        var binary = window.atob(base64);
        var raw = new Uint8Array(binary.length);
        for (var i = 0; i < raw.byteLength; i++) {
            raw[i] = binary.charCodeAt(i);
        }
        return createDynamicTypedArray(type, raw.buffer);
    }
    function createDynamicTypedArray(type, buffer) {
        var constructor = getArrayConstructor(type);
        return new constructor(buffer);
    }
    function getArrayConstructor(type) {
        var constructor = arrayConstructors[type];
        if (constructor === undefined) {
            throw Error("Can't find type (".concat(type, ") array constructor"));
        }
        return constructor;
    }

    var Vector2 = (function () {
        function Vector2(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        Vector2.fromObj = function (obj) {
            if (typeof obj.x !== "number" || typeof obj.y !== "number") {
                throw Error("Object can't be transformed into Vector2 without numeric x and y properties");
            }
            return new Vector2(obj.x, obj.y);
        };
        Vector2.fromObjFast = function (obj) {
            return new Vector2(obj.x, obj.y);
        };
        Vector2.fromDir = function (dir) {
            return new Vector2(Math.cos(dir), Math.sin(dir));
        };
        Vector2.fromDirMag = function (dir, mag) {
            return new Vector2(mag * Math.cos(dir), mag * Math.sin(dir));
        };
        Vector2.prototype.copy = function () {
            return new Vector2(this.x, this.y);
        };
        Vector2.prototype.equal = function (vec) {
            return this.x === vec.x && this.y === vec.y;
        };
        Vector2.prototype.set = function (vec) {
            this.x = vec.x;
            this.y = vec.y;
            return this;
        };
        Vector2.prototype.setScalar = function (x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = x; }
            this.x = x;
            this.y = y;
            return this;
        };
        Vector2.prototype.add = function (vec) {
            this.x += vec.x;
            this.y += vec.y;
            return this;
        };
        Vector2.prototype.addScalar = function (x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = x; }
            this.x += x;
            this.y += y;
            return this;
        };
        Vector2.prototype.sub = function (vec) {
            this.x -= vec.x;
            this.y -= vec.y;
            return this;
        };
        Vector2.prototype.subScalar = function (x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = x; }
            this.x -= x;
            this.y -= y;
            return this;
        };
        Vector2.prototype.mult = function (vec) {
            this.x *= vec.x;
            this.y *= vec.y;
            return this;
        };
        Vector2.prototype.multScalar = function (x, y) {
            if (x === void 0) { x = 1; }
            if (y === void 0) { y = x; }
            this.x *= x;
            this.y *= y;
            return this;
        };
        Vector2.prototype.div = function (vec) {
            this.x /= vec.x;
            this.y /= vec.y;
            return this;
        };
        Vector2.prototype.divScalar = function (x, y) {
            if (x === void 0) { x = 1; }
            if (y === void 0) { y = x; }
            this.x /= x;
            this.y /= y;
            return this;
        };
        Vector2.prototype.rem = function (vec) {
            this.x %= vec.x;
            this.y %= vec.y;
            return this;
        };
        Vector2.prototype.remScalar = function (x, y) {
            if (x === void 0) { x = 1; }
            if (y === void 0) { y = x; }
            this.x %= x;
            this.y %= y;
            return this;
        };
        Vector2.prototype.mod = function (vec) {
            this.x = ((this.x % vec.x) + vec.x) % vec.x;
            this.y = ((this.y % vec.y) + vec.y) % vec.y;
            return this;
        };
        Vector2.prototype.modScalar = function (x, y) {
            if (x === void 0) { x = 1; }
            if (y === void 0) { y = x; }
            this.x = ((this.x % x) + x) % x;
            this.y = ((this.y % y) + y) % y;
            return this;
        };
        Vector2.prototype.abs = function () {
            this.x = Math.abs(this.x);
            this.y = Math.abs(this.y);
            return this;
        };
        Vector2.prototype.floor = function () {
            this.x = Math.floor(this.x);
            this.y = Math.floor(this.y);
            return this;
        };
        Vector2.prototype.round = function () {
            this.x = Math.round(this.x);
            this.y = Math.round(this.y);
            return this;
        };
        Vector2.prototype.ceil = function () {
            this.x = Math.ceil(this.x);
            this.y = Math.ceil(this.y);
            return this;
        };
        Vector2.prototype.mix = function (vec, amount) {
            this.x = this.x + (vec.x - this.x) * amount;
            this.y = this.y + (vec.y - this.y) * amount;
            return this;
        };
        Vector2.prototype.norm = function (magnitude) {
            if (magnitude === void 0) { magnitude = 1; }
            var mag = this.mag;
            if (mag === 0)
                return this;
            var multiplier = magnitude / mag;
            this.x *= multiplier;
            this.y *= multiplier;
            return this;
        };
        Vector2.prototype.normArea = function (targetArea) {
            if (targetArea === void 0) { targetArea = 1; }
            var area = this.area;
            if (area === 0)
                return this;
            var multiplier = Math.sqrt(targetArea / area);
            this.x *= multiplier;
            this.y *= multiplier;
            return this;
        };
        Vector2.prototype.limit = function (limit) {
            if (limit === void 0) { limit = 1; }
            if (this.mag > limit)
                this.norm(limit);
            return this;
        };
        Vector2.prototype.setAngle = function (angle) {
            var mag = this.mag;
            this.x = Math.cos(angle) * mag;
            this.y = Math.sin(angle) * mag;
            return this;
        };
        Vector2.prototype.angleTo = function (vec) {
            return Math.atan2(vec.y - this.y, vec.x - this.x);
        };
        Vector2.prototype.angleBetween = function (vec) {
            var cosAngleBetween = (this.x * vec.x + this.y * vec.y) /
                (Math.hypot(this.x, this.y) * Math.hypot(vec.x, vec.y));
            return Math.acos(Math.max(0, Math.min(1, cosAngleBetween)));
        };
        Vector2.prototype.rotate = function (angle) {
            var cosAngle = Math.cos(angle);
            var sinAngle = Math.sin(angle);
            var x = this.x * cosAngle - this.y * sinAngle;
            this.y = this.x * sinAngle + this.y * cosAngle;
            this.x = x;
            return this;
        };
        Vector2.prototype.dot = function (vec) {
            return this.x * vec.x + this.y * vec.y;
        };
        Vector2.prototype.cross = function (vec) {
            var x = this.x * vec.y + this.y * vec.y;
            var y = vec.y * this.x - vec.x - this.y;
            this.x = x;
            this.y = y;
        };
        Vector2.prototype.dist = function (vec) {
            return Math.hypot(this.x - vec.x, this.y - vec.y);
        };
        Vector2.prototype.distSq = function (vec) {
            var distX = this.x - vec.x, distY = this.y - vec.y;
            return distX * distX + distY * distY;
        };
        Object.defineProperty(Vector2.prototype, "mag", {
            get: function () {
                return Math.hypot(this.x, this.y);
            },
            set: function (magnitude) {
                this.norm(magnitude);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Vector2.prototype, "magSq", {
            get: function () {
                return this.x * this.x + this.y * this.y;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Vector2.prototype, "area", {
            get: function () {
                return this.x * this.y;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Vector2.prototype, "angle", {
            get: function () {
                return Math.atan2(this.y, this.x);
            },
            set: function (angle) {
                this.setAngle(angle);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Vector2.prototype, "array", {
            get: function () {
                return [this.x, this.y];
            },
            set: function (arr) {
                this.x = arr[0];
                this.y = arr[1];
            },
            enumerable: false,
            configurable: true
        });
        return Vector2;
    }());
    var Vector3 = (function () {
        function Vector3(x, y, z) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = x; }
            if (z === void 0) { z = y; }
            this.x = x;
            this.y = y;
            this.z = z;
        }
        Vector3.fromObj = function (obj) {
            if (typeof obj.x !== "number" || typeof obj.y !== "number" || typeof obj.z !== "number") {
                throw Error("Object can't be transformed into Vector3 without numeric x, y and z properties");
            }
            return new Vector3(obj.x, obj.y, obj.z);
        };
        Vector3.fromObjFast = function (obj) {
            return new Vector3(obj.x, obj.y, obj.z);
        };
        Vector3.prototype.copy = function () {
            return new Vector3(this.x, this.y, this.z);
        };
        Vector3.prototype.equal = function (vec) {
            return this.x === vec.x && this.y === vec.y && this.z === vec.z;
        };
        Vector3.prototype.set = function (vec) {
            this.x = vec.x;
            this.y = vec.y;
            this.z = vec.z;
            return this;
        };
        Vector3.prototype.setScalar = function (x, y, z) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = x; }
            if (z === void 0) { z = y; }
            this.x = x;
            this.y = y;
            this.z = z;
            return this;
        };
        Vector3.prototype.add = function (vec) {
            this.x += vec.x;
            this.y += vec.y;
            this.z += vec.z;
            return this;
        };
        Vector3.prototype.addScalar = function (x, y, z) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = x; }
            if (z === void 0) { z = y; }
            this.x += x;
            this.y += y;
            this.z += z;
            return this;
        };
        Vector3.prototype.sub = function (vec) {
            this.x -= vec.x;
            this.y -= vec.y;
            this.z -= vec.z;
            return this;
        };
        Vector3.prototype.subScalar = function (x, y, z) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = x; }
            if (z === void 0) { z = y; }
            this.x -= x;
            this.y -= y;
            this.z -= z;
            return this;
        };
        Vector3.prototype.mult = function (vec) {
            this.x *= vec.x;
            this.y *= vec.y;
            this.z *= vec.z;
            return this;
        };
        Vector3.prototype.multScalar = function (x, y, z) {
            if (x === void 0) { x = 1; }
            if (y === void 0) { y = x; }
            if (z === void 0) { z = y; }
            this.x *= x;
            this.y *= y;
            this.z *= z;
            return this;
        };
        Vector3.prototype.div = function (vec) {
            this.x /= vec.x;
            this.y /= vec.y;
            this.z /= vec.z;
            return this;
        };
        Vector3.prototype.divScalar = function (x, y, z) {
            if (x === void 0) { x = 1; }
            if (y === void 0) { y = x; }
            if (z === void 0) { z = y; }
            this.x /= x;
            this.y /= y;
            this.z /= z;
            return this;
        };
        Vector3.prototype.rem = function (vec) {
            this.x %= vec.x;
            this.y %= vec.y;
            this.z %= vec.z;
            return this;
        };
        Vector3.prototype.remScalar = function (x, y, z) {
            if (x === void 0) { x = 1; }
            if (y === void 0) { y = x; }
            if (z === void 0) { z = y; }
            this.x %= x;
            this.y %= y;
            this.z %= z;
            return this;
        };
        Vector3.prototype.mod = function (vec) {
            this.x = ((this.x % vec.x) + vec.x) % vec.x;
            this.y = ((this.y % vec.y) + vec.y) % vec.y;
            this.z = ((this.z % vec.z) + vec.z) % vec.z;
            return this;
        };
        Vector3.prototype.modScalar = function (x, y, z) {
            if (x === void 0) { x = 1; }
            if (y === void 0) { y = x; }
            if (z === void 0) { z = y; }
            this.x = ((this.x % x) + x) % x;
            this.y = ((this.y % y) + y) % y;
            this.z = ((this.z % z) + z) % z;
            return this;
        };
        Vector3.prototype.abs = function () {
            this.x = Math.abs(this.x);
            this.y = Math.abs(this.y);
            this.z = Math.abs(this.z);
            return this;
        };
        Vector3.prototype.floor = function () {
            this.x = Math.floor(this.x);
            this.y = Math.floor(this.y);
            this.z = Math.floor(this.z);
            return this;
        };
        Vector3.prototype.round = function () {
            this.x = Math.round(this.x);
            this.y = Math.round(this.y);
            this.z = Math.round(this.z);
            return this;
        };
        Vector3.prototype.ceil = function () {
            this.x = Math.ceil(this.x);
            this.y = Math.ceil(this.y);
            this.z = Math.ceil(this.z);
            return this;
        };
        Vector3.prototype.mix = function (vec, amount) {
            this.x = this.x + (vec.x - this.x) * amount;
            this.y = this.y + (vec.y - this.y) * amount;
            this.z = this.z + (vec.y - this.z) * amount;
            return this;
        };
        Vector3.prototype.norm = function (magnitude) {
            if (magnitude === void 0) { magnitude = 1; }
            var mag = this.mag;
            if (mag === 0)
                return this;
            var multiplier = magnitude / mag;
            this.x *= multiplier;
            this.y *= multiplier;
            this.z *= multiplier;
            return this;
        };
        Vector3.prototype.limit = function (limit) {
            if (limit === void 0) { limit = 1; }
            if (this.mag > limit)
                this.norm(limit);
            return this;
        };
        Vector3.prototype.dot = function (vec) {
            return this.x * vec.x + this.y * vec.y + this.z * vec.z;
        };
        Vector3.prototype.cross = function (vec) {
            this.x = this.y * vec.z - this.z * vec.y;
            this.y = this.z * vec.x - this.x * vec.z;
            this.z = this.x * vec.y - this.y * vec.x;
            return this;
        };
        Vector3.prototype.dist = function (vec) {
            var resultX = this.x - vec.x, resultY = this.y - vec.y, resultZ = this.z - vec.z;
            return Math.sqrt(resultX * resultX + resultY * resultY + resultZ * resultZ);
        };
        Vector3.prototype.distSq = function (vec) {
            var resultX = this.x - vec.x, resultY = this.y - vec.y, resultZ = this.z - vec.z;
            return resultX * resultX + resultY * resultY + resultZ * resultZ;
        };
        Object.defineProperty(Vector3.prototype, "xy", {
            get: function () {
                return new Vector2(this.x, this.y);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Vector3.prototype, "yx", {
            get: function () {
                return new Vector2(this.y, this.x);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Vector3.prototype, "yz", {
            get: function () {
                return new Vector2(this.y, this.z);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Vector3.prototype, "zy", {
            get: function () {
                return new Vector2(this.z, this.y);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Vector3.prototype, "xz", {
            get: function () {
                return new Vector2(this.x, this.z);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Vector3.prototype, "zx", {
            get: function () {
                return new Vector2(this.z, this.x);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Vector3.prototype, "xyz", {
            get: function () {
                return new Vector3(this.x, this.y, this.z);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Vector3.prototype, "yxz", {
            get: function () {
                return new Vector3(this.y, this.x, this.z);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Vector3.prototype, "yzx", {
            get: function () {
                return new Vector3(this.y, this.z, this.x);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Vector3.prototype, "zyx", {
            get: function () {
                return new Vector3(this.z, this.y, this.x);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Vector3.prototype, "xzy", {
            get: function () {
                return new Vector3(this.x, this.z, this.y);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Vector3.prototype, "zxy", {
            get: function () {
                return new Vector3(this.z, this.x, this.y);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Vector3.prototype, "mag", {
            get: function () {
                return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
            },
            set: function (magnitude) {
                this.norm(magnitude);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Vector3.prototype, "magSq", {
            get: function () {
                return this.x * this.x + this.y * this.y + this.z * this.z;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Vector3.prototype, "array", {
            get: function () {
                return [this.x, this.y, this.z];
            },
            set: function (arr) {
                this.x = arr[0];
                this.y = arr[1];
                this.z = arr[2];
            },
            enumerable: false,
            configurable: true
        });
        return Vector3;
    }());
    function watchedVectorMethod(method) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var oldX = this.x, oldY = this.y, oldZ = this.z;
        var result = method.call.apply(method, __spreadArray([this], __read(args), false));
        if (this.x !== oldX || this.y !== oldY || this.z !== oldZ) {
            this.watcher(this);
        }
        return result;
    }
    var watchedVectorHandler = {
        get: function (target, prop) {
            var value = Reflect.get(target, prop);
            if (typeof value === "function") {
                return watchedVectorMethod.bind(target, value);
            }
            return value;
        },
        set: function (target, prop, value) {
            var success = Reflect.set(target, prop, value);
            if (!success)
                return false;
            target.watcher(target);
            return true;
        },
    };
    function watchVector(vector, watcher) {
        vector.watcher = watcher;
        return new Proxy(vector, watchedVectorHandler);
    }

    var inputDeviceMap = new Map();
    var inputMappers = [];
    var deriverCatalogue = new Map();
    var gamepadLinks = [];
    function init$5() {
        window.addEventListener("gamepadconnected", handleGamepadConnected);
        window.addEventListener("gamepaddisconnected", handleGamepadDisconnected);
        deriverCatalogue.set("movement", function (mapper) {
            var movement = new Vector2();
            if (mapper.has("keyboard")) {
                if (mapper.button.get("keyboardS") || mapper.button.get("keyboardArrowDown")) {
                    movement.addScalar(0, 1);
                }
                if (mapper.button.get("keyboardA") || mapper.button.get("keyboardArrowLeft")) {
                    movement.addScalar(-1, 0);
                }
                if (mapper.button.get("keyboardD") || mapper.button.get("keyboardArrowRight")) {
                    movement.addScalar(1, 0);
                }
                if (mapper.button.get("keyboardW") || mapper.button.get("keyboardArrowUp")) {
                    movement.addScalar(0, -1);
                }
                if (movement.mag > 0)
                    movement.norm(1);
            }
            if (mapper.has("gamepad")) {
                if (mapper.button.get("gamepadDpadDown")) {
                    movement.addScalar(0, 1);
                }
                if (mapper.button.get("gamepadDpadLeft")) {
                    movement.addScalar(-1, 0);
                }
                if (mapper.button.get("gamepadDpadRight")) {
                    movement.addScalar(1, 0);
                }
                if (mapper.button.get("gamepadDpadUp")) {
                    movement.addScalar(0, -1);
                }
                if (movement.mag > 0) {
                    movement.norm(1);
                }
                else {
                    movement.set(mapper.vector.get("gamepadStickLeft"));
                }
            }
            mapper.vector.setSafe("movement", movement);
        });
        deriverCatalogue.set("actionA", function (mapper) {
            var actionA = false;
            if (mapper.has("keyboard")) {
                actionA || (actionA = mapper.button.get("keyboardE"));
                actionA || (actionA = mapper.button.get("keyboardShiftLeft"));
            }
            if (mapper.has("mouse")) {
                actionA || (actionA = mapper.button.get("mouseLeft"));
            }
            if (mapper.has("gamepad")) {
                actionA || (actionA = mapper.button.get("gamepadFaceRight"));
            }
            mapper.button.setSafe("actionA", actionA);
        });
        deriverCatalogue.set("actionB", function (mapper) {
            var actionB = false;
            if (mapper.has("keyboard")) {
                actionB || (actionB = mapper.button.get("keyboardQ"));
                actionB || (actionB = mapper.button.get("keyboardR"));
                actionB || (actionB = mapper.button.get("keyboardF"));
            }
            if (mapper.has("mouse")) {
                actionB || (actionB = mapper.button.get("mouseRight"));
            }
            if (mapper.has("gamepad")) {
                actionB || (actionB = mapper.button.get("gamepadFaceDown"));
            }
            mapper.button.setSafe("actionB", actionB);
        });
        deriverCatalogue.set("actionC", function (mapper) {
            var actionC = false;
            if (mapper.has("keyboard")) {
                actionC || (actionC = mapper.button.get("keyboardSpace"));
            }
            if (mapper.has("mouse")) {
                actionC || (actionC = mapper.button.get("mouseCenter"));
            }
            if (mapper.has("gamepad")) {
                actionC || (actionC = mapper.button.get("gamepadFaceUp"));
                actionC || (actionC = mapper.button.get("gamepadFaceLeft"));
            }
            mapper.button.setSafe("actionC", actionC);
        });
    }
    function disableContextMenu() {
        window.addEventListener("contextmenu", function (event) { return event.preventDefault(); });
    }
    function handleGamepadConnected(event) {
        var e_1, _a;
        var gamepad = event.gamepad;
        if (gamepad.mapping !== "standard") {
            alert("Browser couldn't find standard mapping for gamepad, it has been ignored.");
            return;
        }
        try {
            for (var gamepadLinks_1 = __values(gamepadLinks), gamepadLinks_1_1 = gamepadLinks_1.next(); !gamepadLinks_1_1.done; gamepadLinks_1_1 = gamepadLinks_1.next()) {
                var gamepadLink = gamepadLinks_1_1.value;
                if (gamepadLink.user) {
                    if (gamepadLink.gamepad) {
                        if (gamepad.index === gamepadLink.gamepad.index) {
                            gamepadLink.gamepad = gamepad;
                            gamepadLink.user.gamepad = gamepad;
                            return;
                        }
                    }
                    else {
                        gamepadLink.gamepad = gamepad;
                        gamepadLink.user.gamepad = gamepad;
                        return;
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (gamepadLinks_1_1 && !gamepadLinks_1_1.done && (_a = gamepadLinks_1.return)) _a.call(gamepadLinks_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        gamepadLinks.push({
            gamepad: event.gamepad,
            user: null
        });
    }
    function handleGamepadDisconnected(event) {
        var e_2, _a;
        var gamepad = event.gamepad;
        try {
            for (var gamepadLinks_2 = __values(gamepadLinks), gamepadLinks_2_1 = gamepadLinks_2.next(); !gamepadLinks_2_1.done; gamepadLinks_2_1 = gamepadLinks_2.next()) {
                var gamepadLink = gamepadLinks_2_1.value;
                if (gamepadLink.gamepad && gamepadLink.user) {
                    if (gamepad.index === gamepadLink.gamepad.index) {
                        gamepadLink.user.gamepad = null;
                        return;
                    }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (gamepadLinks_2_1 && !gamepadLinks_2_1.done && (_a = gamepadLinks_2.return)) _a.call(gamepadLinks_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
    function update$6() {
        var e_3, _a, e_4, _b, e_5, _c, e_6, _d;
        var gamepads = navigator.getGamepads();
        try {
            for (var gamepads_1 = __values(gamepads), gamepads_1_1 = gamepads_1.next(); !gamepads_1_1.done; gamepads_1_1 = gamepads_1.next()) {
                var gamepad = gamepads_1_1.value;
                if (!gamepad)
                    continue;
                try {
                    for (var gamepadLinks_3 = (e_4 = void 0, __values(gamepadLinks)), gamepadLinks_3_1 = gamepadLinks_3.next(); !gamepadLinks_3_1.done; gamepadLinks_3_1 = gamepadLinks_3.next()) {
                        var gamepadLink = gamepadLinks_3_1.value;
                        if (!gamepadLink.user || !gamepadLink.gamepad)
                            continue;
                        if (gamepadLink.gamepad.index !== gamepad.index)
                            continue;
                        gamepadLink.gamepad = gamepad;
                        gamepadLink.user.gamepad = gamepad;
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (gamepadLinks_3_1 && !gamepadLinks_3_1.done && (_b = gamepadLinks_3.return)) _b.call(gamepadLinks_3);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (gamepads_1_1 && !gamepads_1_1.done && (_a = gamepads_1.return)) _a.call(gamepads_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        try {
            for (var _e = __values(inputDeviceMap.values()), _f = _e.next(); !_f.done; _f = _e.next()) {
                var input_1 = _f.value;
                input_1.update();
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_c = _e.return)) _c.call(_e);
            }
            finally { if (e_5) throw e_5.error; }
        }
        try {
            for (var inputMappers_1 = __values(inputMappers), inputMappers_1_1 = inputMappers_1.next(); !inputMappers_1_1.done; inputMappers_1_1 = inputMappers_1.next()) {
                var inputMap = inputMappers_1_1.value;
                inputMap.update();
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (inputMappers_1_1 && !inputMappers_1_1.done && (_d = inputMappers_1.return)) _d.call(inputMappers_1);
            }
            finally { if (e_6) throw e_6.error; }
        }
    }
    function getInputDevice(name) {
        var device = inputDeviceMap.get(name);
        if (device)
            return device;
        switch (name) {
            default:
                if (name.startsWith("gamepad")) {
                    device = new GamepadInputDevice();
                }
                else {
                    throw Error("Unknown input device (".concat(name, ")"));
                }
                break;
            case "keyboard":
                device = new KeyboardInputDevice();
                break;
            case "mouse":
                device = new MouseInputDevice();
                break;
        }
        inputDeviceMap.set(name, device);
        return device;
    }
    var InputDeviceAbstract = (function () {
        function InputDeviceAbstract(devicePrefix, buttonList, axisList, vectorList) {
            var e_7, _a, e_8, _b, e_9, _c;
            this.buttonStateChanges = new Map();
            this.axisStateChanges = new Map();
            this.vectorStateChanges = new Map();
            this.buttonState = new Map();
            this.axisState = new Map();
            this.vectorState = new Map();
            this.devicePrefix = devicePrefix;
            try {
                for (var buttonList_1 = __values(buttonList), buttonList_1_1 = buttonList_1.next(); !buttonList_1_1.done; buttonList_1_1 = buttonList_1.next()) {
                    var button = buttonList_1_1.value;
                    this.buttonState.set(button, false);
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (buttonList_1_1 && !buttonList_1_1.done && (_a = buttonList_1.return)) _a.call(buttonList_1);
                }
                finally { if (e_7) throw e_7.error; }
            }
            try {
                for (var axisList_1 = __values(axisList), axisList_1_1 = axisList_1.next(); !axisList_1_1.done; axisList_1_1 = axisList_1.next()) {
                    var axis = axisList_1_1.value;
                    this.axisState.set(axis, 0);
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (axisList_1_1 && !axisList_1_1.done && (_b = axisList_1.return)) _b.call(axisList_1);
                }
                finally { if (e_8) throw e_8.error; }
            }
            try {
                for (var vectorList_1 = __values(vectorList), vectorList_1_1 = vectorList_1.next(); !vectorList_1_1.done; vectorList_1_1 = vectorList_1.next()) {
                    var axis = vectorList_1_1.value;
                    this.vectorState.set(axis, new Vector2(0, 0));
                }
            }
            catch (e_9_1) { e_9 = { error: e_9_1 }; }
            finally {
                try {
                    if (vectorList_1_1 && !vectorList_1_1.done && (_c = vectorList_1.return)) _c.call(vectorList_1);
                }
                finally { if (e_9) throw e_9.error; }
            }
        }
        InputDeviceAbstract.prototype.applyState = function (mapper) {
            var e_10, _a, e_11, _b, e_12, _c;
            try {
                for (var _d = __values(this.buttonState.entries()), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var _f = __read(_e.value, 2), name_1 = _f[0], value = _f[1];
                    mapper.button.add(this.devicePrefix + name_1, value);
                }
            }
            catch (e_10_1) { e_10 = { error: e_10_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                }
                finally { if (e_10) throw e_10.error; }
            }
            try {
                for (var _g = __values(this.axisState.entries()), _h = _g.next(); !_h.done; _h = _g.next()) {
                    var _j = __read(_h.value, 2), name_2 = _j[0], value = _j[1];
                    mapper.axis.add(this.devicePrefix + name_2, value);
                }
            }
            catch (e_11_1) { e_11 = { error: e_11_1 }; }
            finally {
                try {
                    if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
                }
                finally { if (e_11) throw e_11.error; }
            }
            try {
                for (var _k = __values(this.vectorState.entries()), _l = _k.next(); !_l.done; _l = _k.next()) {
                    var _m = __read(_l.value, 2), name_3 = _m[0], value = _m[1];
                    mapper.vector.add(this.devicePrefix + name_3, value);
                }
            }
            catch (e_12_1) { e_12 = { error: e_12_1 }; }
            finally {
                try {
                    if (_l && !_l.done && (_c = _k.return)) _c.call(_k);
                }
                finally { if (e_12) throw e_12.error; }
            }
        };
        InputDeviceAbstract.prototype.applyStateChange = function (mapper) {
            var e_13, _a, e_14, _b, e_15, _c;
            try {
                for (var _d = __values(this.buttonStateChanges.entries()), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var _f = __read(_e.value, 2), name_4 = _f[0], value = _f[1];
                    mapper.button.set(this.devicePrefix + name_4, value);
                }
            }
            catch (e_13_1) { e_13 = { error: e_13_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                }
                finally { if (e_13) throw e_13.error; }
            }
            this.buttonStateChanges.clear();
            try {
                for (var _g = __values(this.axisStateChanges.entries()), _h = _g.next(); !_h.done; _h = _g.next()) {
                    var _j = __read(_h.value, 2), name_5 = _j[0], value = _j[1];
                    mapper.axis.set(this.devicePrefix + name_5, value);
                }
            }
            catch (e_14_1) { e_14 = { error: e_14_1 }; }
            finally {
                try {
                    if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
                }
                finally { if (e_14) throw e_14.error; }
            }
            this.axisStateChanges.clear();
            try {
                for (var _k = __values(this.vectorStateChanges.entries()), _l = _k.next(); !_l.done; _l = _k.next()) {
                    var _m = __read(_l.value, 2), name_6 = _m[0], value = _m[1];
                    mapper.vector.set(this.devicePrefix + name_6, value);
                }
            }
            catch (e_15_1) { e_15 = { error: e_15_1 }; }
            finally {
                try {
                    if (_l && !_l.done && (_c = _k.return)) _c.call(_k);
                }
                finally { if (e_15) throw e_15.error; }
            }
            this.vectorStateChanges.clear();
        };
        InputDeviceAbstract.prototype.clearState = function () {
            var e_16, _a, e_17, _b, e_18, _c;
            try {
                for (var _d = __values(this.buttonState.keys()), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var name_7 = _e.value;
                    this.setButton(name_7, false);
                }
            }
            catch (e_16_1) { e_16 = { error: e_16_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                }
                finally { if (e_16) throw e_16.error; }
            }
            try {
                for (var _f = __values(this.axisState.keys()), _g = _f.next(); !_g.done; _g = _f.next()) {
                    var name_8 = _g.value;
                    this.setAxis(name_8, 0);
                }
            }
            catch (e_17_1) { e_17 = { error: e_17_1 }; }
            finally {
                try {
                    if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                }
                finally { if (e_17) throw e_17.error; }
            }
            try {
                for (var _h = __values(this.vectorState.keys()), _j = _h.next(); !_j.done; _j = _h.next()) {
                    var name_9 = _j.value;
                    this.setVector(name_9, { x: 0, y: 0 });
                }
            }
            catch (e_18_1) { e_18 = { error: e_18_1 }; }
            finally {
                try {
                    if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
                }
                finally { if (e_18) throw e_18.error; }
            }
        };
        InputDeviceAbstract.prototype.setButton = function (name, value) {
            if (!this.buttonState.has(name))
                return;
            if (this.buttonState.get(name) === value)
                return;
            this.buttonState.set(name, value);
            this.buttonStateChanges.set(name, value);
        };
        InputDeviceAbstract.prototype.setAxis = function (name, value) {
            if (!this.axisState.has(name))
                return;
            if (this.axisState.get(name) === value)
                return;
            this.axisState.set(name, value);
            this.axisStateChanges.set(name, value);
        };
        InputDeviceAbstract.prototype.setVector = function (name, value) {
            if (!this.vectorState.has(name))
                return;
            var vector = Vector2.fromObjFast(value);
            if (vector.equal(this.vectorState.get(name)))
                return;
            this.vectorState.set(name, vector);
            this.vectorStateChanges.set(name, vector);
        };
        return InputDeviceAbstract;
    }());
    var KeyboardInputDevice = (function (_super) {
        __extends(KeyboardInputDevice, _super);
        function KeyboardInputDevice() {
            var _this = _super.call(this, "keyboard", ["A", "AltLeft", "AltRight", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowUp", "B", "Backspace", "Backquote", "Backslash", "BracketLeft", "BracketRight", "C", "Comma", "ControlLeft", "ControlRight", "D", "Delete", "Digit0", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "E", "Enter", "Equal", "Escape", "F", "F1", "F10", "F11", "F12", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "G", "H", "I", "J", "K", "L", "M", "MetaLeft", "MetaRight", "Minus", "N", "Numpad0", "Numpad1", "Numpad2", "Numpad3", "Numpad4", "Numpad5", "Numpad6", "Numpad7", "Numpad8", "Numpad9", "NumpadAdd", "NumpadDecimal", "NumpadDivide", "NumpadEnter", "NumpadMultiply", "NumpadSubtract", "O", "P", "Period", "Q", "Quote", "R", "S", "Semicolon", "ShiftLeft", "ShiftRight", "Slash", "Space", "T", "U", "V", "W", "X", "Y", "Z"], [], []) || this;
            window.addEventListener("keydown", _this.handleKeyListener.bind(_this, true));
            window.addEventListener("keyup", _this.handleKeyListener.bind(_this, false));
            return _this;
        }
        KeyboardInputDevice.prototype.update = function () { };
        KeyboardInputDevice.prototype.handleKeyListener = function (state, _a) {
            var code = _a.code;
            if (code.startsWith("Key"))
                code = code.substring(3, Infinity);
            this.setButton(code, state);
        };
        return KeyboardInputDevice;
    }(InputDeviceAbstract));
    var MouseInputDevice = (function (_super) {
        __extends(MouseInputDevice, _super);
        function MouseInputDevice() {
            var _this = _super.call(this, "mouse", ["Left", "Center", "Right"], [], []) || this;
            window.addEventListener("mousedown", _this.handleKeyListener.bind(_this, true));
            window.addEventListener("mouseup", _this.handleKeyListener.bind(_this, false));
            return _this;
        }
        MouseInputDevice.prototype.update = function () { };
        MouseInputDevice.prototype.handleKeyListener = function (state, event) {
            switch (event.button) {
                case 0:
                    this.setButton("Left", state);
                    break;
                case 1:
                    this.setButton("Center", state);
                    event.preventDefault();
                    break;
                case 2:
                    this.setButton("Right", state);
                    break;
            }
        };
        return MouseInputDevice;
    }(InputDeviceAbstract));
    var GamepadInputDevice = (function (_super) {
        __extends(GamepadInputDevice, _super);
        function GamepadInputDevice() {
            var e_19, _a;
            var _this = _super.call(this, "gamepad", ["DpadDown", "DpadLeft", "DpadRight", "DpadUp", "FaceDown", "FaceLeft", "FaceRight", "FaceUp", "ControlLeft", "ControlRight", "ShoulderLeft", "ShoulderRight", "TriggerLeft", "TriggerRight", "StickLeft", "StickRight", "Meta"], ["ShoulderLeft", "ShoulderRight", "TriggerLeft", "TriggerRight"], ["StickLeft", "StickRight"]) || this;
            _this.deadZone = 0.1;
            try {
                for (var gamepadLinks_4 = __values(gamepadLinks), gamepadLinks_4_1 = gamepadLinks_4.next(); !gamepadLinks_4_1.done; gamepadLinks_4_1 = gamepadLinks_4.next()) {
                    var gamepadLink = gamepadLinks_4_1.value;
                    if (!gamepadLink.user && gamepadLink.gamepad) {
                        gamepadLink.user = _this;
                        _this.gamepad = gamepadLink.gamepad;
                        return _this;
                    }
                }
            }
            catch (e_19_1) { e_19 = { error: e_19_1 }; }
            finally {
                try {
                    if (gamepadLinks_4_1 && !gamepadLinks_4_1.done && (_a = gamepadLinks_4.return)) _a.call(gamepadLinks_4);
                }
                finally { if (e_19) throw e_19.error; }
            }
            gamepadLinks.push({
                gamepad: null,
                user: _this
            });
            _this.gamepad = null;
            return _this;
        }
        GamepadInputDevice.prototype.update = function () {
            if (!this.gamepad) {
                this.clearState();
                return;
            }
            var buttons = this.gamepad.buttons;
            this.setButton("DpadDown", buttons[13].pressed);
            this.setButton("DpadLeft", buttons[14].pressed);
            this.setButton("DpadRight", buttons[15].pressed);
            this.setButton("DpadUp", buttons[12].pressed);
            this.setButton("FaceDown", buttons[0].pressed);
            this.setButton("FaceLeft", buttons[2].pressed);
            this.setButton("FaceRight", buttons[1].pressed);
            this.setButton("FaceUp", buttons[3].pressed);
            this.setButton("ControlLeft", buttons[8].pressed);
            this.setButton("ControlRight", buttons[9].pressed);
            this.setButton("ShoulderLeft", buttons[4].pressed);
            this.setButton("ShoulderRight", buttons[5].pressed);
            this.setButton("TriggerLeft", buttons[6].pressed);
            this.setButton("TriggerRight", buttons[7].pressed);
            this.setButton("StickLeft", buttons[10].pressed);
            this.setButton("StickRight", buttons[11].pressed);
            this.setButton("Meta", buttons[16].pressed);
            this.setAxis("ShoulderLeft", buttons[4].value);
            this.setAxis("ShoulderRight", buttons[5].value);
            this.setAxis("TriggerLeft", buttons[6].value);
            this.setAxis("TriggerRight", buttons[7].value);
            var axis = this.gamepad.axes;
            var stickLeft = new Vector2(axis[0], axis[1]);
            var stickRight = new Vector2(axis[2], axis[3]);
            this.processStick(stickLeft);
            this.processStick(stickRight);
            this.setVector("StickLeft", stickLeft);
            this.setVector("StickRight", stickRight);
        };
        GamepadInputDevice.prototype.processStick = function (position) {
            if (position.mag === 0)
                return;
            var absX = Math.abs(position.x), absY = Math.abs(position.y);
            var squareEdge;
            if (absX > absY) {
                squareEdge = position.copy().divScalar(absX);
            }
            else {
                squareEdge = position.copy().divScalar(absY);
            }
            position.divScalar(squareEdge.mag);
            if (position.mag < this.deadZone)
                position.setScalar(0, 0);
        };
        return GamepadInputDevice;
    }(InputDeviceAbstract));
    var InputState = (function () {
        function InputState(unitName) {
            this.state = new Map();
            this.unitName = unitName;
        }
        InputState.prototype.has = function (name) {
            return this.state.has(name);
        };
        InputState.prototype.get = function (name) {
            assert(this.state.has(name), "Can't get unknown ".concat(this.unitName, " (").concat(name, ")"));
            return this.state.get(name);
        };
        InputState.prototype.setSafe = function (name, value) {
            if (this.state.has(name))
                this.set(name, value);
            else
                this.add(name, value);
        };
        InputState.prototype.set = function (name, value) {
            assert(this.state.has(name), "Can't set unknown ".concat(this.unitName, " (").concat(name, ")"));
            this.state.set(name, value);
        };
        InputState.prototype.add = function (name, value) {
            this.state.set(name, value);
        };
        return InputState;
    }());
    var ButtonInputState = (function (_super) {
        __extends(ButtonInputState, _super);
        function ButtonInputState(unitName) {
            var _this = _super.call(this, unitName) || this;
            _this.unions = new Map();
            _this.nextResolves = [];
            return _this;
        }
        ButtonInputState.prototype.update = function () {
            var e_20, _a;
            try {
                for (var _b = __values(this.unions.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var name_10 = _c.value;
                    this.updateUnion(name_10);
                }
            }
            catch (e_20_1) { e_20 = { error: e_20_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_20) throw e_20.error; }
            }
        };
        ButtonInputState.prototype.setSafe = function (name, value) {
            if (this.state.has(name))
                this.set(name, value);
            else
                this.add(name, value);
        };
        ButtonInputState.prototype.set = function (name, value) {
            assert(this.state.has(name), "Can't set unknown ".concat(this.unitName));
            if (value) {
                var currentValue = this.state.get(name);
                if (!currentValue) {
                    var resolve = this.nextResolves.shift();
                    if (resolve)
                        resolve(name);
                }
            }
            this.state.set(name, value);
        };
        ButtonInputState.prototype.next = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2, new Promise(function (resolve) {
                            _this.nextResolves.push(resolve);
                        })];
                });
            });
        };
        ButtonInputState.prototype.updateUnion = function (unionName) {
            var _this = this;
            var union = this.unions.get(unionName);
            var unionState = Object.fromEntries(union.map(function (name) { return [
                name,
                _this.state.get(name)
            ]; }));
            this.set(unionName, this.joinUnion(unionState));
        };
        ButtonInputState.prototype.joinUnion = function (state) {
            var values = Object.values(state);
            if (values.length === 0)
                return false;
            return values.reduce(function (a, b) { return a && b; });
        };
        ButtonInputState.prototype.setAvailableUnion = function (unionName, names) {
            var e_21, _a;
            var availableNames = [];
            try {
                for (var names_1 = __values(names), names_1_1 = names_1.next(); !names_1_1.done; names_1_1 = names_1.next()) {
                    var name_11 = names_1_1.value;
                    if (this.has(name_11))
                        availableNames.push(name_11);
                }
            }
            catch (e_21_1) { e_21 = { error: e_21_1 }; }
            finally {
                try {
                    if (names_1_1 && !names_1_1.done && (_a = names_1.return)) _a.call(names_1);
                }
                finally { if (e_21) throw e_21.error; }
            }
            this.setUnion(unionName, availableNames);
        };
        ButtonInputState.prototype.setUnion = function (unionName, names) {
            var e_22, _a;
            try {
                for (var names_2 = __values(names), names_2_1 = names_2.next(); !names_2_1.done; names_2_1 = names_2.next()) {
                    var name_12 = names_2_1.value;
                    assert(this.state.has(name_12), "Can't make union with unknown ".concat(this.unitName));
                    assert(this.unions.has(name_12), "Can't make union with union ".concat(this.unitName));
                }
            }
            catch (e_22_1) { e_22 = { error: e_22_1 }; }
            finally {
                try {
                    if (names_2_1 && !names_2_1.done && (_a = names_2.return)) _a.call(names_2);
                }
                finally { if (e_22) throw e_22.error; }
            }
            this.unions.set(unionName, names);
            this.add(unionName, undefined);
            this.updateUnion(unionName);
        };
        return ButtonInputState;
    }(InputState));
    var InputMapper = (function () {
        function InputMapper(devices, derivers) {
            var e_23, _a, e_24, _b, e_25, _c;
            if (devices === void 0) { devices = ["keyboard", "mouse", "gamepad"]; }
            this.button = new ButtonInputState("button");
            this.axis = new InputState("axis");
            this.vector = new InputState("vector");
            this.devices = [];
            this.derivers = [];
            try {
                for (var devices_1 = __values(devices), devices_1_1 = devices_1.next(); !devices_1_1.done; devices_1_1 = devices_1.next()) {
                    var deviceName = devices_1_1.value;
                    var device = getInputDevice(deviceName);
                    this.devices.push(device);
                    device.applyState(this);
                }
            }
            catch (e_23_1) { e_23 = { error: e_23_1 }; }
            finally {
                try {
                    if (devices_1_1 && !devices_1_1.done && (_a = devices_1.return)) _a.call(devices_1);
                }
                finally { if (e_23) throw e_23.error; }
            }
            if (!derivers)
                derivers = ["movement", "actionA", "actionB", "actionC"];
            try {
                for (var derivers_1 = __values(derivers), derivers_1_1 = derivers_1.next(); !derivers_1_1.done; derivers_1_1 = derivers_1.next()) {
                    var deriver = derivers_1_1.value;
                    if (typeof deriver === "function") {
                        this.derivers.push(deriver);
                    }
                    else {
                        var foundDeriver = deriverCatalogue.get(deriver);
                        if (!foundDeriver)
                            throw Error("Can't find input deriver named (".concat(deriver, ")"));
                        this.derivers.push(foundDeriver);
                    }
                }
            }
            catch (e_24_1) { e_24 = { error: e_24_1 }; }
            finally {
                try {
                    if (derivers_1_1 && !derivers_1_1.done && (_b = derivers_1.return)) _b.call(derivers_1);
                }
                finally { if (e_24) throw e_24.error; }
            }
            try {
                for (var _d = __values(this.derivers), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var deriver = _e.value;
                    deriver(this);
                }
            }
            catch (e_25_1) { e_25 = { error: e_25_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_c = _d.return)) _c.call(_d);
                }
                finally { if (e_25) throw e_25.error; }
            }
            inputMappers.push(this);
        }
        InputMapper.prototype.update = function () {
            var e_26, _a, e_27, _b;
            try {
                for (var _c = __values(this.devices), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var device = _d.value;
                    device.applyStateChange(this);
                }
            }
            catch (e_26_1) { e_26 = { error: e_26_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_26) throw e_26.error; }
            }
            this.button.update();
            try {
                for (var _e = __values(this.derivers), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var deriver = _f.value;
                    deriver(this);
                }
            }
            catch (e_27_1) { e_27 = { error: e_27_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                }
                finally { if (e_27) throw e_27.error; }
            }
        };
        InputMapper.prototype.has = function (devicePrefix) {
            var e_28, _a;
            try {
                for (var _b = __values(this.devices), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var device = _c.value;
                    if (device.devicePrefix === devicePrefix) {
                        return true;
                    }
                }
            }
            catch (e_28_1) { e_28 = { error: e_28_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_28) throw e_28.error; }
            }
            return false;
        };
        return InputMapper;
    }());

    var drawTargets = new Map();
    var _regl = null;
    var doReglRefresh = false;
    var sketch$1;
    var setWidth = window.innerWidth, setHeight = window.innerHeight;
    function init$4(_sketch, doRegl, drawTarget) {
        sketch$1 = _sketch;
        setWidth = window.innerWidth;
        setHeight = window.innerHeight;
        initDefaultDrawTarget(doRegl, drawTarget);
        if (!hasDrawTarget("default"))
            return;
        resetAndSyncDefaultP5DrawTarget();
        var defaultDrawTarget = getDrawTarget("default");
        displayDrawTarget(defaultDrawTarget);
        if (doRegl) {
            var defaultReglTarget = getDrawTarget("defaultRegl");
            var canvas = defaultReglTarget.getMaps().canvas;
            _regl = createREGL({ canvas: canvas });
        }
    }
    function initDefaultDrawTarget(doRegl, drawTarget) {
        if (drawTarget === undefined) {
            sketch$1.createCanvas(windowWidth, windowHeight);
            var drawTarget_1 = new P5DrawTarget(undefined, sketch$1);
            setDrawTarget("default", drawTarget_1);
            setDrawTarget("defaultP5", drawTarget_1);
        }
        else {
            noCanvas();
            if (drawTarget instanceof DrawTarget) {
                setDrawTarget("default", drawTarget);
                if (drawTarget instanceof P5DrawTarget) {
                    setDrawTarget("defaultP5", drawTarget);
                }
                if (drawTarget instanceof CanvasDrawTarget) {
                    setDrawTarget("defaultRegl", drawTarget);
                }
            }
            else if (drawTarget instanceof p5__default["default"].Graphics) {
                var p5DrawTarget = new P5DrawTarget(undefined, drawTarget);
                setDrawTarget("default", p5DrawTarget);
                setDrawTarget("defaultP5", p5DrawTarget);
            }
            else {
                throw Error("Can't make default drawTarget in Brass.init(), bad value");
            }
        }
        if (doRegl) {
            var drawTarget_2 = new CanvasDrawTarget();
            setDrawTarget("defaultRegl", drawTarget_2);
        }
    }
    function displayDrawTarget(drawTarget) {
        var htmlCanvas;
        if (drawTarget instanceof P5DrawTarget) {
            htmlCanvas = drawTarget.getMaps().canvas.canvas;
        }
        if (drawTarget instanceof CanvasDrawTarget) {
            htmlCanvas = drawTarget.getMaps().canvas;
        }
        if (htmlCanvas) {
            if (sketch$1._userNode) {
                sketch$1._userNode.appendChild(htmlCanvas);
            }
            else {
                if (document.getElementsByTagName("main").length === 0) {
                    var main = document.createElement("main");
                    document.body.appendChild(main);
                }
                document.getElementsByTagName("main")[0].appendChild(htmlCanvas);
            }
            htmlCanvas.style.display = "block";
            return true;
        }
        else {
            return false;
        }
    }
    function setDrawTarget(name, drawTarget) {
        if (hasDrawTarget(name)) {
            throw Error("Can't overwrite (".concat(name, ") DrawTarget"));
        }
        drawTargets.set(name, drawTarget);
    }
    function getDrawTarget(name) {
        var drawTarget = drawTargets.get(name);
        if (drawTarget === undefined) {
            throw Error("Could not find (".concat(name, ") DrawTarget; Maybe create one or run Brass.init() with drawTarget enabled"));
        }
        return drawTarget;
    }
    var hasDrawTarget = drawTargets.has.bind(drawTargets);
    function getP5DrawTarget(name) {
        var drawTarget = getDrawTarget(name);
        if (!(drawTarget instanceof P5DrawTarget)) {
            throw Error("Could not find (".concat(name, ") P5DrawTarget; DrawTarget under that name is not of subclass P5DrawTarget"));
        }
        return drawTarget;
    }
    function getCanvasDrawTarget(name) {
        var drawTarget = getDrawTarget(name);
        if (!(drawTarget instanceof CanvasDrawTarget)) {
            throw Error("Could not find (".concat(name, ") CanvasDrawTarget; DrawTarget under that name is not of subclass CanvasDrawTarget"));
        }
        return drawTarget;
    }
    function resize(width, height) {
        if (width === void 0) { width = window.innerWidth; }
        if (height === void 0) { height = window.innerHeight; }
        setWidth = width;
        setHeight = height;
        getDrawTarget("default").refresh();
        resetAndSyncDefaultP5DrawTarget();
        honorReglRefresh();
    }
    function resetAndSyncDefaultP5DrawTarget() {
        if (hasDrawTarget("defaultP5")) {
            var canvas = getDrawTarget("defaultP5").getMaps().canvas;
            canvas.resetMatrix();
            sketch$1.width = canvas.width;
            sketch$1.height = canvas.height;
        }
    }
    function getRegl() {
        assert(_regl !== null, "Could not access regl; Include regl.js and enable it in Brass.init() first");
        return _regl;
    }
    function refreshRegl() {
        var regl = getRegl();
        regl._refresh();
    }
    function refreshReglFast() {
        getRegl();
        if (doReglRefresh)
            return;
        doReglRefresh = true;
        queueMicrotask(honorReglRefresh);
    }
    function honorReglRefresh() {
        if (!doReglRefresh)
            return;
        var regl = getRegl();
        regl._refresh();
        doReglRefresh = false;
    }
    function displayRegl(d) {
        if (d === void 0) { d = getP5DrawTarget("defaultP5"); }
        getRegl();
        var p5Canvas = d.getMaps().canvas;
        var reglCanvas = getCanvasDrawTarget("defaultRegl").getMaps().canvas;
        p5Canvas.drawingContext.drawImage(reglCanvas, 0, 0, p5Canvas.width, p5Canvas.height);
    }
    var DrawSurfaceAbstract = (function () {
        function DrawSurfaceAbstract(creator, resizer) {
            if (resizer === void 0) { resizer = creator; }
            this.id = Symbol();
            this.creator = creator;
            this.resizer = resizer;
            this.setMaps(null);
        }
        DrawSurfaceAbstract.prototype.hasSize = function () {
            return this.size !== null;
        };
        DrawSurfaceAbstract.prototype.getSize = function (ratio) {
            if (ratio === void 0) { ratio = 1; }
            if (this.size === null)
                this.throwSizeError();
            return {
                x: this.size.x * ratio,
                y: this.size.y * ratio
            };
        };
        DrawSurfaceAbstract.prototype.sizeMaps = function (size) {
            if (this.size === null) {
                this.setMaps(this.creator(size));
            }
            else {
                if (this.size.x === size.x &&
                    this.size.y === size.y)
                    return;
                this.setMaps(this.resizer(size, this.maps));
            }
            this.size = size;
        };
        DrawSurfaceAbstract.prototype.hasName = function (name) {
            if (!hasDrawTarget(name))
                return false;
            return getDrawTarget(name).id === this.id;
        };
        DrawSurfaceAbstract.prototype.setMaps = function (maps) {
            if (maps === null) {
                this.maps === new Proxy({}, { get: this.throwSizeError });
            }
            else {
                this.maps = new Proxy(maps, { get: this.getMap.bind(this) });
            }
        };
        DrawSurfaceAbstract.prototype.getMap = function (maps, mapName) {
            if (!maps.hasOwnProperty(mapName)) {
                throw Error("Can't get (".concat(mapName, ") map in DrawTarget"));
            }
            return maps[mapName];
        };
        DrawSurfaceAbstract.prototype.throwSizeError = function () {
            throw Error("Could not use DrawSurface, size has not been set");
        };
        return DrawSurfaceAbstract;
    }());
    var DrawBuffer = (function (_super) {
        __extends(DrawBuffer, _super);
        function DrawBuffer(creator, resizer) {
            if (resizer === void 0) { resizer = creator; }
            var _this = _super.call(this, creator, resizer) || this;
            _this.size = null;
            return _this;
        }
        DrawBuffer.prototype.getMaps = function (size) {
            if (size === undefined) {
                if (this.size === null)
                    this.throwSizeError();
            }
            else {
                this.sizeMaps(size);
            }
            return this.maps;
        };
        return DrawBuffer;
    }(DrawSurfaceAbstract));
    var DrawTarget = (function (_super) {
        __extends(DrawTarget, _super);
        function DrawTarget(creator, resizer, sizer) {
            if (resizer === void 0) { resizer = creator; }
            if (sizer === void 0) { sizer = defaultMatchSizer; }
            var _this = _super.call(this, creator, resizer) || this;
            _this.sizer = sizer;
            _this.size = _this.getSizerResult();
            _this.setMaps(_this.creator(_this.size));
            return _this;
        }
        DrawTarget.prototype.setSizer = function (sizer) {
            this.sizer = sizer;
            this.refresh();
        };
        DrawTarget.prototype.getMaps = function () {
            return this.maps;
        };
        DrawTarget.prototype.refresh = function (causes) {
            var e_1, _a, e_2, _b;
            if (causes === void 0) { causes = []; }
            var size = this.getSizerResult();
            if (this.size !== undefined && this.size.x === size.x && this.size.y === size.y)
                return;
            try {
                for (var causes_1 = __values(causes), causes_1_1 = causes_1.next(); !causes_1_1.done; causes_1_1 = causes_1.next()) {
                    var cause = causes_1_1.value;
                    if (cause !== this.id)
                        continue;
                    throw Error("Resize of DrawTarget caused itself to resize; Loop in sizer dependency chain");
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (causes_1_1 && !causes_1_1.done && (_a = causes_1.return)) _a.call(causes_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            this.sizeMaps(size);
            try {
                for (var _c = __values(drawTargets.values()), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var drawTarget = _d.value;
                    if (drawTarget.id === this.id)
                        continue;
                    drawTarget.refresh(causes.concat(this.id));
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                }
                finally { if (e_2) throw e_2.error; }
            }
        };
        DrawTarget.prototype.getSizerResult = function () {
            var floatSize = this.sizer(this);
            return {
                x: Math.floor(floatSize.x),
                y: Math.floor(floatSize.y)
            };
        };
        return DrawTarget;
    }(DrawSurfaceAbstract));
    var P5DrawBuffer = (function (_super) {
        __extends(P5DrawBuffer, _super);
        function P5DrawBuffer(arg) {
            if (arg === void 0) { arg = P2D; }
            return _super.call(this, function (_a) {
                var x = _a.x, y = _a.y;
                if (typeof arg === "string") {
                    return { canvas: createFastGraphics(x, y, arg) };
                }
                else {
                    if (arg.width !== x || arg.height !== y) {
                        arg.resizeCanvas(x, y, true);
                    }
                    return { canvas: arg };
                }
            }, function (_a, _b) {
                var x = _a.x, y = _a.y;
                var canvas = _b.canvas;
                canvas.resizeCanvas(x, y, true);
                return { canvas: canvas };
            }) || this;
        }
        return P5DrawBuffer;
    }(DrawBuffer));
    var P5DrawTarget = (function (_super) {
        __extends(P5DrawTarget, _super);
        function P5DrawTarget(sizer, arg) {
            if (sizer === void 0) { sizer = defaultMatchSizer; }
            if (arg === void 0) { arg = P2D; }
            return _super.call(this, function (_a) {
                var x = _a.x, y = _a.y;
                if (typeof arg === "string") {
                    return { canvas: createFastGraphics(x, y, arg) };
                }
                else {
                    if (arg.width !== x || arg.height !== y) {
                        arg.resizeCanvas(x, y, true);
                    }
                    return { canvas: arg };
                }
            }, function (_a, _b) {
                var x = _a.x, y = _a.y;
                var canvas = _b.canvas;
                canvas.resizeCanvas(x, y, true);
                return { canvas: canvas };
            }, sizer) || this;
        }
        return P5DrawTarget;
    }(DrawTarget));
    var CanvasDrawTarget = (function (_super) {
        __extends(CanvasDrawTarget, _super);
        function CanvasDrawTarget(sizer) {
            if (sizer === void 0) { sizer = defaultMatchSizer; }
            return _super.call(this, function (_a) {
                var x = _a.x, y = _a.y;
                var canvas = document.createElement("CANVAS");
                canvas.width = x;
                canvas.height = y;
                return { canvas: canvas };
            }, function (_a, _b) {
                var x = _a.x, y = _a.y;
                var canvas = _b.canvas;
                canvas.width = x;
                canvas.height = y;
                refreshReglFast();
                return { canvas: canvas };
            }, sizer) || this;
        }
        return CanvasDrawTarget;
    }(DrawTarget));
    function defaultMatchSizer(self) {
        if (!hasDrawTarget("default") || self.hasName("default")) {
            return { x: setWidth, y: setHeight };
        }
        return getDrawTarget("default").getSize();
    }

    var _a;
    var AssetType;
    (function (AssetType) {
        AssetType["Image"] = "image";
        AssetType["Sound"] = "sound";
        AssetType["World"] = "world";
    })(AssetType || (AssetType = {}));
    var assetTypeExtensions = (_a = {},
        _a[AssetType.Image] = new Set([".png", ".jpg", ".jpeg", ".gif", ".tif", ".tiff"]),
        _a[AssetType.Sound] = new Set([".mp3", ".wav", ".ogg"]),
        _a[AssetType.World] = new Set([".json"]),
        _a);
    var assets = {};
    var loadQueue = [];
    var useSound = false;
    var inited$2 = false;
    var soundFormatsConfigured = false;
    var unsafeWorld = false;
    var totalLateAssets = 0;
    var loadingAssets = 0;
    var loadedLateAssets = 0;
    var errorImage;
    var errorSound;
    function init$3(_useSound) {
        useSound = _useSound;
        errorImage = createFastGraphics(64, 64);
        errorImage.background(0);
        errorImage.fill(255, 0, 255);
        errorImage.noStroke();
        errorImage.rect(0, 0, 32, 32);
        errorImage.rect(32, 32, 32, 32);
        if (useSound) {
            errorSound = new p5__default["default"].SoundFile();
            var audioCtx = getAudioContext();
            var bufferData = new Array(11025).fill(0).map(function (_, i) { return Math.sin(i * 0.356); });
            var audioBuffer = audioCtx.createBuffer(1, bufferData.length, 44100);
            audioBuffer.getChannelData(0).set(bufferData);
            errorSound.buffer = audioBuffer;
            errorSound.panner.inputChannels(audioBuffer.numberOfChannels);
        }
        inited$2 = true;
        loadQueuedAssets();
    }
    function enforceInit$2(action) {
        if (inited$2)
            return;
        throw Error("Brass loader must be initialized before ".concat(action, "; Run Brass.init()"));
    }
    function enforceP5SoundPresent(action) {
        if (useSound === true)
            return;
        throw Error("Sound must enabled in Brass.init() before ".concat(action));
    }
    function loadAssetLate() {
        var assets = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            assets[_i] = arguments[_i];
        }
        loadQueue.push.apply(loadQueue, __spreadArray([], __read(assets), false));
        queueMicrotask(loadQueuedAssets);
    }
    function loadQueuedAssets() {
        var assetEntry = loadQueue.shift();
        if (!inited$2)
            return;
        if (loadingAssets >= 2)
            return;
        if (loaded()) {
            totalLateAssets = 0;
            loadedLateAssets = 0;
        }
        if (assetEntry === undefined)
            return;
        loadingAssets++;
        switch (assetEntry.type) {
            default:
                throw Error("Unknown asset type (".concat(assetEntry.type, ")"));
            case AssetType.Image:
                loadImage(assetEntry.path, handleAsset.bind(globalThis, assetEntry), handleAssetFail.bind(globalThis, assetEntry));
                break;
            case AssetType.Sound:
                loadSound(assetEntry.path, handleAsset.bind(globalThis, assetEntry), handleAssetFail.bind(globalThis, assetEntry));
                break;
            case AssetType.World:
                loadJSON(assetEntry.path, handleAsset.bind(globalThis, assetEntry), handleAssetFail.bind(globalThis, assetEntry));
                break;
        }
        queueMicrotask(loadQueuedAssets);
    }
    function handleAsset(assetEntry, data) {
        var e_1, _a;
        if (assetEntry.late) {
            loadedLateAssets++;
        }
        loadingAssets--;
        if (assetEntry.type === AssetType.World) {
            expect(assetEntry.fields !== undefined);
            data = parseWorldJson(assetEntry.fields, data);
        }
        try {
            for (var _b = __values(assetEntry.names), _c = _b.next(); !_c.done; _c = _b.next()) {
                var name_1 = _c.value;
                assets[name_1] = data;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (assetEntry.resolve) {
            assetEntry.resolve(data);
        }
        if ("children" in assetEntry && assetEntry.children.length > 0) {
            loadAssetLate.apply(void 0, __spreadArray([], __read(assetEntry.children), false));
        }
        else {
            queueMicrotask(loadQueuedAssets);
        }
    }
    function handleAssetFail(assetEntry) {
        if (assetEntry.late) {
            loadedLateAssets++;
        }
        loadingAssets--;
        var error = Error("Failed to load asset (".concat(assetEntry.names[0], ") at path (").concat(assetEntry.path, ")"));
        if (assetEntry.reject) {
            assetEntry.reject(error);
        }
        else {
            throw error;
        }
    }
    function loaded() {
        return loadProgress() >= 1;
    }
    function loadFraction() {
        return "".concat(loadedLateAssets, " / ").concat(totalLateAssets);
    }
    function loadProgress() {
        if (totalLateAssets === 0)
            return 1;
        return loadedLateAssets / totalLateAssets;
    }
    function loadImageEarly() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a = parseAssetDefinition(AssetType.Image, args), name = _a.name, fullPath = _a.fullPath;
        return queueEarlyAssetWithPromise(fullPath, name, loadImage);
    }
    function loadImageLate() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a = parseAssetDefinition(AssetType.Image, args), name = _a.name, fullPath = _a.fullPath;
        return queueLateAssetWithPromise({
            type: AssetType.Image,
            path: fullPath,
            names: [name],
            late: true,
            children: []
        });
    }
    function loadImageDynamic(qualitySteps) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var assetDefinition = parseAssetDefinition(AssetType.Image, args);
        if (typeof qualitySteps === "number") {
            if (qualitySteps < 2 || qualitySteps > 5) {
                throw Error("expected 2 to 5 dynamic image quality steps, found (".concat(qualitySteps, ")"));
            }
            qualitySteps = ["_FULL", "_HALF", "_QUARTER", "_EIGHTH", "_SIXTEENTH"].slice(0, qualitySteps);
        }
        var promises = loadImageDynamicStep(qualitySteps, assetDefinition).promises;
        return promises;
    }
    function loadImageDynamicStep(qualitySteps, assetDefinition, isRoot) {
        if (isRoot === void 0) { isRoot = true; }
        var stepPostfix = qualitySteps.pop();
        if (stepPostfix === undefined)
            return {
                promises: []
            };
        var _a = loadImageDynamicStep(qualitySteps, assetDefinition, false), childAsset = _a.asset, promises = _a.promises;
        var name = assetDefinition.name, basePath = assetDefinition.basePath, extension = assetDefinition.extension;
        var asset = {
            type: AssetType.Image,
            path: basePath + stepPostfix + extension,
            names: [
                name,
                name + stepPostfix
            ],
            late: isRoot,
            children: []
        };
        if (isRoot)
            totalLateAssets++;
        if (childAsset !== undefined) {
            asset.children = [childAsset];
        }
        promises.push(new Promise(function (resolve, reject) {
            asset.resolve = resolve;
            asset.reject = reject;
            if (isRoot) {
                loadAssetLate(asset);
            }
        }));
        return {
            asset: asset,
            promises: promises
        };
    }
    function getImage(name) {
        enforceInit$2("getting images");
        var image = assets[name];
        if (image)
            return image;
        return errorImage;
    }
    function loadSoundEarly() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a = parseAssetDefinition(AssetType.Sound, args), name = _a.name, fullPath = _a.fullPath;
        insureSoundFormatsConfigured();
        return queueEarlyAssetWithPromise(fullPath, name, loadSound);
    }
    function loadSoundLate() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a = parseAssetDefinition(AssetType.Sound, args), name = _a.name, fullPath = _a.fullPath;
        insureSoundFormatsConfigured();
        return queueLateAssetWithPromise({
            type: AssetType.Sound,
            path: fullPath,
            names: [name],
            late: true,
            children: []
        });
    }
    function getSound(name) {
        enforceInit$2("getting sounds");
        enforceP5SoundPresent("getting sounds");
        var sound = assets[name];
        return sound !== null && sound !== void 0 ? sound : errorSound;
    }
    function insureSoundFormatsConfigured() {
        if (soundFormatsConfigured)
            return;
        try {
            var soundExtensions = Array.from(assetTypeExtensions[AssetType.Sound])
                .map(function (extension) { return extension.replace(".", ""); });
            soundFormats.apply(void 0, __spreadArray([], __read(soundExtensions), false));
            soundFormatsConfigured = true;
        }
        catch (err) { }
    }
    function enableUnsafeWorldLoading() {
        unsafeWorld = true;
    }
    function loadWorldEarly(fields) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var _a = parseAssetDefinition(AssetType.World, args), name = _a.name, fullPath = _a.fullPath;
        return new Promise(function (resolve, reject) {
            loadJSON(fullPath, function (data) {
                var world = parseWorldJson(fields, data);
                assets[name] = world;
                resolve(world);
            }, reject);
        });
    }
    function loadWorldLate(fields) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var _a = parseAssetDefinition(AssetType.World, args), name = _a.name, fullPath = _a.fullPath;
        return queueLateAssetWithPromise({
            type: AssetType.World,
            path: fullPath,
            names: [name],
            late: true,
            children: [],
            fields: fields
        });
    }
    function getWorld(name) {
        enforceInit$2("getting worlds");
        var world = assets[name];
        return world !== null && world !== void 0 ? world : null;
    }
    function parseWorldJson(fields, json) {
        var e_2, _a, e_3, _b, e_4, _c, e_5, _d, e_6, _e;
        if (json.type !== "map") {
            throw Error("World file was not of type \"map\"");
        }
        if (!unsafeWorld) {
            if (json.version < 1.4) {
                throw Error("World file version was not 1.4; Run enableUnsafeWorldLoading() to ignore this");
            }
            if (json.infinite !== false) {
                throw Error("World file may be infinite; Run enableUnsafeWorldLoading() to ignore this");
            }
            if (json.orientation !== "orthogonal") {
                throw Error("World file was not orthogonal; Run enableUnsafeWorldLoading() to ignore this");
            }
            if (json.renderorder !== "right-down") {
                throw Error("World file was not rendered right down; Run enableUnsafeWorldLoading() to ignore this");
            }
        }
        var _f = __read(searchTiledObj(json), 2), tileLayers = _f[0], objectLayers = _f[1];
        var world = {
            width: json.width,
            height: json.height,
            objects: [],
            fields: {},
            tilesets: {}
        };
        var _loop_1 = function (fieldName) {
            var fieldType = fields[fieldName];
            if (fieldType === "sparse") {
                throw Error("World file had sparse type in field declaration; This is not supported");
            }
            var layerIndex = tileLayers.findIndex(function (layer) { return layer.name === fieldName; });
            if (layerIndex === -1) {
                throw Error("World file did not have layer named (".concat(fieldName, ") like in the field decleration"));
            }
            var layer = tileLayers[layerIndex];
            if (!unsafeWorld) {
                if (layer.compression !== "" && layer.compression !== undefined) {
                    throw Error("World file has compression; Run enableUnsafeWorldLoading() to ignore this");
                }
                if (layer.encoding !== "base64" && layer.encoding !== undefined) {
                    throw Error("World file has unknown encoding (".concat(layer.encoding, "); Run enableUnsafeWorldLoading() to ignore this"));
                }
            }
            if (layer.encoding === "base64") {
                world.fields[fieldName] = {
                    type: fieldType,
                    data: layer.data,
                    encoding: "uint32"
                };
            }
            else {
                world.fields[fieldName] = {
                    type: fieldType,
                    data: layer.data
                };
            }
        };
        for (var fieldName in fields) {
            _loop_1(fieldName);
        }
        if (objectLayers.length > 0) {
            if (objectLayers.length > 1 && !unsafeWorld) {
                throw Error("World file had multiple object layers; Run enableUnsafeWorldLoading() to combine them");
            }
            try {
                for (var objectLayers_1 = __values(objectLayers), objectLayers_1_1 = objectLayers_1.next(); !objectLayers_1_1.done; objectLayers_1_1 = objectLayers_1.next()) {
                    var layer = objectLayers_1_1.value;
                    try {
                        for (var _g = (e_3 = void 0, __values(layer.objects)), _h = _g.next(); !_h.done; _h = _g.next()) {
                            var object = _h.value;
                            world.objects.push(object);
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (objectLayers_1_1 && !objectLayers_1_1.done && (_a = objectLayers_1.return)) _a.call(objectLayers_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        try {
            for (var _j = __values(json.tilesets), _k = _j.next(); !_k.done; _k = _j.next()) {
                var tileset = _k.value;
                var tilesetName = tileset.name;
                world.tilesets[tilesetName] = {
                    firstId: tileset.firstgid,
                    tiles: {}
                };
                if (!Array.isArray(tileset.tiles))
                    continue;
                try {
                    for (var _l = (e_5 = void 0, __values(tileset.tiles)), _m = _l.next(); !_m.done; _m = _l.next()) {
                        var tile = _m.value;
                        var tileId = tile.id;
                        world.tilesets[tilesetName].tiles[tileId] = {};
                        if (!Array.isArray(tile.properties))
                            continue;
                        try {
                            for (var _o = (e_6 = void 0, __values(tile.properties)), _p = _o.next(); !_p.done; _p = _o.next()) {
                                var property = _p.value;
                                world.tilesets[tilesetName].tiles[tileId][property.name] = property.value;
                            }
                        }
                        catch (e_6_1) { e_6 = { error: e_6_1 }; }
                        finally {
                            try {
                                if (_p && !_p.done && (_e = _o.return)) _e.call(_o);
                            }
                            finally { if (e_6) throw e_6.error; }
                        }
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (_m && !_m.done && (_d = _l.return)) _d.call(_l);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_k && !_k.done && (_c = _j.return)) _c.call(_j);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return world;
    }
    function searchTiledObj(obj) {
        var e_7, _a;
        var tileLayers = [], objectLayers = [];
        if (obj.type === "map" || obj.type === "group") {
            try {
                for (var _b = __values(obj.layers), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var subObj = _c.value;
                    var _d = __read(searchTiledObj(subObj), 2), newTileLayers = _d[0], newObjectLayers = _d[1];
                    tileLayers.push.apply(tileLayers, __spreadArray([], __read(newTileLayers), false));
                    objectLayers.push.apply(objectLayers, __spreadArray([], __read(newObjectLayers), false));
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_7) throw e_7.error; }
            }
        }
        else if (obj.type === "tilelayer") {
            tileLayers.push(obj);
        }
        else if (obj.type === "objectgroup") {
            objectLayers.push(obj);
        }
        else if (!unsafeWorld) {
            throw Error("World file has unknown layer type (".concat(obj.type, "); Run enableUnsafeWorldLoading() to ignore this"));
        }
        return [tileLayers, objectLayers];
    }
    function queueEarlyAssetWithPromise(path, name, loader) {
        return new Promise(function (resolve, reject) {
            loader(path, function (data) {
                assets[name] = data;
                resolve(data);
            }, reject);
        });
    }
    function queueLateAssetWithPromise(assetEntry) {
        totalLateAssets++;
        return new Promise(function (resolve, reject) {
            assetEntry.resolve = resolve;
            assetEntry.reject = reject;
            loadAssetLate(assetEntry);
        });
    }
    function parseAssetDefinition(type, args) {
        var _a = __read(args, 2), fullPath = _a[0], name = _a[1];
        if (fullPath === undefined)
            throw Error("Can't load asset without an path");
        if (name === undefined)
            name = fullPath;
        var pathParts = fullPath.split(".");
        var basePath = pathParts.shift();
        var extension = "";
        if (pathParts.length > 0) {
            extension = "." + pathParts.join(".");
        }
        var validExtensions = assetTypeExtensions[type];
        if (!validExtensions.has(extension)) {
            throw Error("Can't load (".concat(extension, ") file as a ").concat(type, " file, try ").concat(Array.from(validExtensions).join(" ")));
        }
        return { name: name, basePath: basePath, fullPath: fullPath, extension: extension };
    }

    var lastUpdateTime = 0;
    var simTime = 0;
    update$5();
    function update$5() {
        lastUpdateTime = Math.round(getExactTime());
    }
    function getTime() {
        return lastUpdateTime;
    }
    function getExactTime() {
        return window.performance.now();
    }
    function getSimTime() {
        return simTime;
    }
    function deltaSimTime(delta) {
        simTime += delta;
    }

    var defaultViewpoint;
    var viewpointList = [];
    function init$2(viewpoint) {
        if (viewpoint === undefined) {
            setDefaultViewpoint(new ClassicViewpoint(1, new Vector2(0, 0)));
        }
        else {
            setDefaultViewpoint(viewpoint);
        }
    }
    function updateViewpoints(delta) {
        var e_1, _a;
        try {
            for (var viewpointList_1 = __values(viewpointList), viewpointList_1_1 = viewpointList_1.next(); !viewpointList_1_1.done; viewpointList_1_1 = viewpointList_1.next()) {
                var viewpoint = viewpointList_1_1.value;
                viewpoint.update(delta);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (viewpointList_1_1 && !viewpointList_1_1.done && (_a = viewpointList_1.return)) _a.call(viewpointList_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    function setDefaultViewpoint(viewpoint) {
        defaultViewpoint = viewpoint;
    }
    function getDefaultViewpoint() {
        if (defaultViewpoint === undefined)
            throw Error("Could not find default viewpoint; maybe run Brass.init() first");
        return defaultViewpoint;
    }
    var ViewpointAbstract = (function () {
        function ViewpointAbstract(scale, translation, options) {
            if (options === void 0) { options = {}; }
            var _a, _b, _c;
            this.shakeStrength = 0;
            this.shakeDecay = 0;
            this.scale = scale;
            this.translation = translation;
            this.integerTranslation = (_a = options.integerTranslation) !== null && _a !== void 0 ? _a : true;
            this.integerScaling = (_b = options.integerScaling) !== null && _b !== void 0 ? _b : false;
            this.shakeSpeed = (_c = options.shakeSpeed) !== null && _c !== void 0 ? _c : 0.015;
            this.shakePosition = new Vector2();
            viewpointList.push(this);
        }
        ViewpointAbstract.prototype.view = function (d) {
            if (d === void 0) { d = getP5DrawTarget("defaultP5"); }
            var g = d.getMaps().canvas;
            var viewOrigin = this.getViewOrigin(d);
            g.translate(viewOrigin.x, viewOrigin.y);
            g.scale(this.effectiveScale);
            var translation = this.effectiveTranslation;
            g.translate(-translation.x, -translation.y);
            g.translate(-this.shakePosition.x, -this.shakePosition.y);
        };
        ViewpointAbstract.prototype.getScreenViewArea = function (d) {
            if (d === void 0) { d = getP5DrawTarget("defaultP5"); }
            var g = d.getMaps().canvas;
            var viewOrigin = this.getViewOrigin(d);
            return {
                minX: 0 - viewOrigin.x,
                maxX: g.width - viewOrigin.x,
                minY: 0 - viewOrigin.y,
                maxY: g.height - viewOrigin.y
            };
        };
        ViewpointAbstract.prototype.getWorldViewArea = function (d) {
            if (d === void 0) { d = getP5DrawTarget("defaultP5"); }
            var g = d.getMaps().canvas;
            this.effectiveTranslation;
            var _a = this.screenToWorld(new Vector2()), minX = _a.x, minY = _a.y;
            var _b = this.screenToWorld(new Vector2(g.width, g.height)), maxX = _b.x, maxY = _b.y;
            return {
                minX: minX,
                minY: minY,
                maxX: maxX,
                maxY: maxY
            };
        };
        ViewpointAbstract.prototype.traslateScreen = function (screenTranslation) {
            var worldTraslation = screenTranslation.copy().divScalar(this.effectiveScale);
            this.translation.add(worldTraslation);
        };
        ViewpointAbstract.prototype.screenToWorld = function (screenCoord, d) {
            if (d === void 0) { d = getP5DrawTarget("defaultP5"); }
            d.getMaps().canvas;
            var coord = screenCoord.copy();
            var viewOrigin = this.getViewOrigin(d);
            coord.sub(viewOrigin);
            coord.divScalar(this.effectiveScale);
            var translation = this.effectiveTranslation;
            coord.add(translation);
            coord.add(this.shakePosition);
            return coord;
        };
        ViewpointAbstract.prototype.worldToScreen = function (worldCoord, d) {
            if (d === void 0) { d = getP5DrawTarget("defaultP5"); }
            d.getMaps().canvas;
            var coord = worldCoord.copy();
            coord.sub(this.shakePosition);
            var translation = this.effectiveTranslation;
            coord.sub(translation);
            coord.multScalar(this.effectiveScale);
            var viewOrigin = this.getViewOrigin(d);
            coord.add(viewOrigin);
            return coord;
        };
        Object.defineProperty(ViewpointAbstract.prototype, "effectiveTranslation", {
            get: function () {
                if (this.integerTranslation) {
                    return this.translation.copy()
                        .multScalar(this.effectiveScale).round()
                        .divScalar(this.effectiveScale);
                }
                return this.translation.copy();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ViewpointAbstract.prototype, "effectiveScale", {
            get: function () {
                if (this.integerScaling) {
                    if (this.scale > 1) {
                        return Math.round(this.scale);
                    }
                    else {
                        return 1 / Math.round(1 / this.scale);
                    }
                }
                return this.scale;
            },
            enumerable: false,
            configurable: true
        });
        ViewpointAbstract.prototype.shake = function (strength, duration) {
            if (duration === void 0) { duration = 1000; }
            this.shakeStrength += strength;
            this.shakeDecay += strength / duration;
        };
        ViewpointAbstract.prototype.updateShake = function (delta) {
            this.shakeStrength -= this.shakeDecay * delta;
            if (this.shakeStrength <= 0) {
                this.shakeStrength = 0;
                this.shakeDecay = 0;
            }
            this.shakePosition.x =
                noise(8104, getTime() * this.shakeSpeed * 2) * 0.3 +
                    noise(9274, getTime() * this.shakeSpeed / 2) * 0.7;
            this.shakePosition.y =
                noise(5928, getTime() * this.shakeSpeed * 2) * 0.3 +
                    noise(2395, getTime() * this.shakeSpeed / 2) * 0.7;
            this.shakePosition.subScalar(0.5).multScalar(this.shakeStrength);
        };
        return ViewpointAbstract;
    }());
    var ClassicViewpoint = (function (_super) {
        __extends(ClassicViewpoint, _super);
        function ClassicViewpoint(scale, translation, options) {
            if (scale === void 0) { scale = 100; }
            if (translation === void 0) { translation = new Vector2(); }
            if (options === void 0) { options = {}; }
            return _super.call(this, scale, translation, options) || this;
        }
        ClassicViewpoint.prototype.update = function (delta) { };
        ClassicViewpoint.prototype.getViewOrigin = function () {
            return new Vector2(0, 0);
        };
        return ClassicViewpoint;
    }(ViewpointAbstract));
    var Viewpoint = (function (_super) {
        __extends(Viewpoint, _super);
        function Viewpoint(scale, translation, options) {
            if (scale === void 0) { scale = 100; }
            if (translation === void 0) { translation = new Vector2(); }
            if (options === void 0) { options = {}; }
            var _this = this;
            var _a, _b, _c, _d, _e;
            _this = _super.call(this, scale, translation, options) || this;
            _this.velocity = new Vector2();
            _this._target = _this.translation.copy();
            _this.previousTarget = _this._target.copy();
            if ("follow" in options ||
                "drag" in options ||
                "outrun" in options) {
                _this.jump = (_a = options.jump) !== null && _a !== void 0 ? _a : 0;
                _this.follow = (_b = options.follow) !== null && _b !== void 0 ? _b : 0.001;
                _this.drag = (_c = options.drag) !== null && _c !== void 0 ? _c : 0.1;
                _this.outrun = (_d = options.outrun) !== null && _d !== void 0 ? _d : 0;
            }
            else {
                _this.jump = (_e = options.jump) !== null && _e !== void 0 ? _e : 0.1;
                _this.follow = 0;
                _this.drag = 0;
                _this.outrun = 0;
            }
            return _this;
        }
        Viewpoint.prototype.update = function (delta) {
            var targetVelocity = this.target.copy().sub(this.previousTarget);
            this.velocity.multScalar(Math.pow(1 - this.drag, delta));
            var difference = this.target.copy().sub(this.translation);
            this.velocity.add(difference.copy().multScalar(this.follow * delta));
            this.velocity.add(targetVelocity.copy().multScalar(this.outrun * delta));
            var frameJump = Math.pow(this.jump + 1, Math.pow(delta, this.jump));
            this.translation.add(this.target.copy().multScalar(frameJump - 1));
            this.translation.divScalar(frameJump);
            this.translation.add(this.velocity);
            this.previousTarget = this.target.copy();
            this.updateShake(delta);
        };
        Viewpoint.prototype.getViewOrigin = function (d) {
            var g = d.getMaps().canvas;
            if (this.integerTranslation) {
                return new Vector2(Math.round(g.width / 2), Math.round(g.height / 2));
            }
            return new Vector2(g.width / 2, g.height / 2);
        };
        Object.defineProperty(Viewpoint.prototype, "target", {
            get: function () {
                return this._target;
            },
            set: function (value) {
                this._target = value;
            },
            enumerable: false,
            configurable: true
        });
        return Viewpoint;
    }(ViewpointAbstract));

    var frameRateList = [];
    var loadingScreenHue;
    var loadingTips;
    var loadingTipIndex;
    var loadingTipEndTime;
    loadingScreenHue = Math.random() * 360;
    setLoadingTips(["...loading"]);
    function setLoadingTips(tips) {
        if (tips.length === 0) {
            loadingTips = [""];
        }
        else {
            loadingTips = tips;
        }
        pickLoadingTip();
    }
    function pickLoadingTip() {
        var newTipIndex = Math.floor(Math.random() * loadingTips.length);
        if (loadingTips.length > 1) {
            while (loadingTipIndex === newTipIndex) {
                newTipIndex = Math.floor(Math.random() * loadingTips.length);
            }
        }
        loadingTipIndex = newTipIndex;
        loadingTipEndTime = getTime() +
            loadingTips[loadingTipIndex].length * 50 + 1500;
    }
    function drawFPS(d) {
        if (d === void 0) { d = getP5DrawTarget("defaultP5"); }
        var g = d.getMaps().canvas;
        g.push();
        g.resetMatrix();
        g.stroke(0);
        g.fill(0, 127);
        g.rect(5.5, 5.5, 140, 70);
        g.noStroke();
        g.fill(0, 127);
        g.rect(10.5, 10.5, 59, 60);
        var rateList = frameRateList;
        var currentFPS = frameRate();
        if (currentFPS > 0)
            rateList.push(currentFPS);
        if (rateList.length > 30)
            rateList.shift();
        var minFPS = Infinity, averageFPS = 0, maxFPS = -Infinity;
        g.noStroke();
        for (var i = 0; i < rateList.length; i++) {
            var fps = rateList[i];
            minFPS = Math.min(fps, minFPS);
            averageFPS += fps;
            maxFPS = Math.max(fps, maxFPS);
            if (fps > 45) {
                g.fill(0, 220, 0);
            }
            else if (fps >= 22.5) {
                g.fill(255, 255, 0);
            }
            else {
                g.fill(255, 0, 0);
            }
            g.rect(10 + i * 2, 70 - fps, 2, fps);
        }
        averageFPS /= rateList.length;
        if (rateList.length > 0) {
            g.textSize(12);
            g.textAlign(LEFT, TOP);
            g.fill(255);
            g.noStroke();
            g.text("Min: ".concat(minFPS.toPrecision(3)), 82, 13);
            g.text("Avg: ".concat(averageFPS.toPrecision(3)), 81, 28);
            g.text("Max: ".concat(maxFPS.toPrecision(3)), 79, 43);
            g.text("Now: ".concat(currentFPS.toPrecision(3)), 78, 58);
        }
        g.pop();
    }
    function drawLoading(d) {
        if (d === void 0) { d = getP5DrawTarget("defaultP5"); }
        var g = d.getMaps().canvas;
        g.push();
        g.resetMatrix();
        g.colorMode(HSL);
        g.background(loadingScreenHue, 60, 20);
        var str = "".concat(loadFraction(), " (").concat((Math.floor(loadProgress() * 100)), "%)");
        var strSize = Math.min(g.width, g.height) * 0.1;
        g.textSize(strSize);
        g.textAlign(CENTER, CENTER);
        g.textStyle(BOLD);
        g.noStroke();
        var offHue = (loadingScreenHue + 180) % 360;
        g.fill(offHue, 100, 10);
        g.text(str, g.width * 0.5 + strSize * 0.05, g.height * 0.3 + strSize * 0.05);
        g.fill(offHue, 70, 60);
        g.text(str, g.width * 0.5 - strSize * 0.05, g.height * 0.3 - strSize * 0.05);
        g.textAlign(CENTER, TOP);
        g.textStyle(NORMAL);
        g.textSize(strSize * 0.6);
        if (loadingTipEndTime < getTime()) {
            pickLoadingTip();
        }
        var tip = loadingTips[loadingTipIndex];
        g.fill(offHue, 100, 10);
        g.text(tip, g.width * 0.05 + strSize * 0.03, g.height * 0.65 + strSize * 0.03, width * 0.9, Infinity);
        g.fill(offHue, 70, 60);
        g.text(tip, g.width * 0.05 - strSize * 0.03, g.height * 0.65 - strSize * 0.03, width * 0.9, Infinity);
        g.strokeWeight(Math.min(g.width, g.height) * 0.1);
        g.stroke(offHue, 100, 10);
        g.line(g.width * 0.1, g.height * 0.5, g.width * 0.9, g.height * 0.5);
        g.strokeWeight(Math.min(g.width, g.height) * 0.08);
        g.stroke(offHue, 70, 60);
        g.line(g.width * 0.1, g.height * 0.5, g.width * 0.1 + g.width * 0.8 * loadProgress(), g.height * 0.5);
        g.pop();
    }

    var particles = new Map();
    var particleLimit = 300;
    function update$4(delta) {
        var e_1, _a;
        try {
            for (var particles_1 = __values(particles), particles_1_1 = particles_1.next(); !particles_1_1.done; particles_1_1 = particles_1.next()) {
                var _b = __read(particles_1_1.value, 2), particleId = _b[0], particle = _b[1];
                particle.update(delta);
                if (particle.alive())
                    continue;
                particle.kill();
                particles.delete(particleId);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (particles_1_1 && !particles_1_1.done && (_a = particles_1.return)) _a.call(particles_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (particles.size > particleLimit) {
            removeParticles(particles.size - particleLimit);
        }
    }
    function draw(v, d) {
        var e_2, _a;
        if (v === void 0) { v = getDefaultViewpoint(); }
        if (d === void 0) { d = getP5DrawTarget("defaultP5"); }
        var g = d.getMaps().canvas;
        var viewArea = v.getWorldViewArea(d);
        try {
            for (var _b = __values(particles.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), _ = _d[0], particle = _d[1];
                if (particle.visable(viewArea)) {
                    g.push();
                    g.translate(particle.position.x, particle.position.y);
                    g.scale(particle.radius);
                    particle.draw(g);
                    g.pop();
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
    function forEachParticle(func) {
        var e_3, _a;
        try {
            for (var _b = __values(particles.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), _ = _d[0], particle = _d[1];
                func(particle);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
    }
    function forEachVisableParticle(func, v, d) {
        var e_4, _a;
        if (v === void 0) { v = getDefaultViewpoint(); }
        if (d === void 0) { d = getP5DrawTarget("defaultP5"); }
        var viewArea = v.getWorldViewArea(d);
        try {
            for (var _b = __values(particles.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), _ = _d[0], particle = _d[1];
                if (particle.visable(viewArea))
                    func(particle);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
    }
    function removeParticles(amount) {
        var sortedParticles = __spreadArray([], __read(particles.entries()), false).sort(function (a, b) { return a[1].radius - b[1].radius; });
        amount = Math.min(amount, Math.floor(sortedParticles.length / 5));
        for (var i = 0; i < amount * 5; i += 5) {
            sortedParticles[i][1].kill();
            particles.delete(sortedParticles[i][0]);
        }
    }
    function setParticleLimit(limit) {
        particleLimit = limit;
    }
    function emitParticles(classVar, amount, position) {
        var data = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            data[_i - 3] = arguments[_i];
        }
        var limitFilled = particles.size / particleLimit;
        amount *= Math.max(0.1, 1 - Math.pow(limitFilled * 0.9, 6));
        while (amount > 1 || amount > Math.random()) {
            spawnParticle(classVar, position, data);
            amount--;
        }
    }
    function emitParticle(classVar, position) {
        var data = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            data[_i - 2] = arguments[_i];
        }
        var limitFilled = particles.size / particleLimit;
        if (limitFilled > 1 &&
            limitFilled > 1 + Math.random())
            return;
        spawnParticle(classVar, position, data);
    }
    function spawnParticle(classVar, position, data) {
        var particle = new (classVar.bind.apply(classVar, __spreadArray([void 0, Vector2.fromObjFast(position)], __read(data), false)))();
        particles.set(Symbol(), particle);
    }
    var ParticleAbstract = (function () {
        function ParticleAbstract(position) {
            this.radius = 1;
            this.lifetime = 5000;
            this.position = Vector2.fromObj(position);
            this.spawnTime = getTime();
        }
        ParticleAbstract.prototype.update = function (delta) { };
        ParticleAbstract.prototype.draw = function (g) {
            g.noStroke();
            g.fill(255, 0, 255);
            g.circle(0, 0, 2);
        };
        ParticleAbstract.prototype.alive = function () {
            return this.age < 1;
        };
        ParticleAbstract.prototype.visable = function (viewArea) {
            return (this.position.x + this.radius > viewArea.minX &&
                this.position.x - this.radius < viewArea.maxX &&
                this.position.y + this.radius > viewArea.minY &&
                this.position.y - this.radius < viewArea.maxY);
        };
        ParticleAbstract.prototype.kill = function () { };
        Object.defineProperty(ParticleAbstract.prototype, "age", {
            get: function () {
                return (getTime() - this.spawnTime) / this.lifetime;
            },
            enumerable: false,
            configurable: true
        });
        return ParticleAbstract;
    }());
    var VelocityParticleAbstract = (function (_super) {
        __extends(VelocityParticleAbstract, _super);
        function VelocityParticleAbstract(position, velocity) {
            if (velocity === void 0) { velocity = new Vector2(); }
            var _this = _super.call(this, position) || this;
            _this.velocity = velocity;
            return _this;
        }
        VelocityParticleAbstract.prototype.updateKinomatics = function (delta) {
            this.position.add(this.velocity.copy().multScalar(delta));
        };
        VelocityParticleAbstract.prototype.collide = function (tilemap) {
            var _a = this.position.copy().divScalar(tilemap.tileSize), x = _a.x, y = _a.y;
            var radius = this.radius / tilemap.tileSize;
            var deltaX = 0, deltaY = 0;
            if (tilemap.getSolid(Math.floor(x - radius), Math.floor(y)) &&
                !tilemap.getSolid(Math.floor(x - radius) + 1, Math.floor(y))) {
                deltaX = Math.ceil(x - radius) + radius - x;
            }
            if (tilemap.getSolid(Math.floor(x + radius), Math.floor(y)) &&
                !tilemap.getSolid(Math.floor(x + radius) - 1, Math.floor(y))) {
                var newDeltaX = Math.floor(x + radius) - radius - x;
                if (deltaX === 0 || Math.abs(newDeltaX) < Math.abs(deltaX))
                    deltaX = newDeltaX;
            }
            if (tilemap.getSolid(Math.floor(x), Math.floor(y - radius)) &&
                !tilemap.getSolid(Math.floor(x), Math.floor(y - radius) + 1)) {
                deltaY = Math.ceil(y - radius) + radius - y;
            }
            if (tilemap.getSolid(Math.floor(x), Math.floor(y + radius)) &&
                !tilemap.getSolid(Math.floor(x), Math.floor(y + radius) - 1)) {
                var newDeltaY = Math.floor(y + radius) - radius - y;
                if (deltaY === 0 || Math.abs(newDeltaY) < Math.abs(deltaY))
                    deltaY = newDeltaY;
            }
            if (deltaX !== 0 && deltaY !== 0) {
                if (Math.abs(deltaX) < Math.abs(deltaY)) {
                    this.position.x += deltaX * tilemap.tileSize;
                    this.velocity.x = 0;
                }
                else {
                    this.position.y += deltaY * tilemap.tileSize;
                    this.velocity.y = 0;
                }
            }
            else if (deltaX !== 0) {
                this.position.x += deltaX * tilemap.tileSize;
                this.velocity.x = 0;
            }
            else if (deltaY !== 0) {
                this.position.y += deltaY * tilemap.tileSize;
                this.velocity.y = 0;
            }
        };
        return VelocityParticleAbstract;
    }(ParticleAbstract));

    var PathSituationType;
    (function (PathSituationType) {
        PathSituationType[PathSituationType["Inital"] = 0] = "Inital";
        PathSituationType[PathSituationType["Processing"] = 1] = "Processing";
        PathSituationType[PathSituationType["Failed"] = 2] = "Failed";
        PathSituationType[PathSituationType["Succeed"] = 3] = "Succeed";
    })(PathSituationType || (PathSituationType = {}));
    var pathfinders = [];
    var waitingPathfinder = 0;
    var pathfinderUpdateTime = 3;
    var pathfinderMinDist = 0.1;
    var pathfinderMaxDist = 2;
    function update$3() {
        var endTime = getExactTime() + pathfinderUpdateTime;
        var lastPathfinderIndex = waitingPathfinder + pathfinders.length;
        for (var _i = waitingPathfinder; _i < lastPathfinderIndex; _i++) {
            var i = _i % pathfinders.length;
            waitingPathfinder = (_i + 1) % pathfinders.length;
            pathfinders[i].update(endTime);
            if (getExactTime() > endTime)
                return;
        }
    }
    var PathfinderAbstract = (function () {
        function PathfinderAbstract(options) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            this.confidence = 0.5;
            this.width = options.width;
            this.height = options.height;
            this.scale = (_a = options.scale) !== null && _a !== void 0 ? _a : 1;
            this.faliureDelay = (_b = options.faliureDelay) !== null && _b !== void 0 ? _b : 300;
            this.pathingRuntimeLimit = (_c = options.pathingRuntimeLimit) !== null && _c !== void 0 ? _c : 20000;
            this.pathingContinuousRuntimeLimit = (_d = options.pathingContinuousRuntimeLimit) !== null && _d !== void 0 ? _d : 2000;
            this.pathGarbageLimit = (_e = options.pathGarbageLimit) !== null && _e !== void 0 ? _e : 0.15;
            this.targetDriftLimit = (_f = options.targetDriftLimit) !== null && _f !== void 0 ? _f : 2;
            this.targetDriftInfluence = (_g = options.targetDriftInfluence) !== null && _g !== void 0 ? _g : 0.12;
            this.nodeComfirmationRate = (_h = options.nodeComfirmationRate) !== null && _h !== void 0 ? _h : 10;
            this.pheromoneDecayTime = (_j = options.pheromoneDecayTime) !== null && _j !== void 0 ? _j : 150000;
            this.pheromoneStrength = (_k = options.pheromoneStrength) !== null && _k !== void 0 ? _k : 0.5;
            this.pheromoneTime = getTime();
            if (options.pheromones !== false) {
                var zeroPheromone = this.pheromoneTime - this.pheromoneDecayTime;
                this.pheromones = new Int32Array(this.width * this.height).fill(zeroPheromone);
            }
            else {
                this.pheromones = null;
            }
            this.goal = null;
            this.agents = [];
            this.waitingAgent = 0;
            pathfinders.push(this);
        }
        PathfinderAbstract.prototype.createAgent = function (radius, leadership) {
            radius /= this.scale;
            var agent = new PathAgent(this, radius, leadership);
            this.agents.push(agent);
            return agent;
        };
        PathfinderAbstract.prototype.removeAgent = function (agent) {
            var index = this.agents.findIndex(function (_a) {
                var id = _a.id;
                return id === agent.id;
            });
            if (this.waitingAgent > index)
                this.waitingAgent--;
            this.agents.splice(index, 1);
        };
        PathfinderAbstract.prototype.setGoal = function (goal) {
            var e_1, _a;
            if (goal === null) {
                this.goal = null;
                return false;
            }
            var newGoal = goal.copy().divScalar(this.scale);
            if (!this.validatePosition(newGoal)) {
                this.goal = null;
                return false;
            }
            this.goal = newGoal;
            try {
                for (var _b = __values(this.agents), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var agent = _c.value;
                    if (agent.path.length <= 0)
                        continue;
                    var lastNode = agent.path[agent.path.length - 1];
                    if (lastNode.dist(this.goal) < pathfinderMinDist)
                        continue;
                    agent.newGoal = true;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return true;
        };
        PathfinderAbstract.prototype.confidenceDelta = function (delta) {
            this.confidence = Math.min(Math.max(this.confidence + delta, 0), 1);
        };
        PathfinderAbstract.prototype.update = function (endTime) {
            if (this.goal === null)
                return;
            if (this.confidence < 0.2) {
                this.confidenceDelta(0.01);
            }
            this.pheromoneTime = getTime();
            var skipFailuresAfter = getTime() - this.faliureDelay;
            var maxLeadership = Math.max.apply(Math, __spreadArray([], __read(this.agents.map(function (agents) { return agents.leadership; })), false));
            var effectiveConfidence = Math.max(this.confidence, 1.01 - maxLeadership);
            var lastAgentIndex = this.waitingAgent + this.agents.length;
            for (var _i = this.waitingAgent; _i < lastAgentIndex; _i++) {
                var i = _i % this.agents.length;
                this.waitingAgent = (_i + 1) % this.agents.length;
                var agent = this.agents[i];
                if (agent.pathFailTime > skipFailuresAfter) {
                    continue;
                }
                if (agent.path.length > 0)
                    this.confirmAgentNodes(agent);
                if (!(agent.computeStart || agent.computeEnd)) {
                    this.confidenceDelta(0.001);
                    continue;
                }
                if (agent.position === null)
                    continue;
                if (agent.leadership < 1 - effectiveConfidence) {
                    agent.reset();
                    continue;
                }
                processing: {
                    if (agent.processingSituation !== null) {
                        var targetDrift = agent.processingSituation.start.dist(agent.position) +
                            agent.processingSituation.end.dist(this.goal);
                        agent.processingSituation.maxRuntime = Math.ceil(agent.processingSituation.maxRuntime / (1 + targetDrift * this.targetDriftInfluence));
                        var situation = this.computePath(agent.processingSituation);
                        if (situation.type === PathSituationType.Processing)
                            break processing;
                        if (situation.type === PathSituationType.Failed) {
                            if (targetDrift > this.targetDriftLimit) {
                                agent.processingSituation = null;
                                agent.tryedPartCompute = false;
                            }
                            else if (agent.tryedPartCompute) {
                                agent.reset();
                            }
                            else {
                                agent.processingSituation = null;
                                agent.tryedPartCompute = true;
                            }
                            break processing;
                        }
                        else {
                            if (agent.tryedPartCompute) {
                                this.afterAgentComputeWhole(agent, situation);
                            }
                            else {
                                this.afterAgentComputePart(agent, situation);
                            }
                            agent.tryedPartCompute = false;
                        }
                    }
                    else {
                        if (agent.path.length > 0 && !agent.tryedPartCompute) {
                            var situation_1 = this.attemptAgentPartCompute(agent);
                            if (situation_1 !== undefined) {
                                this.afterAgentComputePart(agent, situation_1);
                                break processing;
                            }
                            if (agent.processingSituation !== null) {
                                break processing;
                            }
                        }
                        var situation = this.attemptAgentWholeCompute(agent);
                        if (situation !== undefined) {
                            this.afterAgentComputeWhole(agent, situation);
                        }
                    }
                }
                if (getExactTime() > endTime)
                    return;
            }
        };
        PathfinderAbstract.prototype.confirmAgentNodes = function (agent) {
            var nodesToComfirm = Math.min(agent.path.length, this.nodeComfirmationRate);
            for (var i = 0; i < nodesToComfirm; i++) {
                if (agent.waitingNodeComfirmation >= agent.path.length) {
                    agent.waitingNodeComfirmation = 0;
                }
                var node = agent.path[agent.waitingNodeComfirmation];
                var radius = agent.radius;
                if (agent.waitingNodeComfirmation === agent.path.length - 1) {
                    radius = 0;
                }
                if (!this.confirmNode(node, radius)) {
                    agent.reset();
                    break;
                }
                agent.waitingNodeComfirmation++;
            }
        };
        PathfinderAbstract.prototype.attemptAgentPartCompute = function (agent) {
            expect(this.goal !== null);
            expect(agent.position !== null);
            var minGarbage = 0;
            var garbageLimit = agent.pathCost * this.pathGarbageLimit;
            if (agent.computeStart) {
                minGarbage += agent.position.dist(agent.path[0]) * 100;
            }
            if (agent.computeEnd) {
                minGarbage += agent.path[agent.path.length - 1].dist(this.goal) * 100;
            }
            if (agent.pathGarbage + minGarbage > garbageLimit)
                return;
            var pathSituation;
            var runtimeLimit = Math.ceil(this.pathingRuntimeLimit * this.pathGarbageLimit);
            if (agent.computeStart) {
                pathSituation = this.computePath(agent.position, agent.path[0], runtimeLimit);
            }
            else {
                pathSituation = this.computePath(agent.path[agent.path.length - 1], this.goal, runtimeLimit);
            }
            if (pathSituation.type === PathSituationType.Processing) {
                agent.processingSituation = pathSituation;
                return;
            }
            else if (pathSituation.type === PathSituationType.Failed) {
                return;
            }
            return pathSituation;
        };
        PathfinderAbstract.prototype.afterAgentComputePart = function (agent, pathSituation) {
            var garbageLimit = agent.pathCost * this.pathGarbageLimit;
            var partCost = pathSituation.cost;
            if (agent.pathGarbage + partCost > garbageLimit)
                return;
            var pathPart = this.spaceOutPath(pathSituation.path);
            if (agent.computeStart) {
                agent.path = pathPart.concat(agent.path);
                agent.computeStart = false;
            }
            else {
                agent.path = agent.path.concat(pathPart);
                agent.computeEnd = false;
            }
            agent.pathGarbage += partCost;
        };
        PathfinderAbstract.prototype.attemptAgentWholeCompute = function (agent) {
            expect(this.goal !== null);
            expect(agent.position !== null);
            var pathSituation = this.computePath(agent.position, this.goal, this.pathingRuntimeLimit);
            if (pathSituation.type === PathSituationType.Processing) {
                agent.processingSituation = pathSituation;
                return;
            }
            else if (pathSituation.type === PathSituationType.Failed) {
                return;
            }
            return pathSituation;
        };
        PathfinderAbstract.prototype.afterAgentComputeWhole = function (agent, pathSituation) {
            var path = this.spaceOutPath(pathSituation.path);
            agent.setPath(path, pathSituation.cost);
            agent.computeWhole = false;
        };
        PathfinderAbstract.prototype.spaceOutPath = function (_path) {
            var path = _path.map(Vector2.fromObjFast);
            var newPath = [];
            for (var i = 0; i < path.length - 1; i++) {
                var nodeDistance = path[i].dist(path[i + 1]);
                newPath.push(path[i]);
                if (nodeDistance > 1.01) {
                    var interNodeCount = Math.floor(nodeDistance / 1);
                    var firstInterNode = (nodeDistance - interNodeCount) / nodeDistance / 2;
                    var interDistance = 1 / nodeDistance;
                    for (var interProgress = firstInterNode; interProgress < 1; interProgress += interDistance) {
                        var interNode = path[i].copy().mix(path[i + 1], interProgress);
                        newPath.push(interNode);
                    }
                }
            }
            newPath.push(path[path.length - 1]);
            return newPath;
        };
        PathfinderAbstract.prototype.parseComputePathArgs = function (args) {
            if (args.length === 1) {
                return args[0];
            }
            else {
                return {
                    start: args[0],
                    end: args[1],
                    maxRuntime: args[2],
                    runtime: 0,
                    type: PathSituationType.Inital
                };
            }
        };
        PathfinderAbstract.prototype.getPheromones = function (_a) {
            var x = _a.x, y = _a.y;
            if (this.pheromones === null)
                return 1;
            var pheromoneTime = this.pheromones[x + y * this.width];
            var pheromoneAge = this.pheromoneTime - pheromoneTime;
            var pheromoneLeft = (this.pheromoneDecayTime - pheromoneAge) / this.pheromoneDecayTime;
            return Math.max(0, 1 - pheromoneLeft * pheromoneLeft * this.pheromoneStrength);
        };
        PathfinderAbstract.prototype.setPheromones = function (_a) {
            var x = _a.x, y = _a.y;
            if (this.pheromones === null)
                return;
            this.pheromones[x + y * this.width] = this.pheromoneTime;
        };
        PathfinderAbstract.prototype.validatePosition = function (position) {
            return position.x >= 0 && position.y >= 0 &&
                position.x < this.width && position.y < this.height;
        };
        return PathfinderAbstract;
    }());
    var AStarPathfinder = (function (_super) {
        __extends(AStarPathfinder, _super);
        function AStarPathfinder(tilemap, options) {
            if (options === void 0) { options = {}; }
            var _this = this;
            options.width = tilemap.width;
            options.height = tilemap.height;
            options.scale = tilemap.tileSize;
            _this = _super.call(this, options) || this;
            _this.tilemap = tilemap;
            return _this;
        }
        AStarPathfinder.prototype.createAgent = function (radius, leadership) {
            if (radius > 0.5 * this.scale) {
                throw Error("AStarPathfinder can't handle agents wider than one tilemap cell");
            }
            return _super.prototype.createAgent.call(this, radius, leadership);
        };
        AStarPathfinder.prototype.computePath = function () {
            var args = [];
            for (var _a = 0; _a < arguments.length; _a++) {
                args[_a] = arguments[_a];
            }
            var situation = this.parseComputePathArgs(args);
            situation = this.computeAStar(situation);
            if (situation.type === PathSituationType.Succeed) {
                situation.path = situation.path.map(function (obj) { return ({ x: obj.x + 0.5, y: obj.y + 0.5 }); });
                situation.path.unshift(situation.start.copy());
                situation.path.push(situation.end.copy());
            }
            return situation;
        };
        AStarPathfinder.prototype.computeAStar = function (situation) {
            var e_2, _a;
            if (situation.type === PathSituationType.Inital) {
                if (this.tilemap.getSolid(situation.start.x, situation.start.y) ||
                    this.tilemap.getSolid(situation.end.x, situation.end.y)) {
                    situation.type = PathSituationType.Failed;
                    return situation;
                }
                situation.type = PathSituationType.Processing;
                situation.state = {
                    gCosts: new Map(),
                    fCosts: new Map(),
                    sources: new Map(),
                    open: new MappedHeap([], function (a, b) {
                        return situation.state.fCosts.get(a) <
                            situation.state.fCosts.get(b);
                    })
                };
            }
            var start = situation.start.copy().floor(), end = situation.end.copy().floor();
            var startPrimative = this.primitivizePosition(start), endPrimative = this.primitivizePosition(end);
            var _b = situation.state, gCosts = _b.gCosts, fCosts = _b.fCosts, sources = _b.sources, open = _b.open;
            gCosts.set(startPrimative, 0);
            fCosts.set(startPrimative, this.heuristic(start, end));
            sources.set(startPrimative, null);
            open.insert(startPrimative);
            var initalRunTime = situation.runtime;
            while (open.size > 0) {
                if (situation.runtime >= situation.maxRuntime) {
                    situation.type = PathSituationType.Failed;
                    this.confidenceDelta(-0.05);
                    return situation;
                }
                else if (situation.runtime - initalRunTime >= this.pathingContinuousRuntimeLimit) {
                    this.confidenceDelta(-0.01);
                    return situation;
                }
                situation.runtime++;
                var currentPrimative = open.remove();
                var current = this.deprimitivizePosition(currentPrimative);
                if (currentPrimative === endPrimative) {
                    return this.reconstructPath(situation, currentPrimative, gCosts, sources);
                }
                var currectGCost = gCosts.get(currentPrimative);
                var neighbors = this.computeNeighbors(current);
                try {
                    for (var neighbors_1 = (e_2 = void 0, __values(neighbors)), neighbors_1_1 = neighbors_1.next(); !neighbors_1_1.done; neighbors_1_1 = neighbors_1.next()) {
                        var _c = neighbors_1_1.value, position = _c.position, dCost = _c.dCost;
                        var positionPrimative = this.primitivizePosition(position);
                        var newGCost = currectGCost + Math.round(dCost * this.getPheromones(position));
                        var oldGCost = gCosts.get(positionPrimative);
                        if (oldGCost === undefined || newGCost < oldGCost) {
                            sources.set(positionPrimative, currentPrimative);
                            gCosts.set(positionPrimative, newGCost);
                            fCosts.set(positionPrimative, newGCost +
                                this.heuristic(position, end));
                            open.insert(positionPrimative);
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (neighbors_1_1 && !neighbors_1_1.done && (_a = neighbors_1.return)) _a.call(neighbors_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
            situation.type = PathSituationType.Failed;
            return situation;
        };
        AStarPathfinder.prototype.computeNeighbors = function (_a) {
            var x = _a.x, y = _a.y;
            var neighbors = [];
            var left = this.tilemap.getSolid(x - 1, y) === false;
            var right = this.tilemap.getSolid(x + 1, y) === false;
            var up = this.tilemap.getSolid(x, y - 1) === false;
            var down = this.tilemap.getSolid(x, y + 1) === false;
            if (left) {
                neighbors.push({
                    position: { x: x - 1, y: y },
                    dCost: 100
                });
            }
            if (right) {
                neighbors.push({
                    position: { x: x + 1, y: y },
                    dCost: 100
                });
            }
            if (up) {
                neighbors.push({
                    position: { x: x, y: y - 1 },
                    dCost: 100
                });
                if (left && this.tilemap.getSolid(x - 1, y - 1) === false) {
                    neighbors.push({
                        position: { x: x - 1, y: y - 1 },
                        dCost: 141
                    });
                }
                if (right && this.tilemap.getSolid(x + 1, y - 1) === false) {
                    neighbors.push({
                        position: { x: x + 1, y: y - 1 },
                        dCost: 141
                    });
                }
            }
            if (down) {
                neighbors.push({
                    position: { x: x, y: y + 1 },
                    dCost: 100
                });
                if (left && this.tilemap.getSolid(x - 1, y + 1) === false) {
                    neighbors.push({
                        position: { x: x - 1, y: y + 1 },
                        dCost: 141
                    });
                }
                if (right && this.tilemap.getSolid(x + 1, y + 1) === false) {
                    neighbors.push({
                        position: { x: x + 1, y: y + 1 },
                        dCost: 141
                    });
                }
            }
            return neighbors;
        };
        AStarPathfinder.prototype.reconstructPath = function (situation, originPrimative, gCosts, sources) {
            var path = [];
            var cost = gCosts.get(originPrimative);
            var nodePrimative = originPrimative;
            while (nodePrimative !== null) {
                path.push(this.deprimitivizePosition(nodePrimative));
                nodePrimative = sources.get(nodePrimative);
            }
            path.reverse();
            situation.type = PathSituationType.Succeed;
            situation.path = path;
            situation.cost = cost;
            return situation;
        };
        AStarPathfinder.prototype.primitivizePosition = function (_a) {
            var x = _a.x, y = _a.y;
            return x + this.tilemap.width * y;
        };
        AStarPathfinder.prototype.deprimitivizePosition = function (prim) {
            return {
                x: prim % this.tilemap.width,
                y: Math.floor(prim / this.tilemap.width)
            };
        };
        AStarPathfinder.prototype.heuristic = function (start, end) {
            return Math.round(Math.hypot(end.x - start.x, end.y - start.y) * 100);
        };
        AStarPathfinder.prototype.confirmNode = function (node, radius) {
            var minX = Math.floor(node.x - radius), maxX = Math.ceil(node.x + radius), minY = Math.floor(node.y - radius), maxY = Math.ceil(node.y + radius);
            for (var x = minX; x < maxX; x++) {
                for (var y = minY; y < maxY; y++) {
                    if (this.tilemap.getSolid(Math.floor(x), Math.floor(y))) {
                        return false;
                    }
                }
            }
            return true;
        };
        return AStarPathfinder;
    }(PathfinderAbstract));
    var PathAgent = (function () {
        function PathAgent(pathfinder, radius, leadership) {
            if (leadership === void 0) { leadership = Math.random(); }
            this.id = Symbol();
            this.position = null;
            this.direction = false;
            this.newGoal = true;
            this.processingSituation = null;
            this.tryedPartCompute = false;
            this.pathCost = 0;
            this.pathGarbage = 0;
            this.path = [];
            this.waitingNodeComfirmation = 0;
            this.computeStart = true;
            this.computeEnd = true;
            this.pathFailTime = 0;
            this.pathfinder = pathfinder;
            this.radius = radius;
            this.leadership = leadership;
        }
        PathAgent.prototype.drawPath = function (thickness, fillColor, d) {
            if (thickness === void 0) { thickness = 0.2; }
            if (fillColor === void 0) { fillColor = "red"; }
            if (d === void 0) { d = getP5DrawTarget("defaultP5"); }
            var g = d.getMaps().canvas;
            if (this.position === null)
                return;
            g.push();
            g.noStroke();
            g.fill(fillColor);
            this.path.unshift(this.position);
            for (var i = 0; i < this.path.length; i++) {
                var node = this.path[i].copy().multScalar(this.pathfinder.scale);
                g.circle(node.x, node.y, thickness);
                if (i >= this.path.length - 1)
                    continue;
                var nextNode = this.path[i + 1].copy().multScalar(this.pathfinder.scale);
                var offsetForward = nextNode.copy().sub(node).norm(thickness / 2);
                var offsetA = offsetForward.copy().rotate(-HALF_PI);
                var offsetB = offsetForward.copy().rotate(HALF_PI);
                g.triangle(node.x + offsetA.x, node.y + offsetA.y, nextNode.x, nextNode.y, node.x + offsetB.x, node.y + offsetB.y);
            }
            this.path.shift();
            g.pop();
        };
        PathAgent.prototype.getDirection = function (position) {
            if (position &&
                (this.position === null || !this.position.equal(position))) {
                var newPosition = position.copy().divScalar(this.pathfinder.scale);
                if (!this.pathfinder.validatePosition(newPosition)) {
                    this.position = null;
                    return false;
                }
                this.position = newPosition;
            }
            else {
                if (this.direction)
                    return this.direction;
            }
            if (this.position === null)
                return false;
            while (this.path.length > 0) {
                if (this.position.dist(this.path[0]) < pathfinderMinDist) {
                    var pathNode = this.path.shift().floor();
                    this.pathfinder.setPheromones(pathNode);
                }
                else {
                    if (this.position.dist(this.path[0]) > pathfinderMaxDist) {
                        if (this.processingSituation) {
                            this.tryedPartCompute = false;
                            this.processingSituation = null;
                        }
                        this.computeStart = true;
                    }
                    break;
                }
            }
            if (this.path.length === 0 || this.computeStart) {
                if (this.pathfinder.goal === null)
                    return false;
                var goalDistance = this.position.dist(this.pathfinder.goal);
                var atGoal = goalDistance < pathfinderMinDist * 2;
                if (atGoal) {
                    this.setPath([]);
                }
                else {
                    if (this.path.length === 0) {
                        this.computeWhole = true;
                    }
                }
                return atGoal;
            }
            this.direction = this.path[0].copy()
                .multScalar(this.pathfinder.scale)
                .sub(this.position.copy().multScalar(this.pathfinder.scale));
            if (this.newGoal) {
                if (this.direction.mag < pathfinderMinDist * 3 && random() < 0.2) {
                    if (this.processingSituation) {
                        this.tryedPartCompute = false;
                        this.processingSituation = null;
                    }
                    this.computeEnd = true;
                    this.newGoal = false;
                }
            }
            return this.direction;
        };
        PathAgent.prototype.reset = function () {
            this.setPath([]);
            this.tryedPartCompute = false;
            this.processingSituation = null;
            this.computeStart = true;
            this.computeEnd = true;
            this.pathFailTime = getTime();
        };
        PathAgent.prototype.setPath = function (path, cost) {
            if (cost === void 0) { cost = 0; }
            this.pathCost = cost;
            this.pathGarbage = 0;
            this.path = path;
        };
        Object.defineProperty(PathAgent.prototype, "computeWhole", {
            get: function () {
                return this.computeStart && this.computeEnd;
            },
            set: function (value) {
                this.computeStart = value;
                this.computeEnd = value;
            },
            enumerable: false,
            configurable: true
        });
        return PathAgent;
    }());

    var inited$1 = false;
    var lastDelta = null;
    var engine;
    var world;
    var spaceScale;
    var rays = new Map();
    var bodies = Array(32).fill(null).map(function () { return new Map(); });
    var forceUnit = 1e-6;
    function init$1(_options) {
        var _a, _b;
        if (_options === void 0) { _options = {}; }
        if (typeof Matter !== "object") {
            throw Error("Matter was not found; Can't initialize Brass physics without Matter.js initialized first");
        }
        (_a = _options.gravity) !== null && _a !== void 0 ? _a : (_options.gravity = { scale: 0 });
        spaceScale = (_b = _options.spaceScale) !== null && _b !== void 0 ? _b : 1;
        var options = _options;
        engine = Matter.Engine.create(options);
        world = engine.world;
        Matter.Events.on(engine, "collisionActive", handleActiveCollisions);
        inited$1 = true;
    }
    function handleActiveCollisions(_a) {
        var pairs = _a.pairs;
        pairs.map(function (pair) {
            var e_1, _a;
            var bodyA = pair.bodyA.__brassBody__;
            var bodyB = pair.bodyB.__brassBody__;
            var points = [];
            try {
                for (var _b = __values(pair.activeContacts), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var vertex_1 = _c.value.vertex;
                    points.push(new Vector2(vertex_1.x / spaceScale, vertex_1.y / spaceScale));
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            bodyA.triggerSensors({ self: bodyA, body: bodyB, points: points.map(function (v) { return v.copy(); }) });
            bodyB.triggerSensors({ self: bodyB, body: bodyA, points: points });
        });
    }
    function isPhysicsRunning() {
        return inited$1;
    }
    function enforceInit$1(action) {
        if (inited$1)
            return;
        throw Error("Matter must be enabled in Brass.init() before ".concat(action));
    }
    function update$2(delta) {
        var e_2, _a;
        enforceInit$1("updating physics");
        if (lastDelta === null)
            lastDelta = delta;
        if (lastDelta !== 0) {
            Matter.Engine.update(engine, delta, delta / lastDelta);
        }
        lastDelta = delta;
        try {
            for (var _b = __values(rays.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), _ = _d[0], ray = _d[1];
                var _e = ray.castOverTime(delta), body = _e.body, point_1 = _e.point;
                ray.position = point_1.copy();
                if (!body)
                    continue;
                ray.triggerSensors({ body: body, self: ray, points: [point_1] });
                ray.kill();
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
    function drawColliders(weight, d) {
        var e_3, _a, e_4, _b;
        if (weight === void 0) { weight = 0.5; }
        if (d === void 0) { d = getP5DrawTarget("defaultP5"); }
        var g = d.getMaps().canvas;
        g.push();
        g.noFill();
        g.stroke(0, 255, 0);
        g.strokeWeight(weight);
        var bodyQueue = __spreadArray([], __read(world.bodies), false);
        var queuedBodies = new Set(bodyQueue.map(function (b) { return b.id; }));
        while (bodyQueue.length > 0) {
            var body = bodyQueue.pop();
            try {
                for (var _c = (e_3 = void 0, __values(body.parts)), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var part = _d.value;
                    if (!queuedBodies.has(part.id)) {
                        bodyQueue.push(part);
                        queuedBodies.add(part.id);
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_3) throw e_3.error; }
            }
            g.beginShape();
            try {
                for (var _e = (e_4 = void 0, __values(body.vertices)), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var vert = _f.value;
                    g.vertex(vert.x / spaceScale, vert.y / spaceScale);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                }
                finally { if (e_4) throw e_4.error; }
            }
            g.endShape(CLOSE);
        }
        g.pop();
    }
    var BodyAbstract = (function () {
        function BodyAbstract() {
            this.sensors = [];
            this.alive = true;
            this.data = null;
            enforceInit$1("creating a body");
        }
        BodyAbstract.prototype.addSensor = function (callback) {
            this.sensors.push(callback);
            return this;
        };
        BodyAbstract.prototype.removeSensor = function (callback) {
            var index = [].findIndex(function (sensor) { return sensor === callback; });
            this.sensors.splice(index, 1);
            return this;
        };
        BodyAbstract.prototype.triggerSensors = function (collision) {
            this.sensors.forEach(function (callback) { return callback(collision); });
            return this;
        };
        BodyAbstract.prototype.kill = function () {
            this.alive = false;
        };
        BodyAbstract.prototype.validateCollisionIndex = function (index) {
            if (typeof index !== "number" ||
                index !== Math.floor(index))
                throw Error("Collision category must be an integer");
            if (index < 0 || index > 31)
                throw Error("Collision category must be in 0 through 31 inclusive");
            return index;
        };
        BodyAbstract.prototype.validateCollisionMask = function (mask) {
            if (typeof mask !== "number" ||
                mask !== Math.floor(mask))
                throw Error("Collision mask must be an integer");
            if (mask < 0x00000000 || mask > 0xFFFFFFFF)
                throw Error("Collision mask must be 32-bit");
            return mask;
        };
        BodyAbstract.prototype.collisionIndexToCategory = function (index) {
            this.validateCollisionIndex(index);
            return 1 << index;
        };
        BodyAbstract.prototype.collisionCategoryToIndex = function (category) {
            if (category === 0x8000) {
                return 31;
            }
            else {
                var index = Math.log2(category);
                if (index !== Math.floor(index))
                    throw Error("Internal Matter.js body could not be fit in one collision category");
                return index;
            }
        };
        return BodyAbstract;
    }());
    var MaterialBodyAbstract = (function (_super) {
        __extends(MaterialBodyAbstract, _super);
        function MaterialBodyAbstract(body) {
            var _this = _super.call(this) || this;
            _this.setBody(body);
            return _this;
        }
        MaterialBodyAbstract.prototype.setBody = function (body) {
            if (this.body !== undefined) {
                this.remove();
            }
            this.body = body;
            this.body.__brassBody__ = this;
            this.body.collisionFilter.category = this.collisionIndexToCategory(0);
            bodies[0].set(this.body.id, this);
            Matter.World.add(world, body);
        };
        MaterialBodyAbstract.prototype.removeBody = function () {
        };
        Object.defineProperty(MaterialBodyAbstract.prototype, "position", {
            get: function () {
                var position = Vector2.fromObj(this.body.position).divScalar(spaceScale);
                return watchVector(position, this.setPosition.bind(this));
            },
            set: function (position) {
                position = Matter.Vector.create(position.x * spaceScale, position.y * spaceScale);
                Matter.Body.setPosition(this.body, position);
            },
            enumerable: false,
            configurable: true
        });
        MaterialBodyAbstract.prototype.setPosition = function (position) {
            this.position = position;
        };
        Object.defineProperty(MaterialBodyAbstract.prototype, "velocity", {
            get: function () {
                var velocity = Vector2.fromObj(this.body.velocity).divScalar(spaceScale);
                return watchVector(velocity, this.setVelocity.bind(this));
            },
            set: function (velocity) {
                velocity = Matter.Vector.create(velocity.x * spaceScale, velocity.y * spaceScale);
                Matter.Body.setVelocity(this.body, velocity);
            },
            enumerable: false,
            configurable: true
        });
        MaterialBodyAbstract.prototype.setVelocity = function (velocity) {
            this.velocity = velocity;
        };
        Object.defineProperty(MaterialBodyAbstract.prototype, "angle", {
            get: function () {
                return this.body.angle;
            },
            set: function (angle) {
                Matter.Body.setAngle(this.body, angle);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MaterialBodyAbstract.prototype, "angularVelocity", {
            get: function () {
                return this.body.angularVelocity;
            },
            set: function (angularVelocity) {
                Matter.Body.setAngularVelocity(this.body, angularVelocity);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MaterialBodyAbstract.prototype, "static", {
            get: function () {
                return this.body.isStatic;
            },
            set: function (isStatic) {
                Matter.Body.setStatic(this.body, isStatic);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MaterialBodyAbstract.prototype, "ghost", {
            get: function () {
                return this.body.isSensor;
            },
            set: function (isGhost) {
                this.body.isSensor = isGhost;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MaterialBodyAbstract.prototype, "collisionCategory", {
            set: function (categoryIndex) {
                var oldCategoryIndex = this.collisionCategoryToIndex(this.body.collisionFilter.category);
                bodies[oldCategoryIndex].delete(this.body.id);
                this.body.collisionFilter.category = this.collisionIndexToCategory(categoryIndex);
                bodies[categoryIndex].set(this.body.id, this);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MaterialBodyAbstract.prototype, "collidesWith", {
            set: function (category) {
                var _this = this;
                this.body.collisionFilter.mask = 0;
                if (category === "everything") {
                    this.body.collisionFilter.mask = 0xFFFFFFFF;
                }
                else if (category === "nothing") {
                    this.body.collisionFilter.mask = 0;
                }
                else if (Array.isArray(category)) {
                    category.map(function (subCategory) { return _this.setCollidesWith(subCategory); });
                }
                else {
                    this.setCollidesWith(category);
                }
            },
            enumerable: false,
            configurable: true
        });
        MaterialBodyAbstract.prototype.setCollidesWith = function (category) {
            this.validateCollisionIndex(category);
            if (category >= 0) {
                this.body.collisionFilter.mask |= 1 << category;
            }
            else {
                this.body.collisionFilter.mask &= ~(1 << -category);
            }
            return this;
        };
        MaterialBodyAbstract.prototype.rotate = function (rotation) {
            Matter.Body.rotate(this.body, rotation);
            return this;
        };
        MaterialBodyAbstract.prototype.applyForce = function (force, position) {
            if (position === void 0) { position = this.position; }
            var forceScale = spaceScale * spaceScale * spaceScale * forceUnit;
            var matterForce = Matter.Vector.create(force.x * forceScale, force.y * forceScale);
            var matterPosition = Matter.Vector.create(position.x * spaceScale, position.y * spaceScale);
            queueMicrotask(Matter.Body.applyForce.bind(globalThis, this.body, matterPosition, matterForce));
            return this;
        };
        MaterialBodyAbstract.prototype.kill = function () {
            _super.prototype.kill.call(this);
            this.remove();
        };
        MaterialBodyAbstract.prototype.remove = function () {
            var categoryIndex = this.collisionCategoryToIndex(this.body.collisionFilter.category);
            bodies[categoryIndex].delete(this.body.id);
            Matter.World.remove(world, this.body);
        };
        return MaterialBodyAbstract;
    }(BodyAbstract));
    var RectBody = (function (_super) {
        __extends(RectBody, _super);
        function RectBody(x, y, width, height, options) {
            var body = Matter.Bodies.rectangle(x * spaceScale, y * spaceScale, width * spaceScale, height * spaceScale, options);
            return _super.call(this, body) || this;
        }
        return RectBody;
    }(MaterialBodyAbstract));
    var CircleBody = (function (_super) {
        __extends(CircleBody, _super);
        function CircleBody(x, y, radius, options) {
            var body = Matter.Bodies.circle(x * spaceScale, y * spaceScale, radius * spaceScale, options);
            return _super.call(this, body) || this;
        }
        return CircleBody;
    }(MaterialBodyAbstract));
    var PolyBody = (function (_super) {
        __extends(PolyBody, _super);
        function PolyBody(x, y, verts, options) {
            var matterVerts = verts.map(function (subVerts) { return subVerts.map(function (vert) { return Matter.Vector.create(vert.x * spaceScale, vert.y * spaceScale); }); });
            var body = Matter.Bodies.fromVertices(x * spaceScale, y * spaceScale, matterVerts, options);
            return _super.call(this, body) || this;
        }
        return PolyBody;
    }(MaterialBodyAbstract));
    var GridBody = (function (_super) {
        __extends(GridBody, _super);
        function GridBody(width, height, grid, options, gridScale) {
            if (options === void 0) { options = {}; }
            if (gridScale === void 0) { gridScale = 1; }
            var _this = this;
            var _a;
            _this = _super.call(this, Matter.Body.create({})) || this;
            (_a = options.isStatic) !== null && _a !== void 0 ? _a : (options.isStatic = true);
            var bodyOffset = { x: 0, y: 0 };
            if (options.position) {
                bodyOffset = options.position;
                options.position = { x: 0, y: 0 };
            }
            _this.x = bodyOffset.x;
            _this.y = bodyOffset.y;
            _this.width = width;
            _this.height = height;
            _this.gridScale = gridScale;
            _this.options = options;
            _this.buildBody(grid);
            return _this;
        }
        GridBody.prototype.buildBody = function (grid, minX, minY, maxX, maxY) {
            var _a;
            if (minX === void 0) { minX = 0; }
            if (minY === void 0) { minY = 0; }
            if (maxX === void 0) { maxX = Infinity; }
            if (maxY === void 0) { maxY = Infinity; }
            if (this.static) {
                this.buildParts(grid, minX, minY, maxX, maxY);
                Matter.Body.translate(this.body, {
                    x: (this.body.bounds.min.x + (this.x - minX * this.gridScale) * spaceScale),
                    y: (this.body.bounds.min.y + (this.y - minY * this.gridScale) * spaceScale)
                });
            }
            else {
                var angle = (_a = this.options.angle) !== null && _a !== void 0 ? _a : 0;
                if (this.body !== undefined) {
                    angle = this.body.angle;
                    Matter.Body.setAngle(this.body, 0);
                }
                this.buildParts(grid, minX, minY, maxX, maxY);
                Matter.Body.setAngle(this.body, angle);
                Matter.Body.setPosition(this.body, { x: this.x * spaceScale, y: this.y * spaceScale });
            }
        };
        Object.defineProperty(GridBody.prototype, "static", {
            get: function () {
                if (this.body === undefined) {
                    return this.options.isStatic;
                }
                return this.body.isStatic;
            },
            enumerable: false,
            configurable: true
        });
        GridBody.prototype.buildParts = function (grid, minX, minY, maxX, maxY) {
            var e_5, _a, e_6, _b;
            var startX = Math.max(0, minX), startY = Math.max(0, minY), endX = Math.min(this.width, maxX), endY = Math.min(this.height, maxY);
            var stripMap = new Map();
            for (var y = startY; y < endY; y++) {
                var runStart = undefined;
                for (var x = startX; x < endX; x++) {
                    if (!!grid[x + y * this.width]) {
                        if (runStart === undefined) {
                            runStart = x;
                        }
                    }
                    else {
                        if (runStart !== undefined) {
                            stripMap.set(runStart + y * this.width, { width: x - runStart, height: 1 });
                            runStart = undefined;
                        }
                    }
                }
                if (runStart !== undefined) {
                    stripMap.set(runStart + y * this.width, { width: endX - runStart, height: 1 });
                }
            }
            try {
                for (var _c = __values(stripMap.entries()), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var _e = __read(_d.value, 2), key_1 = _e[0], strip = _e[1];
                    var combineStripKey = key_1;
                    while (true) {
                        combineStripKey += this.width;
                        var combineStrip = stripMap.get(combineStripKey);
                        if (combineStrip === undefined || combineStrip.width !== strip.width)
                            break;
                        strip.height += combineStrip.height;
                        stripMap.delete(combineStripKey);
                    }
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_5) throw e_5.error; }
            }
            var parts = [];
            var scaleProduct = this.gridScale * spaceScale;
            try {
                for (var _f = __values(stripMap.entries()), _g = _f.next(); !_g.done; _g = _f.next()) {
                    var _h = __read(_g.value, 2), key_2 = _h[0], strip = _h[1];
                    var x = key_2 % this.width, y = Math.floor(key_2 / this.width);
                    var part = createRectBodyFast(x * scaleProduct, y * scaleProduct, strip.width * scaleProduct, strip.height * scaleProduct);
                    part.__brassBody__ = this;
                    parts.push(part);
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                }
                finally { if (e_6) throw e_6.error; }
            }
            var cornerPart = createRectBodyFast(minX * scaleProduct, minY * scaleProduct, 0.01, 0.01);
            cornerPart.__brassBody__ = this;
            parts.push(cornerPart);
            this.options.parts = parts;
            var body = Matter.Body.create(this.options);
            this.setBody(body);
        };
        return GridBody;
    }(MaterialBodyAbstract));
    function createRectBodyFast(x, y, width, height) {
        var body = {
            id: Matter.Common.nextId(),
            type: "body",
            label: "rectBody",
            plugin: {},
            parts: [],
            angle: 0,
            vertices: [
                { x: -width * 0.5, y: -height * 0.5, index: 0, isInternal: false },
                { x: width * 0.5, y: -height * 0.5, index: 1, isInternal: false },
                { x: width * 0.5, y: height * 0.5, index: 2, isInternal: false },
                { x: -width * 0.5, y: height * 0.5, index: 3, isInternal: false }
            ],
            position: { x: x + width * 0.5, y: y + height * 0.5 },
            force: { x: 0, y: 0 },
            torque: 0,
            positionImpulse: { x: 0, y: 0 },
            constraintImpulse: { x: 0, y: 0, angle: 0 },
            totalContacts: 0,
            speed: 0,
            angularSpeed: 0,
            velocity: { x: 0, y: 0 },
            angularVelocity: 0,
            isSensor: false,
            isStatic: false,
            isSleeping: false,
            motion: 0,
            sleepThreshold: 60,
            density: 0.001,
            restitution: 0,
            friction: 0.1,
            frictionStatic: 0.5,
            frictionAir: 0.01,
            collisionFilter: {
                category: 0x0001,
                mask: 0xFFFFFFFF,
                group: 0
            },
            slop: 0.05,
            timeScale: 1,
            circleRadius: 0,
            positionPrev: { x: x + width * 0.5, y: y + height * 0.5 },
            anglePrev: 0,
            area: 0,
            mass: 0,
            inertia: 0,
            _original: null
        };
        body.parts = [body];
        body.parent = body;
        Matter.Body.set(body, {
            bounds: Matter.Bounds.create(body.vertices),
            vertices: body.vertices,
        });
        Matter.Bounds.update(body.bounds, body.vertices, body.velocity);
        return body;
    }
    var RayBody = (function (_super) {
        __extends(RayBody, _super);
        function RayBody(x, y, width, options) {
            if (width === void 0) { width = 0.1; }
            if (options === void 0) { options = {}; }
            var _this = this;
            var _a, _b;
            _this = _super.call(this) || this;
            _this.id = Symbol();
            _this.position = new Vector2(x, y);
            _this.velocity = Vector2.fromObj((_a = options.velocity) !== null && _a !== void 0 ? _a : { x: 0, y: 0 });
            _this.width = width;
            _this.mask = _this.validateCollisionMask((_b = options.mask) !== null && _b !== void 0 ? _b : 0xFFFFFFFF);
            rays.set(_this.id, _this);
            return _this;
        }
        Object.defineProperty(RayBody.prototype, "angle", {
            get: function () {
                throw Error("RayBody can't have rotation");
            },
            set: function (_) {
                throw Error("RayBody can't have rotation");
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(RayBody.prototype, "angularVelocity", {
            get: function () {
                throw Error("RayBody can't have rotation");
            },
            set: function (_) {
                throw Error("RayBody can't have rotation");
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(RayBody.prototype, "static", {
            get: function () {
                return false;
            },
            set: function (isStatic) {
                if (isStatic === true) {
                    throw Error("RayBody can't have static behaviour enabled");
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(RayBody.prototype, "ghost", {
            get: function () {
                return true;
            },
            set: function (isGhost) {
                if (isGhost === false) {
                    throw Error("RayBody can't have ghost behaviour disabled");
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(RayBody.prototype, "collisionCategory", {
            set: function (_) { },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(RayBody.prototype, "collidesWith", {
            set: function (category) {
                var _this = this;
                this.mask = 0;
                if (category === "everything") {
                    this.mask = 0xFFFFFFFF;
                }
                else if (category === "nothing") {
                    this.mask = 0;
                }
                else if (Array.isArray(category)) {
                    category.map(function (subCategory) { return _this.setCollidesWith(subCategory); });
                }
                else {
                    this.setCollidesWith(category);
                }
            },
            enumerable: false,
            configurable: true
        });
        RayBody.prototype.setCollidesWith = function (category) {
            this.validateCollisionIndex(category);
            if (category >= 0) {
                this.mask |= 1 << category;
            }
            else {
                this.mask &= ~(1 << -category);
            }
            return this;
        };
        RayBody.prototype.rotate = function (_) {
            throw Error("RayBody can't have rotation");
        };
        RayBody.prototype.applyForce = function () {
            throw Error("RayBody can't have forces applied");
        };
        RayBody.prototype.kill = function () {
            _super.prototype.kill.call(this);
            this.remove();
        };
        RayBody.prototype.remove = function () {
            rays.delete(this.id);
        };
        RayBody.prototype.castOverTime = function (delta, steps) {
            var timeSteps = (delta / 1000 * 60);
            var displacement = this.velocity.copy().multScalar(timeSteps);
            return this.cast(displacement, steps);
        };
        RayBody.prototype.cast = function (_displacement, steps) {
            if (steps === void 0) { steps = 20; }
            var displacement = _displacement.multScalar(spaceScale);
            var testBrassBodies = [];
            for (var i = 0; i < 32; i++) {
                if (!(this.mask & (1 << i)))
                    continue;
                testBrassBodies.push.apply(testBrassBodies, __spreadArray([], __read(Array.from(bodies[i].values())), false));
            }
            var testBodies = testBrassBodies.map(function (brassBody) { return brassBody.body; });
            var start = this.position.copy().multScalar(spaceScale);
            var testPoint = 1, testJump = 0.5, hits = [], hitEnd = displacement.copy().multScalar(testPoint).add(start), hitPoint = 1;
            for (var i = 0; i < steps; i++) {
                var end = displacement.copy().multScalar(testPoint).add(start);
                var currentHits = Matter.Query.ray(testBodies, start, end, this.width * spaceScale);
                if (currentHits.length < 1) {
                    if (i === 0)
                        break;
                    testPoint += testJump;
                    testJump /= 2;
                }
                else if (currentHits.length === 1) {
                    hits = currentHits;
                    hitPoint = testPoint;
                    hitEnd = end;
                    testPoint -= testJump;
                    testJump /= 2;
                }
                else {
                    if (currentHits.length !== 1) {
                        hits = currentHits;
                        hitPoint = testPoint;
                        hitEnd = end;
                    }
                    testPoint -= testJump;
                    testJump /= 2;
                }
            }
            if (hits.length > 1) {
                hits = hits.sort(function (a, b) { return start.distSq(a.bodyA.position) - start.distSq(b.bodyA.position); });
            }
            var hitBody;
            if (hits.length === 0) {
                hitBody = null;
            }
            else {
                hitBody = hits[0].parentA.__brassBody__;
            }
            return {
                point: hitEnd.divScalar(spaceScale),
                dist: displacement.mag * hitPoint / spaceScale,
                body: hitBody
            };
        };
        return RayBody;
    }(BodyAbstract));

    var tilemapList = [];
    function update$1() {
        var e_1, _a;
        try {
            for (var tilemapList_1 = __values(tilemapList), tilemapList_1_1 = tilemapList_1.next(); !tilemapList_1_1.done; tilemapList_1_1 = tilemapList_1.next()) {
                var tilemap = tilemapList_1_1.value;
                tilemap.maintain();
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (tilemapList_1_1 && !tilemapList_1_1.done && (_a = tilemapList_1.return)) _a.call(tilemapList_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    var TilemapAbstract = (function () {
        function TilemapAbstract(width, height, options) {
            if (options === void 0) { options = {}; }
            var _a, _b, _c, _d, _e, _f;
            this.width = width;
            this.height = height;
            this.tileSize = (_a = options.tileSize) !== null && _a !== void 0 ? _a : 1;
            this.fields = [];
            this.fieldTypes = (_b = options.fields) !== null && _b !== void 0 ? _b : {
                "_DEFAULTFIELD": "uint8"
            };
            var solidFieldName = (_c = options.solidField) !== null && _c !== void 0 ? _c : "";
            if (this.fieldTypes[solidFieldName] === undefined) {
                this.fieldTypes[solidFieldName] = "uint8";
            }
            else if (this.fieldTypes[solidFieldName] !== "uint8") {
                throw Error("Solid field must be of type uint8");
            }
            this.fields = [];
            this.fieldIds = {};
            for (var fieldName in this.fieldTypes) {
                var fieldType = this.fieldTypes[fieldName];
                var upperFieldName = fieldName.toUpperCase();
                if (this[upperFieldName] !== undefined) {
                    throw Error("field name (".concat(upperFieldName, ") collided in tilemap namespace"));
                }
                this[upperFieldName] = this.fields.length;
                this.fieldIds[fieldName] = this.fields.length;
                this.fields.push(this.createField(fieldType));
            }
            this.solidFieldId = this.fieldIds[solidFieldName];
            if (isPhysicsRunning()) {
                if (options.body === undefined) {
                    console.warn("Matter physics is running but Tilemap does not have body; If this is intentional pass false for the body option");
                }
            }
            this.hasBody = !!options.body;
            this.autoMaintainBody = (_d = options.autoMaintainBody) !== null && _d !== void 0 ? _d : true;
            this.getTileData = (_e = this.bindOptionsFunction(options.getTileData)) !== null && _e !== void 0 ? _e : this.get;
            this.isTileSolid = (_f = this.bindOptionsFunction(options.isTileSolid)) !== null && _f !== void 0 ? _f : null;
            var solidField = this.fields[this.solidFieldId];
            if (this.isTileSolid !== null) {
                var nullTileSolid = this.isTileSolid(this.getTileData(0, 0)) ? 1 : 0;
                solidField.data.fill(nullTileSolid);
            }
            this.body = null;
            if (this.hasBody) {
                var bodyOptions = {};
                if (typeof options.body === "object") {
                    bodyOptions = options.body;
                }
                this.body = new GridBody(this.width, this.height, solidField.data, bodyOptions, this.tileSize);
            }
            this.bodyValid = this.hasBody;
            tilemapList.push(this);
        }
        TilemapAbstract.prototype.bindOptionsFunction = function (func) {
            if (!func)
                return func;
            return safeBind(func, this);
        };
        TilemapAbstract.prototype.maintain = function () {
            if (this.autoMaintainBody)
                this.maintainBody();
        };
        TilemapAbstract.prototype.maintainBody = function (minX, minY, maxX, maxY) {
            if (this.body === null ||
                this.bodyValid)
                return;
            var solidField = this.fields[this.solidFieldId];
            this.body.buildBody(solidField.data, minX, minY, maxX, maxY);
            this.bodyValid = true;
        };
        TilemapAbstract.prototype.get = function (x, y, fieldId) {
            if (fieldId === void 0) { fieldId = 0; }
            if (!this.validateCoord(x, y))
                return undefined;
            var field = this.fields[fieldId];
            if (field.sparse) {
                var value = field.data["".concat(x, ",").concat(y)];
                if (value === undefined)
                    return null;
                return value;
            }
            return field.data[x + y * this.width];
        };
        TilemapAbstract.prototype.set = function (value, x, y, fieldId) {
            if (fieldId === void 0) { fieldId = 0; }
            if (!this.validateCoord(x, y))
                return false;
            var field = this.fields[fieldId];
            if (field.sparse) {
                field.data["".concat(x, ",").concat(y)] = value;
            }
            else {
                field.data[x + y * this.width] = value;
            }
            this.clearCacheAtTile(x, y);
            this.updateSolidAtTile(x, y);
            return true;
        };
        TilemapAbstract.prototype.getSolid = function (x, y) {
            var solid = this.get(x, y, this.solidFieldId);
            if (solid === undefined)
                return undefined;
            return Boolean(solid);
        };
        TilemapAbstract.prototype.export = function () {
            var fields = {};
            for (var fieldName in this.fieldIds) {
                var fieldId = this.fieldIds[fieldName];
                var fieldType = this.fieldTypes[fieldName];
                var fieldData = this.fields[fieldId].data;
                if (fieldType === "sparse") {
                    fields[fieldName] = {
                        type: "sparse",
                        data: fieldData
                    };
                }
                else if (fieldType === "any") {
                    fields[fieldName] = {
                        type: "any",
                        data: fieldData
                    };
                }
                else {
                    fields[fieldName] = {
                        type: fieldType,
                        data: encodeDynamicTypedArray(fieldData),
                        encoding: fieldType
                    };
                }
            }
            return {
                width: this.width,
                height: this.height,
                objects: [],
                tilesets: {},
                fields: fields
            };
        };
        TilemapAbstract.prototype.import = function (world) {
            if (world === null) {
                throw Error("Tried to import (null) as world; Did you pass Brass.getWorld() before the world loaded?");
            }
            if (world.width > this.width ||
                world.height > this.height)
                throw Error("Can't import world larger than tilemap");
            this.clearCaches();
            this.clearFields();
            for (var fieldName in world.fields) {
                var feildId = this.fieldIds[fieldName];
                if (feildId === undefined) {
                    throw Error("Can't import field (".concat(fieldName, "); field was not declared for the tilemap"));
                }
                var feildType = this.fieldTypes[fieldName];
                var field = world.fields[fieldName];
                if (feildType === undefined || feildType !== field.type) {
                    throw Error("Can't import field (".concat(fieldName, "); field type did not match with any fields declared for the tilemap"));
                }
                if (field.type === "sparse") {
                    this.fields[feildId] = {
                        sparse: true,
                        data: field.data
                    };
                }
                else {
                    var data = void 0;
                    if ("encoding" in field) {
                        var encodedData = decodeDynamicTypedArray(field.encoding, field.data);
                        if (field.encoding !== field.type) {
                            data = cloneDynamicArray(field.type, encodedData);
                        }
                        else {
                            data = encodedData;
                        }
                    }
                    else {
                        data = field.data;
                    }
                    if (this.width === world.width &&
                        this.height === world.height) {
                        this.fields[feildId].data = data;
                    }
                    else {
                        for (var x = 0; x < world.width; x++) {
                            for (var y = 0; y < world.height; y++) {
                                this.fields[feildId].data[x + y * this.width] = data[x + y * world.width];
                            }
                        }
                    }
                }
            }
            for (var x = 0; x < world.width; x++) {
                for (var y = 0; y < world.height; y++) {
                    this.updateSolidAtTile(x, y);
                }
            }
        };
        TilemapAbstract.prototype.updateSolidAtTile = function (x, y) {
            if (this.isTileSolid === null)
                return;
            var solidField = this.fields[this.solidFieldId];
            var isSolid = this.isTileSolid(this.getTileData(x, y));
            var solidIndex = x + y * this.width;
            if (this.body !== null) {
                if (!!solidField.data[solidIndex] !== isSolid) {
                    this.bodyValid = false;
                }
            }
            solidField.data[solidIndex] = isSolid ? 1 : 0;
        };
        TilemapAbstract.prototype.clearFields = function () {
            for (var fieldName in this.fieldIds) {
                var fieldId = this.fieldIds[fieldName];
                if (fieldId === this.solidFieldId)
                    continue;
                var fieldType = this.fieldTypes[fieldName];
                this.fields[fieldId] = this.createField(fieldType);
            }
            for (var x = 0; x < this.width; x++) {
                for (var y = 0; y < this.height; y++) {
                    this.updateSolidAtTile(x, y);
                }
            }
        };
        TilemapAbstract.prototype.createField = function (type) {
            if (type === "sparse") {
                return {
                    sparse: true,
                    data: {}
                };
            }
            else {
                var data = createDynamicArray(type, this.area);
                return {
                    sparse: false,
                    data: data
                };
            }
        };
        TilemapAbstract.prototype.validateCoord = function (x, y) {
            return x >= 0 && x < this.width && y >= 0 && y < this.height;
        };
        Object.defineProperty(TilemapAbstract.prototype, "area", {
            get: function () {
                return this.width * this.height;
            },
            enumerable: false,
            configurable: true
        });
        return TilemapAbstract;
    }());
    var P5Tilemap = (function (_super) {
        __extends(P5Tilemap, _super);
        function P5Tilemap(width, height, options) {
            if (options === void 0) { options = {}; }
            var _this = this;
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            _this = _super.call(this, width, height, options) || this;
            _this.drawCacheMode = (_a = options.drawCacheMode) !== null && _a !== void 0 ? _a : "never";
            _this.drawCacheChunkSize = (_b = options.drawCacheChunkSize) !== null && _b !== void 0 ? _b : (_this.drawCacheMode === "never" ? 1 : 4);
            _this.drawCacheTileResolution = (_c = options.drawCacheTileResolution) !== null && _c !== void 0 ? _c : 64;
            _this.drawCacheDecayTime = (_d = options.drawCacheDecayTime) !== null && _d !== void 0 ? _d : 5000;
            _this.drawCachePadding = (_e = options.drawCachePadding) !== null && _e !== void 0 ? _e : 0;
            _this.drawCachePaddingTime = (_f = options.drawCachePaddingTime) !== null && _f !== void 0 ? _f : 3;
            if ((_g = _this.width / _this.drawCacheChunkSize % 1 !== 0) !== null && _g !== void 0 ? _g : _this.height / _this.drawCacheChunkSize % 1 !== 0) {
                throw Error("Tilemap width and height must be a multiple of drawCacheChunkSize");
            }
            var drawCacheChunkSize = _this.width * _this.height
                / _this.drawCacheChunkSize / _this.drawCacheChunkSize;
            if (_this.drawCacheMode === "never") {
                _this.chunkPool = null;
                _this.chunks = [];
                _this.cacheableChunks = [];
            }
            else {
                var tileCachePixelSize_1 = _this.drawCacheTileResolution * _this.drawCacheChunkSize;
                var drawCachePoolInitalSize = (_h = options.drawCachePoolInitalSize) !== null && _h !== void 0 ? _h : Math.ceil(window.innerWidth * window.innerHeight / tileCachePixelSize_1 / tileCachePixelSize_1);
                _this.chunkPool = new Pool(drawCachePoolInitalSize, false, function () { return ({
                    g: createFastGraphics(tileCachePixelSize_1, tileCachePixelSize_1),
                    lastUsed: getTime()
                }); }, function (_a) {
                    var g = _a.g;
                    return ({ g: g, lastUsed: getTime() });
                });
                _this.chunks = Array(drawCacheChunkSize).fill(null);
                _this.cacheableChunks = Array(drawCacheChunkSize).fill(null);
            }
            _this.drawTile = (_j = _this.bindOptionsFunction(options.drawTile)) !== null && _j !== void 0 ? _j : _this.defaultDrawTile;
            _this.drawOrder = (_k = _this.bindOptionsFunction(options.drawOrder)) !== null && _k !== void 0 ? _k : null;
            _this.canCacheTile = (_l = _this.bindOptionsFunction(options.canCacheTile)) !== null && _l !== void 0 ? _l : null;
            if (_this.canCacheTile === null &&
                _this.drawCacheMode === "check") {
                throw Error("drawCacheMode of \"check\" requires canCacheTile function in options");
            }
            return _this;
        }
        P5Tilemap.prototype.draw = function (v, d) {
            if (v === void 0) { v = getDefaultViewpoint(); }
            if (d === void 0) { d = getP5DrawTarget("defaultP5"); }
            var g = d.getMaps().canvas;
            var viewArea = v.getWorldViewArea(d);
            viewArea.minX = Math.max(0, viewArea.minX / this.tileSize);
            viewArea.minY = Math.max(0, viewArea.minY / this.tileSize);
            viewArea.maxX = Math.min(this.width, viewArea.maxX / this.tileSize);
            viewArea.maxY = Math.min(this.height, viewArea.maxY / this.tileSize);
            viewArea.minX = Math.floor(viewArea.minX / this.drawCacheChunkSize);
            viewArea.minY = Math.floor(viewArea.minY / this.drawCacheChunkSize);
            viewArea.maxX = Math.ceil(viewArea.maxX / this.drawCacheChunkSize);
            viewArea.maxY = Math.ceil(viewArea.maxY / this.drawCacheChunkSize);
            push();
            scale(this.tileSize);
            var alwaysCache = false;
            switch (this.drawCacheMode) {
                default:
                    throw Error("drawCacheMode should be \"never\", \"check\" or \"always\" not (".concat(this.drawCacheMode, ")"));
                case "never":
                    this.drawTiles(viewArea.minX, viewArea.minY, viewArea.maxX, viewArea.maxY, g);
                    break;
                case "always":
                    alwaysCache = true;
                case "check":
                    assert(this.chunkPool !== null);
                    this.padChunks(alwaysCache, v, d);
                    for (var x = viewArea.minX; x < viewArea.maxX; x++) {
                        for (var y = viewArea.minY; y < viewArea.maxY; y++) {
                            if (alwaysCache || this.canCacheChunk(x, y)) {
                                this.drawChunk(x, y, g);
                            }
                            else {
                                var cacheIndex = x + y * (this.width / this.drawCacheChunkSize);
                                var tileCache = this.chunks[cacheIndex];
                                if (tileCache !== null) {
                                    this.chunkPool.release(tileCache);
                                    this.chunks[cacheIndex] = null;
                                }
                                this.drawTiles(Math.max(viewArea.minX * this.drawCacheChunkSize, x * this.drawCacheChunkSize), Math.max(viewArea.minY * this.drawCacheChunkSize, y * this.drawCacheChunkSize), Math.min(viewArea.maxX * this.drawCacheChunkSize, (x + 1) * this.drawCacheChunkSize), Math.min(viewArea.maxY * this.drawCacheChunkSize, (y + 1) * this.drawCacheChunkSize), g);
                            }
                        }
                    }
                    this.cacheableChunks.fill(null);
                    for (var i = 0; i < this.chunks.length; i++) {
                        var tileCache = this.chunks[i];
                        if (tileCache !== null &&
                            getTime() - tileCache.lastUsed > this.drawCacheDecayTime) {
                            this.chunkPool.release(tileCache);
                            this.chunks[i] = null;
                        }
                    }
            }
            pop();
        };
        P5Tilemap.prototype.padChunks = function (alwaysCache, v, d) {
            if (v === void 0) { v = getDefaultViewpoint(); }
            assert(this.chunkPool !== null);
            var viewArea = v.getWorldViewArea(d);
            viewArea.minX = Math.max(0, viewArea.minX / this.tileSize - this.drawCachePadding);
            viewArea.minY = Math.max(0, viewArea.minY / this.tileSize - this.drawCachePadding);
            viewArea.maxX = Math.min(this.width, viewArea.maxX / this.tileSize + this.drawCachePadding);
            viewArea.maxY = Math.min(this.height, viewArea.maxY / this.tileSize + this.drawCachePadding);
            viewArea.minX = Math.floor(viewArea.minX / this.drawCacheChunkSize);
            viewArea.minY = Math.floor(viewArea.minY / this.drawCacheChunkSize);
            viewArea.maxX = Math.ceil(viewArea.maxX / this.drawCacheChunkSize);
            viewArea.maxY = Math.ceil(viewArea.maxY / this.drawCacheChunkSize);
            var endTime = getExactTime() + this.drawCachePaddingTime;
            var rush = false;
            for (var x = viewArea.minX; x < viewArea.maxX; x++) {
                for (var y = viewArea.minY; y < viewArea.maxY; y++) {
                    var cacheIndex = x + y * (this.width / this.drawCacheChunkSize);
                    var tileCache = this.chunks[cacheIndex];
                    if (tileCache === null) {
                        if (!rush && (alwaysCache || this.canCacheChunk(x, y))) {
                            tileCache = this.chunkPool.get();
                            this.chunks[cacheIndex] = tileCache;
                            this.renderChunk(x, y, tileCache);
                            if (getExactTime() > endTime)
                                rush = true;
                        }
                    }
                    else {
                        tileCache.lastUsed = getTime();
                    }
                }
            }
        };
        P5Tilemap.prototype.canCacheChunk = function (chunkX, chunkY) {
            assert(this.canCacheTile !== null);
            var chunkIndex = chunkX + chunkY * (this.height / this.drawCacheChunkSize);
            var initCacheValue = this.cacheableChunks[chunkIndex];
            if (initCacheValue !== null)
                return initCacheValue;
            for (var x = 0; x < this.drawCacheChunkSize; x++) {
                for (var y = 0; y < this.drawCacheChunkSize; y++) {
                    var worldX = x + chunkX * this.drawCacheChunkSize, worldY = y + chunkY * this.drawCacheChunkSize;
                    var data = this.getTileData(worldX, worldY);
                    if (!this.canCacheTile(data)) {
                        this.cacheableChunks[chunkIndex] = false;
                        return false;
                    }
                }
            }
            this.cacheableChunks[chunkIndex] = true;
            return true;
        };
        P5Tilemap.prototype.renderChunk = function (chunkX, chunkY, tileCache) {
            var e_2, _a;
            var cache = tileCache.g;
            cache.push();
            cache.clear(0, 0, 0, 0);
            cache.scale(this.drawCacheTileResolution);
            var drawList = [];
            for (var x = 0; x < this.drawCacheChunkSize; x++) {
                for (var y = 0; y < this.drawCacheChunkSize; y++) {
                    var worldX = x + chunkX * this.drawCacheChunkSize, worldY = y + chunkY * this.drawCacheChunkSize;
                    var data = this.getTileData(worldX, worldY);
                    if (this.drawOrder) {
                        drawList.push({
                            data: data,
                            x: x,
                            y: y,
                            order: this.drawOrder(data)
                        });
                    }
                    else {
                        this.drawTile(data, x, y, cache);
                    }
                }
            }
            if (this.drawOrder) {
                drawList.sort(function (a, b) { return a.order - b.order; });
                try {
                    for (var drawList_1 = __values(drawList), drawList_1_1 = drawList_1.next(); !drawList_1_1.done; drawList_1_1 = drawList_1.next()) {
                        var drawItem = drawList_1_1.value;
                        this.drawTile(drawItem.data, drawItem.x, drawItem.y, cache);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (drawList_1_1 && !drawList_1_1.done && (_a = drawList_1.return)) _a.call(drawList_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
            cache.pop();
        };
        P5Tilemap.prototype.drawChunk = function (chunkX, chunkY, g) {
            var tileImage = this.maintainChunk(chunkX, chunkY);
            g.image(tileImage, chunkX * this.drawCacheChunkSize, chunkY * this.drawCacheChunkSize, this.drawCacheChunkSize, this.drawCacheChunkSize);
        };
        P5Tilemap.prototype.maintainChunk = function (chunkX, chunkY) {
            assert(this.chunkPool !== null);
            var tileCacheIndex = chunkX + chunkY * (this.width / this.drawCacheChunkSize);
            var tileCache = this.chunks[tileCacheIndex];
            if (tileCache === null ||
                getTime() - tileCache.lastUsed > this.drawCacheDecayTime) {
                if (tileCache === null) {
                    tileCache = this.chunkPool.get();
                    this.chunks[tileCacheIndex] = tileCache;
                }
                this.renderChunk(chunkX, chunkY, tileCache);
            }
            return tileCache.g;
        };
        P5Tilemap.prototype.drawTiles = function (minX, minY, maxX, maxY, g) {
            var e_3, _a;
            g.push();
            var drawList = [];
            for (var x = minX; x < maxX; x++) {
                for (var y = minY; y < maxY; y++) {
                    var data = this.getTileData(x, y);
                    if (this.drawOrder) {
                        drawList.push({
                            data: data,
                            x: x,
                            y: y,
                            order: this.drawOrder(data)
                        });
                    }
                    else {
                        this.drawTile(data, x, y, g);
                    }
                }
            }
            if (this.drawOrder) {
                drawList.sort(function (a, b) { return a.order - b.order; });
                try {
                    for (var drawList_2 = __values(drawList), drawList_2_1 = drawList_2.next(); !drawList_2_1.done; drawList_2_1 = drawList_2.next()) {
                        var drawItem = drawList_2_1.value;
                        this.drawTile(drawItem.data, drawItem.x, drawItem.y, g);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (drawList_2_1 && !drawList_2_1.done && (_a = drawList_2.return)) _a.call(drawList_2);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            }
            g.pop();
        };
        P5Tilemap.prototype.defaultDrawTile = function (data, x, y, g) {
            g.noStroke();
            var brightness = (x + y) % 2 * 255;
            g.fill(brightness);
            g.rect(x, y, 1, 1);
            g.fill(255 - brightness);
            g.textAlign(CENTER, CENTER);
            g.textSize(0.2);
            g.text(String(data), x + 0.5001, y + 0.5001);
        };
        P5Tilemap.prototype.clearCaches = function () {
            var e_4, _a;
            if (this.drawCacheMode === "never")
                return;
            assert(this.chunkPool !== null);
            try {
                for (var _b = __values(this.chunks), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var cache = _c.value;
                    if (cache === null)
                        continue;
                    this.chunkPool.release(cache);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_4) throw e_4.error; }
            }
            this.chunks.fill(null);
            this.cacheableChunks.fill(null);
        };
        P5Tilemap.prototype.clearCacheAtTile = function (tileX, tileY) {
            var tileCacheIndex = Math.floor(tileX / this.drawCacheChunkSize) +
                Math.floor(tileY / this.drawCacheChunkSize) * (this.width / this.drawCacheChunkSize);
            var tileCache = this.chunks[tileCacheIndex];
            if (tileCache == null)
                return;
            assert(this.chunkPool !== null);
            this.chunkPool.release(tileCache);
            this.chunks[tileCacheIndex] = null;
        };
        return P5Tilemap;
    }(TilemapAbstract));

    var inited = false;
    var testStatus = null;
    var sketch;
    var maxTimeDelta, targetTimeDelta, minTimeDelta;
    var timewarpList = [];
    var runningPhysics = false;
    window.addEventListener("load", function () {
        window.addEventListener("error", function (error) { return setTestStatus(error.message); });
    });
    function setTestStatus(newStatus) {
        if (newStatus === false)
            return;
        if (typeof testStatus === "string")
            return;
        testStatus = newStatus;
    }
    function getTestStatus() {
        return testStatus;
    }
    function init(options) {
        var _a, _b, _c, _d, _e;
        if (options === void 0) { options = {}; }
        if (options.sound === undefined && p5__default["default"].SoundFile !== undefined) {
            console.warn("p5.sound.js has been found; Enable or disable sound in Brass.init()");
        }
        if (options.matter === undefined && globalThis.Matter !== undefined) {
            console.warn("matter.js has been found; Enable or disable matter in Brass.init()");
        }
        if (options.regl === undefined && globalThis.createREGL !== undefined) {
            console.warn("regl.js has been found; Enable or disable regl in Brass.init()");
        }
        if (options.sketch) {
            sketch = options.sketch;
        }
        else {
            if (!("p5" in globalThis)) {
                throw Error("Can't find p5.js, it is required for Brass");
            }
            if (!("setup" in globalThis)) {
                throw Error("Can't seem to find p5; If you are running in instance mode pass the sketch into Brass.init()");
            }
            sketch = globalThis;
        }
        sketch.disableFriendlyErrors = true;
        init$5();
        init$4(sketch, (_a = options.regl) !== null && _a !== void 0 ? _a : false, options.drawTarget);
        init$2(options.viewpoint);
        var targetFrameRate = Math.min(_targetFrameRate, (_b = options.maxFrameRate) !== null && _b !== void 0 ? _b : 60);
        sketch.frameRate(targetFrameRate);
        targetTimeDelta = 1000 / targetFrameRate;
        maxTimeDelta = (_c = options.maxTimeDelta) !== null && _c !== void 0 ? _c : targetTimeDelta * 2.0;
        minTimeDelta = (_d = options.minTimeDelta) !== null && _d !== void 0 ? _d : targetTimeDelta * 0.5;
        update$5();
        init$3((_e = options.sound) !== null && _e !== void 0 ? _e : false);
        runningPhysics = options.matter !== undefined;
        if (runningPhysics) {
            if (typeof options.matter === "object") {
                init$1(options.matter);
            }
            else {
                init$1();
            }
        }
        if (sketch.draw === undefined) {
            sketch.draw = defaultSketchDraw;
        }
        if (sketch.windowResized === undefined) {
            sketch.windowResized = function () { return resize(window.innerWidth, window.innerHeight); };
        }
        inited = true;
    }
    function enforceInit(action) {
        if (inited)
            return;
        throw Error("Brass must be initialized before ".concat(action, "; Run Brass.init()"));
    }
    function defaultSketchDraw() {
        if (!loaded()) {
            drawLoading();
            return;
        }
        var realDelta = deltaTime;
        realDelta = Math.min(maxTimeDelta, realDelta);
        realDelta = Math.max(minTimeDelta, realDelta);
        var simDelta = updateSimTiming(realDelta);
        updateEarly();
        if (sketch.brassUpdate !== undefined)
            sketch.brassUpdate(simDelta);
        updateLate(simDelta);
        if (sketch.brassDraw !== undefined) {
            resetAndSyncDefaultP5DrawTarget();
            sketch.brassDraw(simDelta);
        }
    }
    function updateSimTiming(realDelta) {
        var simDelta = 0;
        while (timewarpList.length > 0) {
            var warpedTime = Math.min(realDelta, timewarpList[0].duration);
            realDelta -= warpedTime;
            simDelta += warpedTime * timewarpList[0].rate;
            timewarpList[0].duration -= warpedTime;
            if (timewarpList[0].duration <= 0)
                timewarpList.shift();
            else
                break;
        }
        simDelta += realDelta;
        deltaSimTime(simDelta);
        return simDelta;
    }
    function update(delta) {
        if (delta === void 0) { delta = deltaTime; }
        enforceInit("updating Brass");
        updateEarly();
        updateLate(delta);
    }
    function updateEarly() {
        update$5();
        update$6();
    }
    function updateLate(delta) {
        enforceInit("updating Brass");
        if (runningPhysics)
            update$2(delta);
        updateViewpoints(delta);
        update$1();
        update$3();
        update$4(delta);
    }
    function timewarp(duration, rate) {
        if (rate === void 0) { rate = 0; }
        timewarpList.push({ duration: duration, rate: rate });
    }
    function getTimewarp() {
        if (timewarpList.length === 0)
            return { duration: Infinity, rate: 1 };
        return timewarpList[0];
    }
    function getTimewarps() {
        return timewarpList;
    }

    var P5Lighter = (function () {
        function P5Lighter(options) {
            if (options === void 0) { options = {}; }
            var _a, _b, _c;
            this.lightSurface = new P5DrawBuffer();
            this.directionalCache = new Map();
            this.viewpoint = null;
            this.resolution = (_a = options.resolution) !== null && _a !== void 0 ? _a : 0.25;
            this._blur = (_b = options.blur) !== null && _b !== void 0 ? _b : 1;
            this.color = (_c = options.color) !== null && _c !== void 0 ? _c : createColor(255);
        }
        P5Lighter.prototype.begin = function (v, d) {
            if (v === void 0) { v = getDefaultViewpoint(); }
            if (d === void 0) { d = getP5DrawTarget("defaultP5"); }
            var newContext = !this.lightSurface.hasSize();
            this.lightSurface.sizeMaps(d.getSize(this.resolution));
            if (newContext)
                this.fill(this.color);
            this.resetLightCanvas();
            var originalScale = v.scale;
            v.scale *= this.resolution;
            v.view(this.lightSurface);
            v.scale = originalScale;
            this.viewpoint = v;
            return this;
        };
        P5Lighter.prototype.end = function (d) {
            if (d === void 0) { d = getP5DrawTarget("defaultP5"); }
            var g = d.getMaps().canvas;
            g.push();
            g.resetMatrix();
            g.blendMode(MULTIPLY);
            g.image(this.getLightCanvas(), 0, 0, width, height);
            g.pop();
        };
        Object.defineProperty(P5Lighter.prototype, "blur", {
            get: function () {
                return this._blur;
            },
            set: function (value) {
                this._blur = value;
                this.fill(this.color);
            },
            enumerable: false,
            configurable: true
        });
        P5Lighter.prototype.fill = function () {
            var colArgs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                colArgs[_i] = arguments[_i];
            }
            var lightCanvas = this.getLightCanvas();
            var col = createColor.apply(void 0, __spreadArray([], __read(colArgs), false));
            lightCanvas.fill(col);
            if (this._blur > 0) {
                var r = red(col), g = green(col), b = blue(col), a = alpha(col);
                lightCanvas.stroke(r, g, b, a / 2);
                lightCanvas.strokeWeight(this._blur);
            }
            else {
                lightCanvas.noStroke();
            }
            this.color = col;
            return this;
        };
        P5Lighter.prototype.point = function (x, y, r) {
            var lightCanvas = this.getLightCanvas();
            lightCanvas.circle(x, y, r * 2);
            return this;
        };
        P5Lighter.prototype.cone = function (x, y, angle, width, distance) {
            if (width === void 0) { width = HALF_PI; }
            if (distance === void 0) { distance = 100; }
            var lightCanvas = this.getLightCanvas();
            lightCanvas.triangle(x, y, x + Math.cos(angle - width / 2) * distance, y + Math.sin(angle - width / 2) * distance, x + Math.cos(angle + width / 2) * distance, y + Math.sin(angle + width / 2) * distance);
            return this;
        };
        P5Lighter.prototype.world = function (vignette) {
            if (vignette === void 0) { vignette = 0; }
            var lightCanvas = this.getLightCanvas();
            if (this.viewpoint === null)
                this.throwBeginError();
            var area = this.viewpoint.getWorldViewArea();
            var areaWidth = area.maxX - area.minX;
            var areaHeight = area.maxY - area.minY;
            var lightSurfaceSize = this.lightSurface.getSize();
            var paddingX = areaWidth * ((4 / lightSurfaceSize.x) - vignette) + this._blur * 2;
            var paddingY = areaHeight * ((4 / lightSurfaceSize.y) - vignette) + this._blur * 2;
            lightCanvas.rect(area.minX - paddingX * 0.5, area.minY - paddingY * 0.5, areaWidth + paddingX * 1, areaHeight + paddingY * 1);
            return this;
        };
        P5Lighter.prototype.directional = function (x, y, radius, options) {
            var e_1, _a;
            var _b;
            if (options === void 0) { options = {}; }
            var points;
            var cache = this.directionalCache.get(options.cacheName);
            if (options.cacheName !== undefined) {
                if (cache === undefined ||
                    getSimTime() > cache.time + ((_b = options.cacheTime) !== null && _b !== void 0 ? _b : Infinity)) {
                    cache = {
                        time: getSimTime(),
                        points: this.simulateDirectional(x, y, radius, options)
                    };
                    this.directionalCache.set(options.cacheName, cache);
                }
                points = cache.points;
            }
            else {
                points = this.simulateDirectional(x, y, radius, options);
            }
            var lightCanvas = this.getLightCanvas();
            lightCanvas.beginShape();
            try {
                for (var points_1 = __values(points), points_1_1 = points_1.next(); !points_1_1.done; points_1_1 = points_1.next()) {
                    var vert = points_1_1.value;
                    lightCanvas.vertex(vert.x, vert.y);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (points_1_1 && !points_1_1.done && (_a = points_1.return)) _a.call(points_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            lightCanvas.endShape(CLOSE);
        };
        P5Lighter.prototype.simulateDirectional = function (x, y, radius, options) {
            var _a, _b;
            if (this.viewpoint === null)
                this.throwBeginError();
            var viewArea = this.viewpoint.getWorldViewArea();
            var center, centerRadius;
            if ((_a = options.drawOffscreen) !== null && _a !== void 0 ? _a : false) {
                center = new Vector2(x, y);
                centerRadius = radius;
            }
            else {
                center = new Vector2((viewArea.minX + viewArea.maxX) / 2, (viewArea.minY + viewArea.maxY) / 2);
                centerRadius = Math.hypot(viewArea.minX - viewArea.maxX, viewArea.minY - viewArea.maxY) * 0.6;
            }
            var vec = new Vector2(x, y);
            var U0 = center.copy().sub(vec);
            var negativeU0 = vec.copy().sub(center);
            var centerDist = U0.mag;
            var lightInArea = centerDist < centerRadius;
            var lightCircleTagentAngle;
            if (lightInArea) {
                lightCircleTagentAngle = HALF_PI;
            }
            else {
                lightCircleTagentAngle = Math.asin(centerRadius / centerDist);
            }
            var points = [];
            var paths = [];
            var centerAngle = negativeU0.angle;
            var startAngle = centerAngle + HALF_PI - lightCircleTagentAngle;
            var endAngle = centerAngle + HALF_PI * 3 + lightCircleTagentAngle;
            var stepAngle = TWO_PI / ((_b = options.rays) !== null && _b !== void 0 ? _b : 50);
            for (var angle = startAngle; angle <= endAngle; angle += stepAngle) {
                var rayDirection = Vector2.fromDirMag(angle, centerRadius)
                    .add(center).sub(vec).norm();
                this.findDirectionalLineSegment(U0, centerRadius, vec, rayDirection, radius, lightInArea, points, paths);
            }
            this.castDirectionalRays(points, paths, options);
            return points;
        };
        P5Lighter.prototype.findDirectionalLineSegment = function (U0, centerRadius, vec, rayDirection, radius, lightInArea, points, paths) {
            var U1 = rayDirection.copy().multScalar(U0.dot(rayDirection));
            var U2 = U0.copy().sub(U1);
            var nearDist = U2.mag;
            if (nearDist > centerRadius)
                return;
            var intersectDist = Math.sqrt(centerRadius * centerRadius - nearDist * nearDist);
            var intersect = rayDirection.copy().multScalar(intersectDist);
            var startOffset = U1.copy().sub(intersect);
            if (!lightInArea && startOffset.mag > radius)
                return;
            var lineStart = startOffset.limit(radius).add(vec);
            var lineEnd = U1.copy().add(intersect).limit(radius).add(vec);
            if (lightInArea) {
                lineStart.set(vec);
            }
            else {
                points.push(lineStart);
            }
            paths.push({
                start: lineStart,
                end: lineEnd,
            });
        };
        P5Lighter.prototype.castDirectionalRays = function (points, paths, options) {
            var _a, _b, _c;
            for (var i = paths.length - 1; i >= 0; i--) {
                var path = paths[i];
                var ray = new RayBody(path.start.x, path.start.y, (_a = options.rayWidth) !== null && _a !== void 0 ? _a : 0.01);
                ray.collidesWith = (_b = options.raysCollideWith) !== null && _b !== void 0 ? _b : "everything";
                var endPoint = ray.cast(path.end.sub(path.start), (_c = options.raySteps) !== null && _c !== void 0 ? _c : 10).point;
                ray.kill();
                points.push(endPoint);
            }
        };
        P5Lighter.prototype.resetLightCanvas = function () {
            var lightCanvas = this.getLightCanvas();
            lightCanvas.push();
            lightCanvas.blendMode(BLEND);
            lightCanvas.background(0);
            lightCanvas.pop();
            lightCanvas.resetMatrix();
        };
        P5Lighter.prototype.getLightCanvas = function () {
            if (!this.lightSurface.hasSize())
                this.throwBeginError();
            return this.lightSurface.getMaps().canvas;
        };
        Object.defineProperty(P5Lighter.prototype, "lightCanvas", {
            get: function () {
                if (!this.lightSurface.hasSize())
                    return null;
                return this.lightSurface.getMaps().canvas;
            },
            enumerable: false,
            configurable: true
        });
        P5Lighter.prototype.throwBeginError = function () {
            throw Error("Lighter.begin() must be ran before using lighting");
        };
        return P5Lighter;
    }());

    exports.AStarPathfinder = AStarPathfinder;
    exports.CanvasDrawTarget = CanvasDrawTarget;
    exports.CircleBody = CircleBody;
    exports.ClassicViewpoint = ClassicViewpoint;
    exports.DrawTarget = DrawTarget;
    exports.GridBody = GridBody;
    exports.Heap = Heap;
    exports.InputMapper = InputMapper;
    exports.MappedHeap = MappedHeap;
    exports.MappedMaxHeap = MappedMaxHeap;
    exports.MappedMinHeap = MappedMinHeap;
    exports.MaxHeap = MaxHeap;
    exports.MinHeap = MinHeap;
    exports.P5DrawTarget = P5DrawTarget;
    exports.P5Lighter = P5Lighter;
    exports.P5Tilemap = P5Tilemap;
    exports.ParticleAbstract = ParticleAbstract;
    exports.PolyBody = PolyBody;
    exports.RayBody = RayBody;
    exports.RectBody = RectBody;
    exports.Vector2 = Vector2;
    exports.Vector3 = Vector3;
    exports.VelocityParticleAbstract = VelocityParticleAbstract;
    exports.Viewpoint = Viewpoint;
    exports.disableContextMenu = disableContextMenu;
    exports.displayRegl = displayRegl;
    exports.drawColliders = drawColliders;
    exports.drawFPS = drawFPS;
    exports.drawLoading = drawLoading;
    exports.drawParticles = draw;
    exports.emitParticle = emitParticle;
    exports.emitParticles = emitParticles;
    exports.enableUnsafeWorldLoading = enableUnsafeWorldLoading;
    exports.forEachParticle = forEachParticle;
    exports.forEachVisableParticle = forEachVisableParticle;
    exports.getCanvasDrawTarget = getCanvasDrawTarget;
    exports.getDefaultViewpoint = getDefaultViewpoint;
    exports.getDrawTarget = getDrawTarget;
    exports.getExactTime = getExactTime;
    exports.getImage = getImage;
    exports.getP5DrawTarget = getP5DrawTarget;
    exports.getRegl = getRegl;
    exports.getSimTime = getSimTime;
    exports.getSound = getSound;
    exports.getTestStatus = getTestStatus;
    exports.getTime = getTime;
    exports.getTimewarp = getTimewarp;
    exports.getTimewarps = getTimewarps;
    exports.getWorld = getWorld;
    exports.hasDrawTarget = hasDrawTarget;
    exports.init = init;
    exports.loadImageDynamic = loadImageDynamic;
    exports.loadImageEarly = loadImageEarly;
    exports.loadImageLate = loadImageLate;
    exports.loadProgress = loadProgress;
    exports.loadSoundEarly = loadSoundEarly;
    exports.loadSoundLate = loadSoundLate;
    exports.loadWorldEarly = loadWorldEarly;
    exports.loadWorldLate = loadWorldLate;
    exports.loaded = loaded;
    exports.refreshRegl = refreshRegl;
    exports.refreshReglFast = refreshReglFast;
    exports.resize = resize;
    exports.setDefaultViewpoint = setDefaultViewpoint;
    exports.setDrawTarget = setDrawTarget;
    exports.setLoadingTips = setLoadingTips;
    exports.setParticleLimit = setParticleLimit;
    exports.setTestStatus = setTestStatus;
    exports.timewarp = timewarp;
    exports.update = update;
    exports.watchVector = watchVector;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({}, p5);
