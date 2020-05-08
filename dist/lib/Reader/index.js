'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var ReaderM = /** @class */ (function () {
    function ReaderM(value) {
        this.type = "Reader";
        this.value = value;
        return this;
    }
    ReaderM.prototype.run = function (config) {
        return this.value(config);
    };
    ReaderM.prototype.get = function (config) {
        return this.run(config);
    };
    ReaderM.prototype.map = function (f) {
        var _this = this;
        return new ReaderM(function (a) { return f(_this.run(a)); });
    };
    ReaderM.prototype.flatMap = function (f) {
        var _this = this;
        return new ReaderM(function (a) { return f(_this.run(a)).run(a); });
    };
    ReaderM.prototype.ap = function (fa) {
        return this.map(fa.get(undefined));
    };
    ReaderM.prototype.zip = function (other) {
        return this.flatMap(function (a) { return other.map(function (b) { return [a, b]; }); });
    };
    return ReaderM;
}());
exports.ReaderM = ReaderM;
function Reader(value) {
    return Reader.apply(value);
}
exports.Reader = Reader;
/* istanbul ignore next */
(function (Reader) {
    function apply(fn) {
        return new ReaderM(fn);
    }
    Reader.apply = apply;
    function run(config, r) {
        return r.run(config);
    }
    Reader.run = run;
    function get(config, r) {
        return r.get(config);
    }
    Reader.get = get;
    function map(f, r) {
        return r.map(f);
    }
    Reader.map = map;
    function flatMap(f, r) {
        return r.flatMap(f);
    }
    Reader.flatMap = flatMap;
    function ap(fa, r) {
        return r.ap(fa);
    }
    Reader.ap = ap;
    function zip(other, r) {
        return r.flatMap(function (a) { return other.map(function (b) { return [a, b]; }); });
    }
    Reader.zip = zip;
})(Reader = exports.Reader || (exports.Reader = {}));
//# sourceMappingURL=index.js.map