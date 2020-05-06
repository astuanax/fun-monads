'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var Success = /** @class */ (function () {
    function Success(value) {
        this.type = 'Success';
        this.isSuccess = true;
        this.isFailure = false;
        this.value = value;
        return this;
    }
    Success.prototype.flatMap = function (f) {
        try {
            return f(this.value);
        }
        catch (err) {
            return new Failure(err);
        }
    };
    Success.prototype.map = function (f) {
        var _this = this;
        return Try.apply(function () { return f(_this.value); });
    };
    Success.prototype.fold = function (f, s) {
        return s(this.value);
    };
    Success.prototype.get = function () {
        return this.value;
    };
    Success.prototype.getOrElse = function (b) {
        return this.value;
    };
    Success.prototype.orElse = function (b) {
        return this;
    };
    Success.prototype.flatten = function () {
        if (this.value instanceof Try) {
            return this.value;
        }
        else {
            return this;
        }
    };
    Success.prototype.forEach = function (fn) {
        fn(this.get());
    };
    Success.prototype.filter = function (p) {
        try {
            return p(this.get())
                ? this
                : new Failure(new Error('Predicate does not hold for value ' + this.value));
        }
        catch (err) {
            return new Failure(err);
        }
    };
    Success.prototype.recover = function (pf) {
        return this;
    };
    Success.prototype.failed = function () {
        return new Failure(new Error('Unsupported operation. Success failed'));
    };
    return Success;
}());
exports.Success = Success;
var Failure = /** @class */ (function () {
    function Failure(value) {
        this.type = 'Failure';
        this.isSuccess = false;
        this.isFailure = true;
        this.value = value;
        return this;
    }
    Failure.prototype.flatMap = function (f) {
        return new Failure(this.value);
    };
    Failure.prototype.map = function (f) {
        var _this = this;
        return Try.apply(function () { return f(_this.value); });
    };
    Failure.prototype.fold = function (f, s) {
        return f(this.value);
    };
    Failure.prototype.get = function () {
        throw this.value;
    };
    Failure.prototype.getOrElse = function (b) {
        return b();
    };
    Failure.prototype.orElse = function (b) {
        try {
            return b();
        }
        catch (err) {
            return new Failure(err);
        }
    };
    Failure.prototype.flatten = function () {
        return new Failure(this.value);
    };
    Failure.prototype.forEach = function (fn) {
        // noop
    };
    Failure.prototype.filter = function (p) {
        return this;
    };
    Failure.prototype.recover = function (pf) {
        try {
            return pf(this.value);
        }
        catch (err) {
            return new Failure(err);
        }
    };
    Failure.prototype.failed = function () {
        return new Success(this.value);
    };
    return Failure;
}());
exports.Failure = Failure;
function Try(value) {
    return Try.apply(value);
}
exports.Try = Try;
(function (Try) {
    function success(value) {
        return new Success(value);
    }
    Try.success = success;
    function failure(value) {
        return new Failure(value);
    }
    Try.failure = failure;
    function apply(value) {
        try {
            return new Success(value());
        }
        catch (err) {
            return new Failure(err);
        }
    }
    Try.apply = apply;
    function isSuccess(a) {
        return a.isSuccess;
    }
    Try.isSuccess = isSuccess;
    function isFailure(a) {
        return a.isFailure;
    }
    Try.isFailure = isFailure;
    function flatMap(a, f) {
        return a.flatMap(f);
    }
    Try.flatMap = flatMap;
    function map(a, f) {
        return a.map(f);
    }
    Try.map = map;
    function fold(a, f, s) {
        return a.fold(f, s);
    }
    Try.fold = fold;
    function get(a) {
        return a.get();
    }
    Try.get = get;
    function getOrElse(a, b) {
        return a.getOrElse(b);
    }
    Try.getOrElse = getOrElse;
    function orElse(a, b) {
        return a.orElse(b);
    }
    Try.orElse = orElse;
    function flatten(a) {
        return a.flatten();
    }
    Try.flatten = flatten;
    function forEach(a, fn) {
        return a.forEach(fn);
    }
    Try.forEach = forEach;
    function filter(a, p) {
        return a.filter(p);
    }
    Try.filter = filter;
    function recover(a, pf) {
        return a.recover(pf);
    }
    Try.recover = recover;
    function failed(a) {
        return a.failed();
    }
    Try.failed = failed;
})(Try = exports.Try || (exports.Try = {}));
//# sourceMappingURL=index.js.map