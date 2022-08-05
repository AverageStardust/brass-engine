// library : Brass Engine
// version : 0.17.0dev
// author  : Wyatt Durbano (WD_STEVE)
// required: p5
// optional: p5.sound, matter.js, regl.js

(function (exports, p5) {
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

    function safeBind(func, thisArg) {
        var argArray = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            argArray[_i - 2] = arguments[_i];
        }
        assert(Object.hasOwn(func, "prototype"), "Can't bind context to function (".concat(func.name, "); Use the Function keyword and do not bind before-hand"));
        return func.bind.apply(func, __spreadArray([thisArg], __read(argArray), false));
    }
    function assert(condition, message) {
        if (message === void 0) { message = "Assertion failed"; }
        if (!condition) {
            throw Error(message);
        }
    }
    function expect(condition, message) {
        if (message === void 0) { message = "Expectation failed"; }
        if (!condition) {
            console.error(message);
        }
    }

    var VectorAbstract = (function () {
        function VectorAbstract() {
        }
        VectorAbstract.prototype.watch = function (watcher) {
            return new Proxy(this, {
                get: this.getWatchedValue.bind(this, watcher),
                set: this.setWatchedValue.bind(this, watcher)
            });
        };
        VectorAbstract.prototype.getWatchedValue = function (watcher, _, prop) {
            var value = Reflect.get(this, prop);
            if (typeof value === "function") {
                return this.watchedVectorMethodWrapper.bind(this, watcher, value);
            }
            return value;
        };
        VectorAbstract.prototype.setWatchedValue = function (watcher, _, prop, value) {
            var oldValue = Reflect.get(this, prop);
            var success = Reflect.set(this, prop, value);
            if (!success)
                return false;
            if (oldValue === value)
                return true;
            watcher(this);
            return true;
        };
        VectorAbstract.prototype.watchedVectorMethodWrapper = function (watcher, method) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var oldArray = this.array;
            var result = method.call.apply(method, __spreadArray([this], __read(args), false));
            var newArray = this.array;
            for (var i = 0; i < oldArray.length; i++) {
                if (oldArray[i] !== newArray[i]) {
                    watcher(this);
                    break;
                }
            }
            return result;
        };
        return VectorAbstract;
    }());

    var Vector2 = (function (_super) {
        __extends(Vector2, _super);
        function Vector2(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            var _this = _super.call(this) || this;
            _this.x = x;
            _this.y = y;
            return _this;
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
        Vector2.prototype.equalScalar = function (x, y) {
            if (y === void 0) { y = x; }
            return this.x === x && this.y === y;
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
        Vector2.prototype.min = function (vec) {
            this.x = Math.min(this.x, vec.x);
            this.y = Math.min(this.y, vec.y);
            return this;
        };
        Vector2.prototype.minScalar = function (x, y) {
            if (y === void 0) { y = x; }
            this.x = Math.min(this.x, x);
            this.y = Math.min(this.y, y);
            return this;
        };
        Vector2.prototype.max = function (vec) {
            this.x = Math.max(this.x, vec.x);
            this.y = Math.max(this.y, vec.y);
            return this;
        };
        Vector2.prototype.maxScalar = function (x, y) {
            if (y === void 0) { y = x; }
            this.x = Math.max(this.x, x);
            this.y = Math.max(this.y, y);
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
        Object.defineProperty(Vector2.prototype, "xy", {
            get: function () {
                return new Vector2(this.x, this.y);
            },
            set: function (vec) {
                var _a;
                _a = __read(vec.array, 2), this.x = _a[0], this.y = _a[1];
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Vector2.prototype, "yx", {
            get: function () {
                return new Vector2(this.y, this.x);
            },
            set: function (vec) {
                var _a;
                _a = __read(vec.array, 2), this.y = _a[0], this.x = _a[1];
            },
            enumerable: false,
            configurable: true
        });
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
            set: function (_a) {
                var _b = __read(_a, 2), x = _b[0], y = _b[1];
                this.x = x;
                this.y = y;
            },
            enumerable: false,
            configurable: true
        });
        return Vector2;
    }(VectorAbstract));

    var inputDeviceMap = new Map();
    var inputMappers = [];
    var deriverCatalogue = new Map();
    var gamepadLinks = [];
    function init$7() {
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
    ((function (_super) {
        __extends(KeyboardInputDevice, _super);
        function KeyboardInputDevice() {
            var _this = _super.call(this, "keyboard", ["A", "AltLeft", "AltRight", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowUp", "B", "Backspace", "Backquote", "Backslash", "BracketLeft", "BracketRight", "C", "Comma", "ControlLeft", "ControlRight", "D", "Delete", "Digit0", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "E", "Enter", "Equal", "Escape", "F", "F1", "F10", "F11", "F12", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "G", "H", "I", "J", "K", "L", "M", "MetaLeft", "MetaRight", "Minus", "N", "Numpad0", "Numpad1", "Numpad2", "Numpad3", "Numpad4", "Numpad5", "Numpad6", "Numpad7", "Numpad8", "Numpad9", "NumpadAdd", "NumpadDecimal", "NumpadDivide", "NumpadEnter", "NumpadMultiply", "NumpadSubtract", "O", "P", "Period", "Q", "Quote", "R", "S", "Semicolon", "ShiftLeft", "ShiftRight", "Slash", "Space", "T", "U", "V", "W", "X", "Y", "Z"], [], []) || this;
            window.addEventListener("keydown", _this.handleKeyListener.bind(_this, true));
            window.addEventListener("keyup", _this.handleKeyListener.bind(_this, false));
            return _this;
        }
        KeyboardInputDevice.prototype.update = function () {
        };
        KeyboardInputDevice.prototype.handleKeyListener = function (state, _a) {
            var code = _a.code;
            if (code.startsWith("Key"))
                code = code.substring(3, Infinity);
            this.setButton(code, state);
        };
        return KeyboardInputDevice;
    })(InputDeviceAbstract));
    ((function (_super) {
        __extends(MouseInputDevice, _super);
        function MouseInputDevice() {
            var _this = _super.call(this, "mouse", ["Left", "Center", "Right"], [], []) || this;
            window.addEventListener("mousedown", _this.handleKeyListener.bind(_this, true));
            window.addEventListener("mouseup", _this.handleKeyListener.bind(_this, false));
            return _this;
        }
        MouseInputDevice.prototype.update = function () {
        };
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
    })(InputDeviceAbstract));
    ((function (_super) {
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
    })(InputDeviceAbstract));
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
    ((function (_super) {
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
            this.add(unionName, false);
            this.updateUnion(unionName);
        };
        return ButtonInputState;
    })(InputState));

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

    var _a;
    var AssetType;
    (function (AssetType) {
        AssetType["Image"] = "image";
        AssetType["Sound"] = "sound";
        AssetType["Level"] = "level";
    })(AssetType || (AssetType = {}));
    (_a = {},
        _a[AssetType.Image] = new Set([".png", ".jpg", ".jpeg", ".gif", ".tif", ".tiff"]),
        _a[AssetType.Sound] = new Set([".mp3", ".wav", ".ogg"]),
        _a[AssetType.Level] = new Set([".json"]),
        _a);
    var assets = {};
    var loadQueue = [];
    var useSound = false;
    var inited$1 = false;
    var unsafeLevelLoading = false;
    var totalLateAssets = 0;
    var loadingAssets = 0;
    var loadedLateAssets = 0;
    var errorImage;
    var errorSound;
    function init$6(_useSound) {
        useSound = _useSound;
        if (useSound && typeof p5__default["default"].SoundFile !== "function") {
            throw Error("p5.Sound was not found; Can't initialize Brass loader sound without p5.Sound loaded first");
        }
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
        inited$1 = true;
        loadQueuedAssets();
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
        if (!inited$1)
            return;
        if (loadingAssets >= 2)
            return;
        var assetEntry = loadQueue.shift();
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
            case AssetType.Level:
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
        if (assetEntry.type === AssetType.Level) {
            expect(assetEntry.fields !== undefined);
            data = parseLevelJson(assetEntry.fields, data);
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
    function parseLevelJson(fields, json) {
        var e_2, _a, e_3, _b, e_4, _c, e_5, _d, e_6, _e;
        if (json.type !== "map") {
            throw Error("Level file was not of type \"map\"");
        }
        {
            if (json.version < 1.4) {
                throw Error("Level file version was not 1.4; Run setUnsafeLevelLoading() to ignore this");
            }
            if (json.infinite !== false) {
                throw Error("Level file may be infinite; Run setUnsafeLevelLoading() to ignore this");
            }
            if (json.orientation !== "orthogonal") {
                throw Error("Level file was not orthogonal; Run setUnsafeLevelLoading() to ignore this");
            }
            if (json.renderorder !== "right-down") {
                throw Error("Level file was not rendered right down; Run setUnsafeLevelLoading() to ignore this");
            }
        }
        var _f = __read(searchTiledObj(json), 2), tileLayers = _f[0], objectLayers = _f[1];
        var level = {
            width: json.width,
            height: json.height,
            objects: [],
            fields: {},
            tilesets: {}
        };
        var _loop_1 = function (fieldName) {
            var fieldType = fields[fieldName];
            if (fieldType === "sparse") {
                throw Error("Level file had sparse type in field declaration; This is not supported");
            }
            var layerIndex = tileLayers.findIndex(function (layer) { return layer.name === fieldName; });
            if (layerIndex === -1) {
                throw Error("Level file did not have layer named (".concat(fieldName, ") like in the field decleration"));
            }
            var layer = tileLayers[layerIndex];
            {
                if (layer.compression !== "" && layer.compression !== undefined) {
                    throw Error("Level file has compression; Run setUnsafeLevelLoading() to ignore this");
                }
                if (layer.encoding !== "base64" && layer.encoding !== undefined) {
                    throw Error("Level file has unknown encoding (".concat(layer.encoding, "); Run setUnsafeLevelLoading() to ignore this"));
                }
            }
            if (layer.encoding === "base64") {
                level.fields[fieldName] = {
                    type: fieldType,
                    data: layer.data,
                    encoding: "uint32"
                };
            }
            else {
                level.fields[fieldName] = {
                    type: fieldType,
                    data: layer.data
                };
            }
        };
        for (var fieldName in fields) {
            _loop_1(fieldName);
        }
        if (objectLayers.length > 0) {
            if (objectLayers.length > 1 && !unsafeLevelLoading) {
                throw Error("Level file had multiple object layers; Run setUnsafeLevelLoading() to combine them");
            }
            try {
                for (var objectLayers_1 = __values(objectLayers), objectLayers_1_1 = objectLayers_1.next(); !objectLayers_1_1.done; objectLayers_1_1 = objectLayers_1.next()) {
                    var layer = objectLayers_1_1.value;
                    try {
                        for (var _g = (e_3 = void 0, __values(layer.objects)), _h = _g.next(); !_h.done; _h = _g.next()) {
                            var object = _h.value;
                            level.objects.push(object);
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
                level.tilesets[tilesetName] = {
                    firstId: tileset.firstgid,
                    tiles: {}
                };
                if (!Array.isArray(tileset.tiles))
                    continue;
                try {
                    for (var _l = (e_5 = void 0, __values(tileset.tiles)), _m = _l.next(); !_m.done; _m = _l.next()) {
                        var tile = _m.value;
                        var tileId = tile.id;
                        level.tilesets[tilesetName].tiles[tileId] = {};
                        if (!Array.isArray(tile.properties))
                            continue;
                        try {
                            for (var _o = (e_6 = void 0, __values(tile.properties)), _p = _o.next(); !_p.done; _p = _o.next()) {
                                var property = _p.value;
                                level.tilesets[tilesetName].tiles[tileId][property.name] = property.value;
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
        return level;
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
        else {
            throw Error("Level file has unknown layer type (".concat(obj.type, "); Run setUnsafeLevelLoading() to ignore this"));
        }
        return [tileLayers, objectLayers];
    }

    var lastUpdateTime = 0;
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

    var LayerAbstract = (function () {
        function LayerAbstract(creator, resizer) {
            if (resizer === void 0) { resizer = creator; }
            this.id = Symbol();
            this.creator = creator;
            this.resizer = resizer;
            this.setMaps(null);
        }
        LayerAbstract.prototype.hasSize = function () {
            return this.size !== null;
        };
        LayerAbstract.prototype.getSize = function (ratio) {
            if (ratio === void 0) { ratio = 1; }
            if (this.size === null)
                this.throwSizeError();
            return {
                x: this.size.x * ratio,
                y: this.size.y * ratio
            };
        };
        LayerAbstract.prototype.sizeMaps = function (size) {
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
        LayerAbstract.prototype.setMaps = function (maps) {
            if (maps === null) {
                this.maps === new Proxy({}, { get: this.throwSizeError });
            }
            else {
                this.maps = new Proxy(maps, { get: this.getMap.bind(this) });
            }
        };
        LayerAbstract.prototype.getMap = function (maps, mapName) {
            if (!Object.hasOwn(maps, mapName)) {
                throw Error("Can't get (".concat(mapName, ") map in DrawTarget"));
            }
            return maps[mapName];
        };
        LayerAbstract.prototype.throwSizeError = function () {
            throw Error("Could not use drawing layer, size has not been set");
        };
        return LayerAbstract;
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
    }(LayerAbstract));

    var sketch;
    function init$5(_sketch) {
        if (_sketch) {
            sketch = _sketch;
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
    }
    function getSketch() {
        return sketch;
    }

    var regl = null;
    var doReglRefresh = false;
    function init$4(drawTarget) {
        if (typeof createREGL !== "function") {
            throw Error("REGL was not found; Can't initialize Brass REGL without REGL.js loaded first");
        }
        var canvas = drawTarget.getMaps().canvas;
        regl = createREGL({ canvas: canvas });
    }
    function getRegl() {
        assert(regl !== null, "Could not access regl; Include regl.js and enable it in Brass.init() first");
        return regl;
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

    var drawTargets = new Map();
    var globalWidth, globalHeight;
    function resize(_width, _height) {
        if (_width === void 0) { _width = window.innerWidth; }
        if (_height === void 0) { _height = window.innerHeight; }
        globalWidth = _width;
        globalHeight = _height;
        getDrawTarget("default").refresh();
        syncDefaultDrawTargetWithSketch();
        honorReglRefresh();
    }
    function syncDefaultDrawTargetWithSketch() {
        var _a = getDrawTarget("default").getSize(), x = _a.x, y = _a.y;
        var sketch = getSketch();
        sketch.width = x;
        sketch.height = y;
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
    function getDrawTargetOf(name, classConstructor) {
        var drawTarget = getDrawTarget(name);
        if (!(drawTarget instanceof classConstructor)) {
            throw Error("Could not find (".concat(name, ") P5DrawTarget; DrawTarget under that name is not of subclass P5DrawTarget"));
        }
        return drawTarget;
    }
    var hasDrawTarget = drawTargets.has.bind(drawTargets);
    var DrawTarget = (function (_super) {
        __extends(DrawTarget, _super);
        function DrawTarget(creator, resizer, sizer) {
            if (resizer === void 0) { resizer = creator; }
            var _this = _super.call(this, creator, resizer) || this;
            _this.size = null;
            _this.sizer = sizer !== null && sizer !== void 0 ? sizer : _this.defaultSizer;
            return _this;
        }
        DrawTarget.prototype.setSizer = function (sizer) {
            this.sizer = sizer;
            this.ensureSize();
            this.refresh();
        };
        DrawTarget.prototype.getMaps = function () {
            this.ensureSize();
            return this.maps;
        };
        DrawTarget.prototype.ensureSize = function () {
            if (this.size === null) {
                this.size = this.getSizerResult();
                this.setMaps(this.creator(this.size));
            }
        };
        DrawTarget.prototype.refresh = function (causes) {
            var e_1, _a, e_2, _b;
            if (causes === void 0) { causes = []; }
            var size = this.getSizerResult();
            if (this.size !== null && this.size.x === size.x && this.size.y === size.y)
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
        DrawTarget.prototype.hasName = function (name) {
            if (!hasDrawTarget(name))
                return false;
            return getDrawTarget(name).id === this.id;
        };
        DrawTarget.prototype.getSizerResult = function () {
            var floatSize = this.sizer(this);
            return {
                x: Math.floor(floatSize.x),
                y: Math.floor(floatSize.y)
            };
        };
        DrawTarget.prototype.defaultSizer = function (self) {
            if (!hasDrawTarget("default")) {
                throw Error("Can't use draw target, run Brass.init() first");
            }
            if (self.hasName("default")) {
                return {
                    x: globalWidth,
                    y: globalHeight
                };
            }
            return getDrawTarget("default").getSize();
        };
        return DrawTarget;
    }(LayerAbstract));

    function getDefaultP5DrawTarget() {
        return getDrawTargetOf("defaultP5", P5DrawTarget);
    }
    ((function (_super) {
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
    })(DrawBuffer));
    var P5DrawTarget = (function (_super) {
        __extends(P5DrawTarget, _super);
        function P5DrawTarget(sizer, arg) {
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

    var viewpoints = [];
    function getViewpoints() {
        return viewpoints;
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
            viewpoints.push(this);
        }
        ViewpointAbstract.prototype.view = function (d) {
            if (d === void 0) { d = getDefaultP5DrawTarget(); }
            var g = d.getMaps().canvas;
            var viewOrigin = this.getViewOrigin(d);
            g.translate(viewOrigin.x, viewOrigin.y);
            g.scale(this.effectiveScale);
            var translation = this.effectiveTranslation;
            g.translate(-translation.x, -translation.y);
            g.translate(-this.shakePosition.x, -this.shakePosition.y);
        };
        ViewpointAbstract.prototype.getScreenViewArea = function (d) {
            if (d === void 0) { d = getDefaultP5DrawTarget(); }
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
            if (d === void 0) { d = getDefaultP5DrawTarget(); }
            var g = d.getMaps().canvas;
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
            if (d === void 0) { d = getDefaultP5DrawTarget(); }
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
            if (d === void 0) { d = getDefaultP5DrawTarget(); }
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
        ClassicViewpoint.prototype.update = function () {
        };
        ClassicViewpoint.prototype.getViewOrigin = function () {
            return new Vector2(0, 0);
        };
        return ClassicViewpoint;
    }(ViewpointAbstract));

    var defaultViewpoint;
    function init$3(viewpoint) {
        if (viewpoint === undefined) {
            setDefaultViewpoint(new ClassicViewpoint(1, new Vector2(0, 0)));
        }
        else {
            setDefaultViewpoint(viewpoint);
        }
    }
    function update$4(delta) {
        var e_1, _a;
        try {
            for (var _b = __values(getViewpoints()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var viewpoint = _c.value;
                viewpoint.update(delta);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    function setDefaultViewpoint(viewpoint) {
        defaultViewpoint = viewpoint;
    }
    function getDefaultViewpoint$1() {
        if (defaultViewpoint === undefined)
            throw Error("Could not find default viewpoint; maybe run Brass.init() first");
        return defaultViewpoint;
    }

    function getDefaultCanvasDrawTarget() {
        return getDrawTargetOf("defaultCanvas", CanvasDrawTarget);
    }
    var CanvasDrawTarget = (function (_super) {
        __extends(CanvasDrawTarget, _super);
        function CanvasDrawTarget(sizer) {
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

    function init$2(doRegl, drawTarget) {
        initDefaultDrawTarget(doRegl, drawTarget);
        var defaultDrawTarget = getDrawTarget("default");
        addDrawTargetElement(defaultDrawTarget);
        if (doRegl)
            init$4(getDefaultCanvasDrawTarget());
    }
    function initDefaultDrawTarget(doRegl, drawTarget) {
        if (drawTarget === undefined) {
            var sketch = getSketch();
            sketch.createCanvas(windowWidth, windowHeight);
            var drawTarget_1 = new P5DrawTarget(undefined, sketch);
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
                    setDrawTarget("defaultCanvas", drawTarget);
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
        resize();
        syncDefaultDrawTargetWithSketch();
    }
    function addDrawTargetElement(drawTarget) {
        var htmlCanvas;
        if (drawTarget instanceof P5DrawTarget) {
            htmlCanvas = drawTarget.getMaps().canvas
                .canvas;
        }
        if (drawTarget instanceof CanvasDrawTarget) {
            htmlCanvas = drawTarget.getMaps().canvas;
        }
        if (htmlCanvas) {
            var sketch = getSketch();
            if (sketch._userNode) {
                sketch._userNode.appendChild(htmlCanvas);
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

    var spaceScale;
    var world;
    function setMatterWorld(_world) {
        world = _world;
    }
    function getMatterWorld() {
        return world;
    }
    function assertMatterWorld(action) {
        if (action === void 0) { action = ""; }
        assert(getMatterWorld() !== undefined, "Failed ".concat(action, ", Matter physics is not running"));
    }
    function setSpaceScale(_spaceScale) {
        spaceScale = _spaceScale !== null && _spaceScale !== void 0 ? _spaceScale : 1;
    }
    function getSpaceScale() {
        return spaceScale;
    }
    var BodyAbstract = (function () {
        function BodyAbstract() {
            this.sensors = [];
            this.alive = true;
            this.data = null;
            assertMatterWorld("creating a physics body");
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

    var bodies = Array(32).fill(null).map(function () { return new Map(); });
    var forceUnit = 1e-6;
    function getBodies() {
        return bodies;
    }
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
            Matter.World.add(getMatterWorld(), body);
        };
        Object.defineProperty(MaterialBodyAbstract.prototype, "position", {
            get: function () {
                var position = Vector2.fromObj(this.body.position).divScalar(getSpaceScale());
                return position.watch(this.positionWatcherMethod.bind(this));
            },
            set: function (position) {
                var spaceScale = getSpaceScale();
                position = Matter.Vector.create(position.x * spaceScale, position.y * spaceScale);
                Matter.Body.setPosition(this.body, position);
            },
            enumerable: false,
            configurable: true
        });
        MaterialBodyAbstract.prototype.positionWatcherMethod = function (position) {
            this.position = position;
        };
        Object.defineProperty(MaterialBodyAbstract.prototype, "velocity", {
            get: function () {
                var velocity = Vector2.fromObj(this.body.velocity).divScalar(getSpaceScale());
                return velocity.watch(this.velocityWatcherMethod.bind(this));
            },
            set: function (velocity) {
                var spaceScale = getSpaceScale();
                velocity = Matter.Vector.create(velocity.x * spaceScale, velocity.y * spaceScale);
                Matter.Body.setVelocity(this.body, velocity);
            },
            enumerable: false,
            configurable: true
        });
        MaterialBodyAbstract.prototype.velocityWatcherMethod = function (velocity) {
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
            var spaceScale = getSpaceScale();
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
            Matter.World.remove(getMatterWorld(), this.body);
        };
        return MaterialBodyAbstract;
    }(BodyAbstract));

    var rays = new Map();
    function getRays() {
        return rays;
    }
    ((function (_super) {
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
            set: function (_) {
            },
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
        RayBody.prototype.rotate = function () {
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
            var spaceScale = getSpaceScale();
            var displacement = _displacement.multScalar(spaceScale);
            var testBrassBodies = [];
            for (var i = 0; i < 32; i++) {
                if (!(this.mask & (1 << i)))
                    continue;
                var catagoryBodies = getBodies()[i];
                testBrassBodies.push.apply(testBrassBodies, __spreadArray([], __read(Array.from(catagoryBodies.values())), false));
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
    })(BodyAbstract));

    var lastDelta = null;
    var engine;
    function init$1(_options) {
        var _a;
        if (_options === void 0) { _options = {}; }
        if (typeof Matter !== "object") {
            throw Error("Matter was not found; Can't initialize Brass physics without Matter.js loaded first");
        }
        setSpaceScale(_options.spaceScale);
        (_a = _options.gravity) !== null && _a !== void 0 ? _a : (_options.gravity = { scale: 0 });
        var options = _options;
        engine = Matter.Engine.create(options);
        setMatterWorld(engine.world);
        Matter.Events.on(engine, "collisionActive", handleActiveCollisions);
    }
    function handleActiveCollisions(_a) {
        var pairs = _a.pairs;
        var spaceScale = getSpaceScale();
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
    function update$3(delta) {
        var e_2, _a;
        assertMatterWorld("updating physics");
        if (lastDelta === null)
            lastDelta = delta;
        if (lastDelta !== 0) {
            Matter.Engine.update(engine, delta, delta / lastDelta);
        }
        lastDelta = delta;
        try {
            for (var _b = __values(getRays().values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var ray = _c.value;
                var _d = ray.castOverTime(delta), body = _d.body, point_1 = _d.point;
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

    var loadingScreenHue = Math.random() * 360;
    var loadingTips;
    var loadingTipIndex;
    var loadingTipEndTime;
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
    function drawLoading(d) {
        if (d === void 0) { d = getDefaultP5DrawTarget(); }
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
    function update$2(delta) {
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
    function removeParticles(amount) {
        var sortedParticles = __spreadArray([], __read(particles.entries()), false).sort(function (a, b) { return a[1].radius - b[1].radius; });
        amount = Math.min(amount, Math.floor(sortedParticles.length / 5));
        for (var i = 0; i < amount * 5; i += 5) {
            sortedParticles[i][1].kill();
            particles.delete(sortedParticles[i][0]);
        }
    }

    ((function () {
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
            if (d === void 0) { d = getDefaultP5DrawTarget(); }
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
                if (this.position.dist(this.path[0]) < this.pathfinder.pathMinDist) {
                    var pathNode = this.path.shift().floor();
                    this.pathfinder.setPheromones(pathNode);
                }
                else {
                    if (this.position.dist(this.path[0]) > this.pathfinder.pathMaxDist) {
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
                var atGoal = goalDistance < this.pathfinder.pathMinDist * 2;
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
                if (this.direction.mag < this.pathfinder.pathMinDist * 3 && random() < 0.2) {
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
    })());

    var PathSituationType;
    (function (PathSituationType) {
        PathSituationType[PathSituationType["Inital"] = 0] = "Inital";
        PathSituationType[PathSituationType["Processing"] = 1] = "Processing";
        PathSituationType[PathSituationType["Failed"] = 2] = "Failed";
        PathSituationType[PathSituationType["Succeed"] = 3] = "Succeed";
    })(PathSituationType || (PathSituationType = {}));

    var pathfinders = [];
    function getPathfinders() {
        return pathfinders;
    }

    var pathfinderUpdateTime = 3;
    var waitingPathfinder = 0;
    function update$1() {
        var endTime = getExactTime() + pathfinderUpdateTime;
        var pathfinders = getPathfinders();
        var lastPathfinderIndex = waitingPathfinder + pathfinders.length;
        for (var _i = waitingPathfinder; _i < lastPathfinderIndex; _i++) {
            var i = _i % pathfinders.length;
            waitingPathfinder = (_i + 1) % pathfinders.length;
            pathfinders[i].update(endTime);
            if (getExactTime() > endTime)
                return;
        }
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
            var spaceScale = getSpaceScale();
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
            var e_1, _a, e_2, _b;
            var startX = Math.max(0, minX), startY = Math.max(0, minY), endX = Math.min(this.width, maxX), endY = Math.min(this.height, maxY);
            var stripMap = new Map();
            for (var y = startY; y < endY; y++) {
                var runStart = undefined;
                for (var x = startX; x < endX; x++) {
                    if (grid[x + y * this.width]) {
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
            var row = this.width;
            var length = this.width * this.height;
            try {
                for (var _c = __values(stripMap.entries()), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var _e = __read(_d.value, 2), key_1 = _e[0], strip = _e[1];
                    for (var otherKey = key_1 + row; otherKey < length; otherKey += row) {
                        var otherStrip = stripMap.get(otherKey);
                        if (otherStrip === undefined ||
                            otherStrip.width !== strip.width)
                            break;
                        strip.height += otherStrip.height;
                        stripMap.delete(otherKey);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
            var parts = [];
            var scaleProduct = this.gridScale * getSpaceScale();
            try {
                for (var _f = __values(stripMap.entries()), _g = _f.next(); !_g.done; _g = _f.next()) {
                    var _h = __read(_g.value, 2), key_2 = _h[0], strip = _h[1];
                    var x = key_2 % this.width, y = Math.floor(key_2 / this.width);
                    var part = createRectBodyFast(x * scaleProduct, y * scaleProduct, strip.width * scaleProduct, strip.height * scaleProduct);
                    part.__brassBody__ = this;
                    parts.push(part);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                }
                finally { if (e_2) throw e_2.error; }
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

    var tilemaps = [];
    function getTilemaps() {
        return tilemaps;
    }
    var TilemapAbstract = (function () {
        function TilemapAbstract(width, height, options) {
            if (options === void 0) { options = {}; }
            var _a, _b, _c, _d;
            this.identity = Symbol();
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
            if (getMatterWorld() !== undefined && options.body === undefined) {
                console.warn("Matter physics is active but Tilemap does not have body; If this is intentional pass false for the body option");
            }
            this.hasBody = !!options.body;
            this.autoMaintainBody = (_d = options.autoMaintainBody) !== null && _d !== void 0 ? _d : true;
            this.getTileData = this.bindOptionFunction(options.getTileData, this.get);
            this.isTileSolid = this.bindNullableOptionFunction(options.isTileSolid);
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
            tilemaps.push(this);
        }
        TilemapAbstract.prototype.bindOptionFunction = function (func, fallbackFunc) {
            if (!func)
                return fallbackFunc;
            return safeBind(func, this);
        };
        TilemapAbstract.prototype.bindNullableOptionFunction = function (func) {
            if (!func)
                return null;
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
            this.identity = Symbol();
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
                throw Error("Tried to import (null) as world; Did you pass Brass.getLevel() before the world loaded?");
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
            this.identity = Symbol();
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

    function update() {
        var e_1, _a;
        try {
            for (var _b = __values(getTilemaps()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var tilemap = _c.value;
                tilemap.maintain();
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }

    var inited = false;
    var testStatus = null;
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
        init$5(options.sketch);
        init$7();
        init$2((_a = options.regl) !== null && _a !== void 0 ? _a : false, options.drawTarget);
        init$3(options.viewpoint);
        var targetFrameRate = Math.min(_targetFrameRate, (_b = options.maxFrameRate) !== null && _b !== void 0 ? _b : 60);
        var sketch = getSketch();
        sketch.frameRate(targetFrameRate);
        targetTimeDelta = 1000 / targetFrameRate;
        maxTimeDelta = (_c = options.maxTimeDelta) !== null && _c !== void 0 ? _c : targetTimeDelta * 2.0;
        minTimeDelta = (_d = options.minTimeDelta) !== null && _d !== void 0 ? _d : targetTimeDelta * 0.5;
        update$5();
        init$6((_e = options.sound) !== null && _e !== void 0 ? _e : false);
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
        var sketch = getSketch();
        if (sketch.brassUpdate !== undefined)
            sketch.brassUpdate(simDelta);
        updateLate(simDelta);
        if (sketch.brassDraw !== undefined) {
            syncDefaultDrawTargetWithSketch();
            getDefaultP5DrawTarget().getMaps().canvas.resetMatrix();
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
        return simDelta;
    }
    function updateEarly() {
        update$5();
        update$6();
    }
    function updateLate(delta) {
        enforceInit("updating Brass");
        if (runningPhysics)
            update$3(delta);
        update$4(delta);
        update();
        update$1();
        update$2(delta);
    }

    var LighterAbstract = (function () {
        function LighterAbstract(options) {
            if (options === void 0) { options = {}; }
            var _a;
            this.resolution = (_a = options.resolution) !== null && _a !== void 0 ? _a : 0.5;
        }
        return LighterAbstract;
    }());

    function generateTraceFragShader(sdfTypeArray) {
        var glslFunctions = sdfTypeArray.map(function (stdType) {
            var functionBody = stdType.glslFunction.trim();
            return "float find".concat(stdType.name, " ").concat(functionBody);
        });
        var glslCases = sdfTypeArray.map(function (sdfType, index) {
            var sdfOptions = ["location"];
            for (var i = 0; i < sdfType.propertyCount; i++) {
                sdfOptions.push("getSdfData(address + ".concat(3 + i, ")"));
            }
            var sdfCall = "find".concat(sdfType.name, "(").concat(sdfOptions.join(", "), ")");
            return "\t\tcase ".concat(index, ":\n\t\t\treturn ").concat(sdfCall, ";");
        });
        glslFunctions.push("\nfloat findSdf(vec2 position, int address) {\n\tint sdfType = int(getSdfData(address));\n\tvec2 location = position - vec2(getSdfData(address + 1), getSdfData(address + 2));\n\t\n\tswitch(sdfType) {\n".concat(glslCases.join("\n"), "\n\t}\n\t\n\treturn 1e20; // failed to find sdf\n}\n").trim());
        var glslSdfInjection = glslFunctions.join("\n\n");
        return "\n#version 100\n\nprecision mediump float;\nprecision mediump int;\n\nfloat getSdfData(int address) {\n\n}\n\n".concat(glslSdfInjection, "\n\nvoid main() {\n\tgl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n}\n\t").trim();
    }

    function makeAirMaterial() {
        return {
            reflectivity: 0,
            indexOfRefraction: 1,
            scattering: 0,
            transmissionCurve: new Array(256).fill(1),
        };
    }
    function makeSolidMaterial(reflectedWavelengthCenter, reflectedWavelengthRange) {
        if (reflectedWavelengthCenter === void 0) { reflectedWavelengthCenter = 215; }
        if (reflectedWavelengthRange === void 0) { reflectedWavelengthRange = 40; }
        return {
            reflectivity: 1,
            indexOfRefraction: 1,
            scattering: 1.57,
            transmissionCurve: new Array(256).fill(1).map(function (_, wavelength) {
                var reflected = Math.abs(wavelength - reflectedWavelengthCenter) < reflectedWavelengthRange;
                return reflected ? 1 : 0.2;
            }),
        };
    }
    function makeGlassMaterial(reflectedWavelengthCenter, reflectedWavelengthRange) {
        if (reflectedWavelengthCenter === void 0) { reflectedWavelengthCenter = 127; }
        if (reflectedWavelengthRange === void 0) { reflectedWavelengthRange = 110; }
        return {
            reflectivity: 0,
            indexOfRefraction: 1.52,
            scattering: 0.05,
            transmissionCurve: new Array(256).fill(1).map(function (_, wavelength) {
                var reflected = Math.abs(wavelength - reflectedWavelengthCenter) < reflectedWavelengthRange;
                return reflected ? 1 : 0.5;
            }),
        };
    }
    var SdfAbstract = (function () {
        function SdfAbstract(x, y) {
            this.position = new Vector2(x, y);
        }
        SdfAbstract.prototype.getSdf = function (position) {
            var location = position.copy().sub(this.position);
            return this.javascriptFunction.apply(this, __spreadArray([location], __read(this.getProperties()), false));
        };
        return SdfAbstract;
    }());
    var CircleSdf = (function (_super) {
        __extends(CircleSdf, _super);
        function CircleSdf(x, y, radius) {
            var _this = _super.call(this, x, y) || this;
            _this.radius = radius;
            return _this;
        }
        CircleSdf.prototype.getProperties = function () {
            return [this.radius];
        };
        CircleSdf.prototype.javascriptFunction = function (location, radius) {
            return location.mag - radius;
        };
        CircleSdf.propertyCount = 1;
        CircleSdf.glslFunction = "\n(vec2 location, float radius) { \n\treturn length(location) - radius;\n}\n";
        return CircleSdf;
    }(SdfAbstract));
    var ReglLighter = (function (_super) {
        __extends(ReglLighter, _super);
        function ReglLighter(options) {
            var _this = this;
            var _a, _b, _c;
            _this = _super.call(this, options) || this;
            _this.materialIndexMap = new Map();
            _this.materialNames = new Array(256).fill(null);
            _this.materials = new Array(256).fill(null).map(makeAirMaterial);
            _this.getTilemapMaterial = (_a = options.getTilemapMaterial) !== null && _a !== void 0 ? _a : _this.defaultgetTilemapMaterial;
            if ((_b = options.setDefaultMaterials) !== null && _b !== void 0 ? _b : true) {
                _this.setMaterial("air", makeAirMaterial());
                _this.setMaterial("solid", makeSolidMaterial());
                _this.setMaterial("glass", makeGlassMaterial());
            }
            _this.tilemap = options.tilemap;
            var sdfTypeArray = (_c = options.sdfTypes) !== null && _c !== void 0 ? _c : [CircleSdf];
            _this.sdfTypeMap = new Map(sdfTypeArray.map(function (sdfType, index) { return [sdfType, index]; }));
            console.log(generateTraceFragShader(sdfTypeArray));
            return _this;
        }
        ReglLighter.prototype.setMaterial = function (name, material) {
            for (var i = 0; i < 256; i++) {
                var indexName = this.materialNames[i];
                if (indexName === null || indexName === name) {
                    this.materialIndexMap.set(name, i);
                    this.materialNames[i] = name;
                    this.materials[i] = material;
                    return;
                }
            }
            throw Error("Failed to assign new material, all 256 material indices in use.");
        };
        ReglLighter.prototype.deleteMaterial = function (name) {
            this.materialIndexMap.delete(name);
        };
        ReglLighter.prototype.begin = function (v, d) {
            if (v === void 0) { v = getDefaultViewpoint(); }
            if (d === void 0) { d = getDefaultCanvasDrawTarget(); }
            if (this.lastTilemapIdentity !== this.tilemap.identity) {
                this.lastTilemapIdentity = this.tilemap.identity;
            }
            return this;
        };
        ReglLighter.prototype.end = function (d) {
            if (d === void 0) { d = getDefaultCanvasDrawTarget(); }
            return this;
        };
        ReglLighter.prototype.defaultgetTilemapMaterial = function (tilemap, x, y) {
            return tilemap.getSolid(x, y) ? "solid" : "air";
        };
        return ReglLighter;
    }(LighterAbstract));
    function getDefaultViewpoint() {
        throw new Error("Function not implemented.");
    }

    var ReglTilemap = (function (_super) {
        __extends(ReglTilemap, _super);
        function ReglTilemap(width, height, options) {
            if (options === void 0) { options = {}; }
            return _super.call(this, width, height, options) || this;
        }
        ReglTilemap.prototype.draw = function (v, d) {
            if (v === void 0) { v = getDefaultViewpoint$1(); }
            if (d === void 0) { d = getDefaultCanvasDrawTarget(); }
        };
        ReglTilemap.prototype.clearCaches = function () {
        };
        ReglTilemap.prototype.clearCacheAtTile = function (tileX, tileY) {
        };
        return ReglTilemap;
    }(TilemapAbstract));

    var tilemap;
    function setup() {
        init({});
        tilemap = new ReglTilemap(32, 32);
        new ReglLighter({
            tilemap: tilemap
        });
    }
    function draw() {
        tilemap.draw();
    }

    exports.draw = draw;
    exports.setup = setup;

    Object.defineProperty(exports, '__esModule', { value: true });

})(this.globalThis = this.globalThis || {}, p5);
